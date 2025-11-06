import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConversationCard from './ConversationCard';
import style from '../../style.module.css'
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../socket';
import { logoutUser } from '../../features/userSlice';
import { addNewConversation, getConversationsThunk, updateLastMessage, updateUnreadThunk, getUsedPreKeysThunk } from '../../features/conversationsSlice';
import { deriveConversationKey, digestHex, exportPublicKey, generateECDHKeyPair, hashAESKeyToHex, hashPublicKeySpkiHex, importPeerPublicKey, loadKeyPair, storeAESKey, storeKeyPair } from '../../utils/cryptoUtils';

const dhProcessed = new Set();



const AllConversations = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const { conversations, selectedConversation } = useSelector(state => state.conversations)


    useEffect(() => {
        loggedInUser._id && dispatch(getUsedPreKeysThunk({ user: loggedInUser }))
    }, [loggedInUser])

    // e2e
    useEffect(() => {


        getSocket() && getSocket().on("new_conversation", async (data) => {
            try {

                dispatch(addNewConversation(data));

                if (data.conversation.userId_1._id != loggedInUser._id) {
                    return
                }

                const conversationId = data?.conversation?._id;
                if (!conversationId) return;

                const myKeyPair = await generateECDHKeyPair();
                await storeKeyPair(conversationId, myKeyPair);

                const publicKey = await exportPublicKey(myKeyPair.publicKey)

                // Transmit
                getSocket().emit("dh_public_key_sender", {
                    conversationId,
                    from: loggedInUser,
                    to: data?.conversation?.userId_2,
                    publicKey
                });
            } catch (e) {
                console.error("new_conversation failed:", e);
            }
        });



        getSocket() && getSocket().on("dh_public_key_sender", async ({ conversationId, from, publicKey, to }) => {
            try {
                if (!conversationId || !publicKey) return;

                // Import sender’s SPKI, re-export to SPKI, hash to verify transport integrity
                const reciverPubKey = await importPeerPublicKey(publicKey);
                // const spki = await window.crypto.subtle.exportKey("spki", reciverPubKey);
                // const recvPubHash = await digestHex(spki);
                // console.log("[E2EE] Receiver-saw Sender pub SPKI hash:", recvPubHash); // compare to sender’s log [web:176]

                const myPair = await generateECDHKeyPair();
                await storeKeyPair(conversationId, myPair);

                // Derive AES and log its hash (raw)
                const aesKey = await deriveConversationKey(myPair.privateKey, reciverPubKey);
                await storeAESKey(conversationId, aesKey);
                const recvAesHash = await hashAESKeyToHex(aesKey);
                console.log("[E2EE] Receiver derived AES hash:", recvAesHash); // should match sender’s later [web:133]

                // Reply with receiver pubkey and log its SPKI hash too (optional)
                const myPubHash = await hashPublicKeySpkiHex(myPair.publicKey);
                console.log("[E2EE] Receiver pub SPKI hash (outbound):", myPubHash); // diagnostic [web:176]
                const myPubB64 = await exportPublicKey(myPair.publicKey);
                getSocket().emit("dh_public_key_receiver", { conversationId, publicKey: myPubB64, to: from });
            } catch (e) {
                console.error("dh_public_key_sender handler failed:", e);
            }
        });



        getSocket() && getSocket().on("dh_public_key_receiver", async ({ conversationId, from, publicKey, to }) => {
            try {
                if (!conversationId || !publicKey) return;

                const myPair = await loadKeyPair(conversationId);
                if (!myPair) {
                    console.error("Missing initiator key pair for conversation:", conversationId);
                    return;
                }

                // Import receiver’s pubkey and log its SPKI hash for comparison
                const peerKey = await importPeerPublicKey(publicKey);
                const spki = await window.crypto.subtle.exportKey("spki", peerKey);
                const senderSawRecvPubHash = await digestHex(spki);
                console.log("[E2EE] Sender-saw Receiver pub SPKI hash:", senderSawRecvPubHash); // compare with receiver outbound log [web:176]

                // Derive AES and log its hash; should match the receiver’s derived AES hash
                const aesKey = await deriveConversationKey(myPair.privateKey, peerKey);
                await storeAESKey(conversationId, aesKey);
                const senderAesHash = await hashAESKeyToHex(aesKey);
                console.log("[E2EE] Sender derived AES hash:", senderAesHash); // must equal receiver derived AES hash [web:133]
            } catch (e) {
                console.error("dh_public_key_receiver handler failed:", e);
            }
        });

        return () => {
            getSocket() && getSocket().off("dh_public_key_sender")
            getSocket() && getSocket().off("dh_public_key_receiver")
            getSocket() && getSocket().off("new_conversation")
        }
    }, [loggedInUser])

    // useEffect(() => {
    //     getSocket() && getSocket().on("new_last_message", (data) => {
    //         if (selectedConversation?._id === data.conversationId) {
    //             data.unread = false
    //             dispatch(updateUnreadThunk(data.conversationId))
    //         }
    //         dispatch(updateLastMessage(data))
    //     })
    //     return () => getSocket() && getSocket().removeListener("new_last_message")
    // }, [])

    useEffect(() => {
        dispatch(getConversationsThunk({ userId: loggedInUser._id }))
    }, [loggedInUser])

    return (
        <div className={'overflow-auto ' + style.hideScrollbar}>
            {/* mobile layout */}
            <div className='flex lg:hidden items-center justify-between px-8'>
                <p className='text-[20px] p-1 px-2 bg-test-2 rounded-md font-bold mt-4 mb-2'>ZEXT</p>
                <div className='flex'>
                    <div className='w-12 h-12 rounded-full overflow-hidden mr-2'>
                        <img src={loggedInUser?.profileImg} alt="" />
                    </div>
                    <div className='flex items-center mr-2'>
                        <button onClick={() => {
                            dispatch(logoutUser())
                            navigate('/login')
                        }} className='px-4 py-2 rounded-full bg-test-3 font-bold text-white'>logout</button>
                    </div>
                    <div onClick={() => navigate("/mobile/all-users")} className='flex items-center justify-center'>
                        <div className='flex items-center justify-center h-[35px] w-[35px] bg-test-3 overflow-hidden rounded-full'>
                            <p className='font-bold-md text-white text-[26px] p-0 m-0 font-bold mb-1'>+</p>
                        </div>
                    </div>
                </div>
            </div>



            {/* desktop layout */}
            <div className='hidden lg:flex justify-center'>
                <p className='text-[20px] p-2 px-4 bg-test-2 rounded-md font-bold mt-4 mb-2'>ZEXT</p>
            </div>
            <div className='font-bold text-white text-center mt-4 mb-2'>Your Conversations</div>
            <div>
                <div className='w-[280px] h-[1px] mx-2'></div>
                {
                    conversations?.map(conversation => <ConversationCard conversation={conversation} key={conversation?._id} />)
                }
            </div>
        </div>
    );
};

export default AllConversations;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConversationCard from './ConversationCard';
import style from '../../style.module.css'
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../socket';
import { logoutUser } from '../../features/userSlice';
import { addNewConversation, getConversationsThunk, updateLastMessage, updateUnreadThunk } from '../../features/conversationsSlice';
import { deriveConversationKey, exportPublicKey, generateECDHKeyPair, importPeerPublicKey, loadKeyPair, storeAESKey, storeKeyPair } from '../../utils/cryptoUtils';

const AllConversations = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const { conversations, selectedConversation } = useSelector(state => state.conversations)

    useEffect(() => {
        getSocket() && getSocket().on("new_conversation", async (data) => {
            // e2e
            // When starting a new conversation:
            const myKeyPair = await generateECDHKeyPair();
            // stored DH key pair
            await storeKeyPair(data.conversation?._id, myKeyPair)
            console.log("set the mykeypair: " + "myKeyPair" + data.conversation?._id)
            // exported the key for transmission
            const myPublicKeyB64 = await exportPublicKey(myKeyPair.publicKey);
            // sending the key
            getSocket().emit("dh_public_key_sender", {
                conversationId: data.conversation?._id,
                from: loggedInUser,
                to: data.conversation.userId_2,
                publicKey: myPublicKeyB64
            });

            // const aesKey = await retrieveKeyForConversation(selectedConversation._id); // Load from IndexedDB
            // const { ciphertext, iv } = await encryptMessage(aesKey, e.target.text.value);

            dispatch(addNewConversation(data))
        })
        return () => {
            getSocket() && getSocket().off("new_conversation")
        }
    }, [conversations])


    // e2e
    useEffect(() => {
        // this is on receiver end. getting the sender public key and generating ECDH key pairs and aes key:
        getSocket() && getSocket().on("dh_public_key_sender", async ({ conversationId, from, publicKey }) => {
            const peerKey = await importPeerPublicKey(publicKey);
            const myKeyPair = await generateECDHKeyPair();
            const aesKey = await deriveConversationKey(myKeyPair.privateKey, peerKey);
            // Store aesKey securely, e.g., IndexedDB, mapped by conversationId
            await storeAESKey(conversationId, aesKey)
            const myPublicKeyB64 = await exportPublicKey(myKeyPair.publicKey);
            getSocket() && getSocket().emit("dh_public_key_receiver", {conversationId, publicKey: myPublicKeyB64, to: from})
        });

        // this is on sender end. getting the reciver public key and generating + saving the aes key:
        getSocket() && getSocket().on("dh_public_key_receiver", async ({ conversationId, from, publicKey }) => {
            const peerKey = await importPeerPublicKey(publicKey);
            const myKeyPair = await loadKeyPair(conversationId)
            const aesKey = await deriveConversationKey(myKeyPair.privateKey, peerKey);
            // Store aesKey securely, e.g., IndexedDB, mapped by conversationId
            await storeAESKey(conversationId, aesKey)
            console.log("aesKey on sender: ", aesKey)
        });

        return () => {
            getSocket() && getSocket().off("dh_public_key")
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
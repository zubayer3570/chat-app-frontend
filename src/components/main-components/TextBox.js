import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendTextThunk, addText, receiverTyping, receiverStoppedTyping } from '../../features/textSlice';
import Text from './Text';
import style from '../../style.module.css'
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../socket';
import Spinner from './Spinner';
import Typing from './Typing/Typing';
import { newConversationThunk } from '../../features/conversationsSlice';


const TextBox = () => {
    let userTyping = false;
    const navigate = useNavigate()
    const { loggedInUser, receiver } = useSelector(state => state.users)
    const { selectedConversation } = useSelector(state => state.conversations)
    const { texts, loading, typingReceiver } = useSelector(state => state.texts)
    const dispatch = useDispatch()

    const userTypingHandler = (e) => {
        if (e.target.value?.length > 0) {
            if (!userTyping) {
                getSocket() && getSocket().emit("typing", { typingUser: loggedInUser, receiver })
                userTyping = true
            }
        } else {
            getSocket() && getSocket().emit("typingStopped", { typingUser: loggedInUser, receiver })
            userTyping = false
        }
    }

    const handleSend = (e) => {
        e.preventDefault()

        const message = {
            sender: loggedInUser,
            receiver: receiver,
            text: e.target.text.value,
            unread: true,
            conversationId: selectedConversation?._id
        }

        dispatch(sendTextThunk({message}))

        getSocket() && getSocket().emit("typingStopped", { typingUser: loggedInUser, receiver })
        e.target.text.value = ""
    }

    useEffect(() => {
        getSocket() && getSocket().on("new_message", (data) => {
            if (selectedConversation?._id === data.conversationId && data?.receiver?._id === loggedInUser?._id) {
                dispatch(addText(data))
            }
        })
        return () => getSocket() && getSocket().removeListener("new_message")
    }, [selectedConversation])

    useEffect(() => {
        document.getElementById("tool")?.scrollIntoView()
    }, [texts])

    useEffect(() => {
        getSocket() && getSocket().on("typing", (data) => {
            if (receiver.email === data.typingUser.email) {
                dispatch(receiverTyping(data.typingUser))
            }
        })
        getSocket() && getSocket().on("typingStopped", (data) => {
            if (receiver.email === data.typingUser.email) {
                dispatch(receiverStoppedTyping())
            }
        })
        return () => {
            getSocket() && getSocket().off("typing")
            getSocket() && getSocket().off("typingStopped")
        }
    }, [receiver])

    return (
        <>
            <div className='flex flex-col justify-between relative shadow-1 h-full rounded-2xl'>
                {
                    receiver?._id ?
                        <>
                            <div className='flex justify-between sticky py-6 lg:py-0 lg:absolute top-0 w-full items-center px-4 lg:px-12 h-[50px] backdrop-blur-xl bg-opacity-0'>
                                <div className='flex items-center'>
                                    <span onClick={() => navigate('/mobile/conversations')} className='mr-2 inline lg:hidden text-white font-bold'>
                                        Back
                                    </span>
                                    <div className='w-[35px] h-[35px] rounded-full overflow-hidden'>
                                        <img src={receiver.profileImg} alt="" />
                                    </div>
                                </div>
                                <div>
                                    <p className='font-bold'>{receiver.name}</p>
                                </div>
                            </div>

                            <div className={'overflow-auto pt-[50px] pb-4 ' + style.hideScrollbar} >
                                {
                                    loading ?
                                        <Spinner />
                                        :
                                        texts?.map(text => <Text textDetails={text} key={text?._id} />)
                                }
                                <div>
                                    {
                                        typingReceiver ?
                                            <Typing receiverProfileImage={receiver.profileImg} />
                                            :
                                            ""
                                    }
                                </div>
                                <div id='tool' ></div>
                            </div>

                            {/* text input form */}
                            <form onSubmit={handleSend} className='flex bottom-0 w-full px-4 mb-3'>

                                <input onChange={userTypingHandler} type="text" name="text" className='grow h-[35px] rounded-l-full px-4' required />

                                <button type="submit" className='font-bold bg-test-3 h-[35px] rounded-r-full px-4 flex items-center'>
                                    <img src='/send.svg' className='h-[22px] w-[22px]' />
                                </button>

                            </form>
                        </>
                        :
                        <div></div>
                }
            </div>
        </>
    );
};

export default TextBox;
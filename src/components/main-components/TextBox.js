import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendTextThunk, addText, receiverTyping, receiverStoppedTyping } from '../../features/textSlice';
import Text from './Text';
import style from '../../style.module.css'
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { createNewConversation } from '../../customFunctions.js/createNewConversation';
import { newConversationThunk } from '../../features/userSlice';
import { selectConversation } from '../../features/conversationsSlice';
import { addNewConversation, updateLastMessage } from '../../features/conversationsSlice';
import Spinner from './Spinner';
const { nanoid } = require("nanoid")


const TextBox = () => {
    let userTyping = false;
    const navigate = useNavigate()
    const { loggedInUser, receiver } = useSelector(state => state.users)
    const { selectedConversation } = useSelector(state => state.conversations)
    const { texts, loading } = useSelector(state => state.texts)
    const dispatch = useDispatch()

    const userTypingHandler = (e) => {
        if (e.target.value.length > 0) {
            if (!userTyping) {
                socket.emit("typing", { typingUser: loggedInUser, receiver })
                userTyping = true
            }
        } else {
            socket.emit("typingStopped", { typingUser: loggedInUser, receiver })
            userTyping = false
        }
    }

    const handleSend = (e) => {
        e.preventDefault()

        const _id = nanoid()
        const message = {
            _id,
            sender: {
                _id: loggedInUser._id,
                name: loggedInUser.name,
                email: loggedInUser.email,
                profileImg: loggedInUser.profileImg,
                notificationToken: loggedInUser.notificationToken
            },
            receiver: {
                _id: receiver._id,
                name: receiver.name,
                email: receiver.email,
                profileImg: receiver.profileImg,
                notificationToken: receiver.notificationToken
            },
            text: e.target.text.value,
            unread: true,
            conversationID: selectedConversation._id
        }

        if (!message.conversationID) {
            let newConversation = createNewConversation(loggedInUser, receiver)
            message.conversationID = newConversation._id
            newConversation = { ...newConversation, lastMessage: message }
            socket.emit("new_conversation", newConversation)
            dispatch(addNewConversation(newConversation))
            dispatch(newConversationThunk(newConversation))
            dispatch(selectConversation(newConversation))
        }

        socket.emit("typingStopped", { typingUser: loggedInUser, receiver })
        dispatch(addText(message))
        dispatch(updateLastMessage(message))
        socket.emit("new_message", message)
        socket.emit("new_last_message", message)
        dispatch(sendTextThunk(message))
        e.target.text.value = ""
    }

    useEffect(() => {
        socket.on("new_message", (data) => {
            if (selectedConversation._id == data.conversationID) {
                dispatch(addText(data))
            }
        })
        return () => socket.removeListener("new_message")
    }, [selectedConversation])

    useEffect(() => {
        document.getElementById("tool")?.scrollIntoView()
    }, [texts])

    useEffect(() => {
        socket.on("typing", (data) => {
            if (receiver.email == data.typingUser.email) {
                dispatch(receiverTyping(data.typingUser))
            }
        })
        socket.on("typingStopped", (data) => {
            if (receiver.email == data.typingUser.email) {
                // console.log("hello-typing")
                dispatch(receiverStoppedTyping())
            }
        })
        return () => {
            socket.removeListener("typing")
            socket.removeListener("typingStopped")
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
                                        texts?.map(text => <Text text={text} key={text._id} />)
                                }
                                <div id='tool' ></div>
                            </div>
                            <form onSubmit={handleSend} className='flex bottom-0 w-full px-4 mb-3'>

                                {/* Message text input */}
                                <input onChange={userTypingHandler} type="text" name="text" className='grow h-[35px] rounded-l-full px-4' />

                                {/* submit button */}
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
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import { AllContext } from '../App';



const Conversation = () => {
    const { userContext, receiverContext, currentConversationContext, socketContext } = useContext(AllContext)
    // const [conversationPeoples, setConversationPeoples] = useState([])
    // const [conversations, setConversations] = useState([])
    const [conversations, setConversations] = useState([])
    const userID = userContext.user?._id

    // getting conversations and conversation people info
    useEffect(() => {
        axios.get(`https://chat-app-pzz6.onrender.com/get-conversations/${userID}`).then(res => {
            setConversations(res.data)
            socketContext.socket.emit('new_conversation', res.data)
        })
    }, [])

    socketContext.socket.on('new_conversation', (data) => {
        setConversations([...conversations, data])
    })

    const handler = (conversation) => {
        currentConversationContext.setCurrentConversation(conversation)
        socketContext.socket.emit('new_opened_conversation', { openedConversationID: conversation._id, userID: userContext.user._id })
        if (userID == conversation.participants[0]._id) {
            receiverContext.setReceiver(conversation.participants[1])
        } else {
            receiverContext.setReceiver(conversation.participants[0])
        }
    }
    return (
        <div id='conversations' className='bg-red-200 px-4 h-[100vh]'>
            <div className='flex items-center font-bold'>
                <div className='h-[50px] w-[50px] rounded-[50%] overflow-hidden pr-4'>
                    <img src={userContext.user?.profileImg} alt="" />
                </div>
                <div>
                    <p>{userContext.user?.username}</p>
                </div>
            </div>
            <div className='flex justify-center items-center font-bold h-[50px]' >Conversations</div>
            {
                conversations?.map(conversation => <div key={conversation._id} onClick={() => handler(conversation)}><UserCard userData={userID == conversation.participants[0]._id ? conversation.participants[1] : conversation.participants[0]} /></div>)
            }
        </div>
    );
};

export default Conversation;
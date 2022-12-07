import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';
import { AllContext, CurrentConversationContext } from '../App';

const Conversation = () => {
    const { userContext, receiverContext, currentConversationContext } = useContext(AllContext)
    const [conversationPeoples, setConversationPeoples] = useState([])
    const [conversations, setConversations] = useState([])
    const userID = userContext.user._id

    // getting conversations and conversation people info
    useEffect(() => {
        axios.get(`https://chat-app-pzz6.onrender.com/get-conversations/${userID}`).then(res => {
            setConversationPeoples(res.data.conversationPeople)
            setConversations(res.data.conversations)
        })
    }, [])

    return (
        <div id='conversations' className='bg-red-200 px-4 h-[100vh]'>
            <div className='flex justify-center items-center font-bold h-[50px]' >Conversations</div>
            {
                conversationPeoples?.map(conversationPeople => <div key={conversationPeople._id} onClick={() => {
                    currentConversationContext.setCurrentConversation(conversations[conversationPeoples.indexOf(conversationPeople)])
                    receiverContext.setReceiver(conversationPeople)
                }}><UserCard username={conversationPeople.username} /></div>)
            }
        </div>
    );
};

export default Conversation;
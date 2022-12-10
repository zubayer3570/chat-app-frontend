import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import UserCard from './UserCard';
import { AllContext } from '../App';

const Conversation = () => {
    const { userContext, receiverContext, currentConversationContext } = useContext(AllContext)
    // const [conversationPeoples, setConversationPeoples] = useState([])
    // const [conversations, setConversations] = useState([])
    const [conversations, setConversations] = useState([])
    const userID = userContext.user._id

    // getting conversations and conversation people info
    useEffect(() => {
        axios.get(`https://chat-app-pzz6.onrender.com/get-conversations/${userID}`).then(res => setConversations(res.data))
    }, [])

    return (
        <div id='conversations' className='bg-red-200 px-4 h-[100vh]'>
            <div className='flex justify-center items-center font-bold h-[50px]' >Conversations</div>
            {/* {
                conversationPeoples?.map(conversationPeople => <div key={conversationPeople._id} onClick={() => {
                    currentConversationContext.setCurrentConversation(conversations[conversationPeoples.indexOf(conversationPeople)])
                    receiverContext.setReceiver(conversationPeople)
                }}><UserCard username={conversationPeople.username} /></div>)
            } */}
            {
                conversations?.map(conversation => <div key={conversation._id} onClick={() => {
                    currentConversationContext.setCurrentConversation(conversation)
                    if (userID == conversation.participants[0]._id) {
                        receiverContext.setReceiver(conversation.participants[1])
                    } else {
                        receiverContext.setReceiver(conversation.participants[0])
                    }
                }}><UserCard username={userID == conversation.participants[0]._id ? conversation.participants[1].username : conversation.participants[0].username} /></div>)
            }
        </div>
    );
};

export default Conversation;
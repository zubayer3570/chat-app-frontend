import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';
import { CurrentConversationContext } from '../App';

const Conversation = () => {
    const { setCurrentConversation } = useContext(CurrentConversationContext)
    const navigate = useNavigate()
    const [conversationPeoples, setConversationPeoples] = useState([])
    const [conversation, setConversation] = useState([])
    const userID = JSON.parse(localStorage.getItem('user-credentials')).data._id
    useEffect(() => {
        axios.get(`http://localhost:5000/get-conversations/${userID}`).then(res => {
            setConversationPeoples(res.data.conversationPeople)
            setConversation(res.data.conversations)
        })
    }, [])
    
    return (
        <div id='conversations' className='bg-red-200 px-4 h-[100vh]'>
            <div className='flex justify-center items-center font-bold h-[50px]' >Conversations</div>
            {
                conversationPeoples?.map(conversationPeople => <div key={conversationPeople._id} onClick={() => {
                    setCurrentConversation(conversation[conversationPeoples.indexOf(conversationPeople)])
                    navigate(`/inbox?ru=${conversationPeople._id}`)
                }}><UserCard username={conversationPeople.username} /></div>)
            }
        </div>
    );
};

export default Conversation;
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { AllContext } from '../App';

const Users = () => {
    const { userContext, currentConversationContext, receiverContext } = useContext(AllContext)
    const navigate = useNavigate()
    const [users, setUsers] = useState([])

    // getting all users
    useEffect(() => {
        axios.get("https://chat-app-pzz6.onrender.com/get-users").then((res) => setUsers(res.data))
    }, [])

    // getting the current conversation
    const handler = async (receiver) => {
        const userID = userContext.user._id
        await axios.post('https://chat-app-pzz6.onrender.com/get-conversation', { participants: [userID, receiver._id] }).then((res) => {
            currentConversationContext.setCurrentConversation(res.data.conversation)
            console.log(res.data.conversation)
            receiverContext.setReceiver(res.data.conversation.participants[0]._id == userID ? res.data.conversation.participants[1] : res.data.conversation.participants[0])
            navigate('/inbox')
        })
    }
    return (
        <div id='active' className='px-[9%] bg-blue-100'>
            <p className='font-bold text-[25px] py-4 text-green-500 text-center'>All Users</p>
            <div className='pb-4'>
                {
                    users.map((receiver) => <div onClick={() => handler(receiver)} key={receiver._id}><UserCard username={receiver.username} /></div>)
                }
            </div>
        </div>
    );
};

export default Users;
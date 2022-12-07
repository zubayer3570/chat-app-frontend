import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { AllContext } from '../App';

const Users = () => {
    const { userContext, currentConversationContext, receiverContext } = useContext(AllContext)
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    useEffect(() => {
        axios.get("https://chat-app-pzz6.onrender.com/get-users").then((res) => setUsers(res.data))
    }, [])
    const handler = async (receiverID) => {
        const userID = userContext.user._id
        await axios.get(`https://chat-app-pzz6.onrender.com/get-user/${receiverID}`).then((res) => {
            receiverContext.setReceiver(res.data)
        })
        await axios.post('https://chat-app-pzz6.onrender.com/check-conversation', { userID, receiverID }).then((res) => {
            if (res.data._id) {
                currentConversationContext.setCurrentConversation(res.data)
            }
            navigate(`/inbox`)
        })
    }
    return (
        <div id='active' className='px-[9%] bg-blue-100'>
            <p className='font-bold text-[25px] py-4 text-green-500 text-center'>All Users</p>
            <div className='pb-4'>
                {
                    users.map((receiver) => <div onClick={() => handler(receiver._id)} key={receiver._id}><UserCard username={receiver.username} /></div>)
                }
            </div>
        </div>
    );
};

export default Users;
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { AllContext } from '../App';

const Users = () => {
    const { userContext, currentConversationContext, receiverContext, socketContext } = useContext(AllContext)
    const navigate = useNavigate()
    const [users, setUsers] = useState([])

    // getting all users
    useEffect(() => {
        axios.get(`http://localhost:5000/get-users/${userContext.user._id}`).then((res) => setUsers(res.data))
    }, [])

    // getting the current conversation
    const handler = (receiver) => {
        const userID = userContext.user._id
        axios.post('http://localhost:5000/get-conversation', { participants: [userID, receiver._id] }).then((res) => {
            currentConversationContext.setCurrentConversation(res.data.conversation)
            socketContext.socket.emit('new_opened_conversation', { openedConversationID: res.data.conversation._id, userID })
            receiverContext.setReceiver(res.data.conversation.participants[0]._id == userID ? res.data.conversation.participants[1] : res.data.conversation.participants[0])
            navigate('/')
        })
    }
    return (
        <div id='active' className='px-[9%] bg-blue-100'>
            <p className='font-bold text-[25px] py-4 text-green-500 text-center'>All Users</p>
            <div className='pb-4'>
                {
                    users.map((receiver) => <div onClick={() => handler(receiver)} key={receiver._id}><UserCard userData={receiver} /></div>)
                }
            </div>
        </div>
    );
};

export default Users;
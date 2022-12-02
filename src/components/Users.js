import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { CurrentConversationContext } from '../App';

const Users = () => {
    const { setCurrentConversation } = useContext(CurrentConversationContext)
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5000/get-users").then((res) => setUsers(res.data))
    }, [])
    const handler = async (receiverID) => {
        const userID = JSON.parse(localStorage.getItem('user-credentials')).data._id
        await axios.post('http://localhost:5000/check-conversation', { userID, receiverID }).then((res) => {
            if (res.data._id) {
                setCurrentConversation(res.data)
            }
            console.log(res.data)
            navigate(`/inbox?ru=${receiverID}`)
        })
    }
    return (
        <div id='active' className='px-[9%] bg-blue-100'>
            <p className='font-bold text-[25px] py-4 text-green-500 text-center'>All Users</p>
            <div className='pb-4'>
                {
                    users.map((user) => <div onClick={() => handler(user._id)} key={user._id}><UserCard username={user.username} /></div>)
                }
            </div>
        </div>
    );
};

export default Users;
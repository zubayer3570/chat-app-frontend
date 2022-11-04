import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'

const Users = ({ socket }) => {
    const [users, setUsers] = useState([])
    useEffect(()=>{
       axios.get("http://localhost:5000/get-users").then((res)=> setUsers(res.data))
    }, [])
    socket.on("new_user", (data) => {
        setUsers([...users, data])
    })
    const openConversation = (participantId) =>{
        const creatorId = JSON.parse(localStorage.getItem('user-credentials')).data._id
        axios.post("http://localhost:5000/create-conversation", {
            participants: [creatorId , participantId]
        }).then(res=> socket.emit("new_conversation", res.data))
    }
    return (
        <div id='active' className='border border-2 h-[500px]'>
            {
                users.map((user)=> <p key={user._id} onClick={()=> openConversation(user._id)}>{user.username}</p> )
            }
        </div>
    );
};

export default Users;
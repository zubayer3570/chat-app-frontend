import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Conversation from './Conversation';
import Users from './Users';

const Inbox = ({ socket }) => {
    const [msgs, setMsgs] = useState([])
    const [conversationId, setConversationId] = useState("")
    const getConversationId = id => setConversationId(id)
    useEffect(() => {
        console.log(conversationId)
        axios.get(`http://localhost:5000/get-msgs/${conversationId || 1}`).then(res => {
            setMsgs(res.data)
        })
    }, [conversationId])
    const sendMsg = async (e) =>{
        e.preventDefault()
        const message = e.target.message.value
        const sender = JSON.parse(localStorage.getItem("user-credentials")).data.username
        await axios.post('http://localhost:5000/send-msg', {conversationId, sender, message}).then((res)=>{
            socket.emit("new_msg", res.data)
        })
    }
    socket.on("new_msg", (data=>{
        setMsgs([...msgs, data])
        console.log(msgs)
    }))
    return (
        <div className='grid grid-cols-3'>
            <Conversation socket={socket} getConversationId={getConversationId} />
            <div id='inbox' className='border border-2 h-[500px]'>
                <div>
                    {
                        msgs?.map(msg=> <p key={msg._id} >{msg.sender}: {msg.message}</p> )
                    }
                </div>
                <form onSubmit={sendMsg}>
                    <input type="text" name="message" className='input input-bordered' />
                    <input type="submit" value="send" className='btn' />
                </form>
            </div>
            <Users socket={socket} />
        </div>
    );
};

export default Inbox;
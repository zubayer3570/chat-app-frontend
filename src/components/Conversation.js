import React, { useEffect, useState } from 'react';
import axios from 'axios'

const Conversation = ({ socket, getConversationId }) => {
    const [myConversations, setMyConversations] = useState([])
    const [myConversationsPeople, setMyConversationsPeople] = useState([])
    const userId = JSON.parse(localStorage.getItem("user-credentials")).data._id
    useEffect(() => {
        axios.get(`http://localhost:5000/get-converstaions/${userId}`).then(res => {
            setMyConversations(res.data.conversations)
            setMyConversationsPeople(res.data.result)
        })
    }, [])
    socket.on("new_conversation", (data) => {
        setMyConversations([...myConversations, data])
        console.log(data)
        console.log(myConversations)
    })
    return (
        <div id='conversations' className='border border-2 h-[500px]'>
            {
                myConversationsPeople.map(people => <p key={people._id} onClick={() => getConversationId(myConversations[myConversationsPeople.indexOf(people)]._id)}>{people.username}</p>)
            }
            {
                myConversations.map(x=>  <p>{x._id}</p> )
            }
        </div>
    );
};

export default Conversation;
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CurrentConversationContext } from '../App';
import Message from './Message';

const ChatBox = ({ selectedConversationID, receiverID, loggedInUser }) => {
    const [messages, setMessages] = useState([])
    const [receiverAllInfo, setReceiverAllInfo] = useState({})
    const { currentConversation } = useContext(CurrentConversationContext)
    // get messages
    useEffect(() => {
        axios.get(`http://localhost:5000/get-user/${receiverID}`).then(res => setReceiverAllInfo(res.data))
        axios.get(`http://localhost:5000/get-messages/${currentConversation._id}`).then(res => {
            setMessages(res.data)
        })
    }, [currentConversation])

    //sending message
    const sendMessage = async (e) => {
        e.preventDefault()
        const message = e.target.message.value
        const sender = {
            senderID: JSON.parse(localStorage.getItem('user-credentials')).data._id,
            senderUsername: JSON.parse(localStorage.getItem('user-credentials')).data.username
        }
        const receiver = {
            receiverID: receiverAllInfo._id,
            receiverUsername: receiverAllInfo.username
        }
        await axios.post(`http://localhost:5000/send-message`, { sender, receiver, message, conversationID: currentConversation._id }).then(res => {})
    }
    return (
        <div id='inbox' className='flex flex-col h-[100vh] bg-[black] h-[500px] bg-green-200 px-4'>
            <div className='flex justify-between'>
                <p className='flex items-center h-[50px] font-bold'>{receiverAllInfo.username}</p>
                <div className='flex items-center h-[50px] font-bold'>
                    <Link to='/users' ><button className='mr-4 p-2 rounded shadow-custom-1'>New Conversation +</button></Link>
                    <button className='p-2 rounded shadow-custom-1'>Logout</button>
                </div>
            </div>
            <div className='flex-grow bg-blue-100 overflow-scroll'>
                {
                    console.log(currentConversation)
                }
                {
                    messages?.map(message=> <Message sender={message.sender.senderUsername} message={message.message} key={message._id} />)
                }
                {/* <Message sender='zubayer' message='this is a test message' />
                <Message sender='zubayer' message='this is a test message' />
                <Message sender='zubayer' message='this is a test message' /> */}
            </div>
            {/* <div>
                {
                    messages?.map(message => <p key={message._id} >{message.senderUsername}: {message.message}</p>)
                }
            </div> */}
            <div className='pb-8'>
                <form onSubmit={sendMessage} className='flex'>
                    <input type="text" name="message" className='input input-bordered w-[500px]' />
                    <input type="submit" value="send" className='btn' />
                </form>
            </div>

        </div>
    );
};

export default ChatBox;
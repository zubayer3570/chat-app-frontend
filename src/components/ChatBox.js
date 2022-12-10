import axios from 'axios';
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AllContext } from '../App';
import Message from './Message';

const ChatBox = () => {
    const messageSection = useRef()
    const { userContext, receiverContext, currentConversationContext, socketContext } = useContext(AllContext)
    // console.log(receiverContext)
    const [messages, setMessages] = useState([])


    //getting messages, quering by conversation id
    useEffect(() => {
        axios.get(`http://localhost:5000/get-messages/${currentConversationContext.currentConversation._id}`).then(res => setMessages(res.data))
    }, [currentConversationContext])


    socketContext.socket.on('new_message', (data) => setMessages([...messages, data]))

    useEffect(() => {
        messageSection.current?.scrollIntoView(messageSection.current?.scrollHeight)
    }, [messages])


    //sending message
    const sendMessage = async (e) => {
        e.preventDefault()
        const text = e.target.text.value
        const sender = {
            senderID: userContext.user._id,
            senderUsername: userContext.user.username
        }
        const receiver = {
            receiverID: receiverContext.receiver._id,
            receiverUsername: receiverContext.receiver.username
        }
        const conversationID = currentConversationContext.currentConversation._id
        const newMessage = { sender, receiver, text, conversationID }

        // in the sender end, we are adding the message by the http response, and in the receiver side we are sending that newly instered message via socket.io
        await axios.post(`http://localhost:5000/send-message`, newMessage).then(res => setMessages([...messages, res.data]))
    }
    return (
        <div id='inbox' className='flex flex-col h-[100vh] bg-[black] bg-green-200 px-4'>
            <div className='flex justify-between'>
                {/* showing the reciever usename at the top */}
                <p className='flex items-center h-[50px] font-bold'>{receiverContext.receiver.username}</p>
                <div className='flex items-center h-[50px] font-bold'>
                    <Link to='/users' ><button className='mr-4 p-2 rounded shadow-custom-1'>New Conversation +</button></Link>
                    <button className='p-2 rounded shadow-custom-1'>Logout</button>
                </div>
            </div>
            <div className='flex-grow bg-blue-100 overflow-y-scroll'>
                {
                    // displaying message
                    messages.map(message => <Message sender={message.sender.senderUsername} message={message.text} key={message._id} />)
                }
                <div ref={messageSection}></div>
            </div>
            <div className='mb-8'>
                <form onSubmit={sendMessage} className='flex'>
                    <input type="text" name="text" className='input input-bordered w-[500px]' />
                    <input type="submit" value="send" className='btn' />
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
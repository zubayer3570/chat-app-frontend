import axios from 'axios';
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AllContext } from '../App';
import Message from './Message';

const ChatBox = () => {
    const messageSection = useRef()
    const [scrollHeight, setScrollHeight] = useState(500)
    const { userContext, receiverContext, currentConversationContext, socketContext } = useContext(AllContext)
    useEffect(() => {
        // setScrollHeight(messageSection.current?.scrollHeight)
        messageSection.current?.scrollIntoView(messageSection.current?.scrollHeight)
    }, [currentConversationContext])
    useEffect(() => {
        socketContext.socket.on("connect", () => {
            socketContext.socket.emit('new_active_user', { userID: userContext.user._id || 1, socketID: socketContext.socket.id })
        })
        socketContext.socket.on('new_message', (data) => {
            currentConversationContext.setCurrentConversation(data)
        })
    }, [socketContext])
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
        await axios.post(`http://localhost:5000/send-message`, newMessage).then(res => { })
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
                    currentConversationContext?.currentConversation.messages?.map(message => <Message sender={message.sender.senderUsername} message={message.text} key={message._id} />)
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
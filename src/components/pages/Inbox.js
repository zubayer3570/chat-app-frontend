import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addConversationFromSocket, loginThunk, updateActiveStatus, updateLastMessage, addNewUser } from '../../features/userSlice';
import ConversationCard from '../main-components/ConversationCard';
import TextBox from '../main-components/TextBox';
import AllUsers from '../main-components/AllUsers';
import { socket } from '../../socket';
import { socketAddText } from '../../features/textSlice';
import { selectConversation } from '../../features/conversationSlice';


const Inbox = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const { selectedConversation } = useSelector(state => state.conversation)
    useEffect(() => {
        if (loggedInUser?._id) {
            dispatch(loginThunk(loggedInUser))
        }
    }, [])
    useEffect(() => {
        if (!loggedInUser?._id) {
            navigate('/login')
        }
    }, [loggedInUser])

    //socket connection
    useEffect(() => {
        socket.connect()

        socket.on("connect", () => {
            socket.emit("new_active_user", { userEmail: loggedInUser.email, socketID: socket.id })
        })

        socket.on("new_conversation", (newConversation) => {
            dispatch(addConversationFromSocket(newConversation))
            if (newConversation.lastMessage.sender._id == loggedInUser._id) {
                dispatch(selectConversation(newConversation))
            }
        })

        // socket.on("new_message", (data) => {
        //     if (selectedConversation._id == data.conversationID) {
        //         dispatch(socketAddText(data))
        //     }
        // })



        socket.on("new_last_message", (data) => {
            dispatch(updateLastMessage(data))
        })

        socket.on("new_user", (data) => {
            dispatch(addNewUser(data))
        })
        socket.on("active_status_updated", (data) => {
            dispatch(updateActiveStatus(data))
        })


    }, [])

    useEffect(() => {
        socket.on("new_message", (data) => {
            if (selectedConversation._id == data.conversationID) {
                dispatch(socketAddText(data))
            }
        })
    }, [selectedConversation])
    return (
        <div className='grid grid-cols-4 min-h-[100vh]'>
            <div className='col-span-1 bg-red-500'>
                {
                    loggedInUser?.conversations?.map(conversation => <ConversationCard conversation={conversation} key={conversation._id} />)
                }
            </div>
            <div className='col-span-2 bg-green-500'>
                <TextBox />
            </div>
            <div className='bg-yellow-200'>
                <AllUsers />
            </div>
        </div>
    );
};

export default Inbox;
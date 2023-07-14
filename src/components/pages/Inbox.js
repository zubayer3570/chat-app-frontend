import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addConversationFromSocket, loginThunk, updateActiveStatus, updateLastMessage } from '../../features/userSlice';
import ConversationCard from '../main-components/ConversationCard';
import TextBox from '../main-components/TextBox';
import AllUsers from '../main-components/AllUsers';
import { socket } from '../../socket';


const Inbox = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
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

        socket.on("new_conversation", (data) => {
            dispatch(addConversationFromSocket(data))
        })

        socket.on("new_last_message", (data) => {
            dispatch(updateLastMessage(data))
        })

        socket.on("active_status_updated", (data) => {
            dispatch(updateActiveStatus(data))
        })
        

    }, [])
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
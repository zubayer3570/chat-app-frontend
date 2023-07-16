import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addConversationFromSocket, loginThunk, updateActiveStatus, updateLastMessage, addNewUser } from '../../features/userSlice';
import TextBox from '../main-components/TextBox';
import AllUsers from '../main-components/AllUsers';
import { socket } from '../../socket';
import { socketAddText } from '../../features/textSlice';
import { selectConversation } from '../../features/conversationSlice';
import AllConversations from '../main-components/AllConversations';


const Inbox = () => {
    const visualHeight = window.visualViewport
    const [textBoxHeight, setTextBoxHeight] = useState("100vh")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const { selectedConversation } = useSelector(state => state.conversation)
    useEffect(() => {
        if (window.innerWidth < 570) {
            if (!window.location.pathname.includes("mobile")) {
                navigate("/mobile/conversations")
            }
        }
    }, [])
    // useEffect(() => {
    //     if (loggedInUser?._id) {
    //         dispatch(loginThunk(loggedInUser))
    //     }
    // }, [])
    useEffect(() => {
        if (!loggedInUser?._id) {
            navigate('/login')
        }
    }, [loggedInUser])
    // useEffect(() => {
    //     setTextBoxHeight(visualHeight + 'px')
    // }, [visualHeight])


    //socket connection
    useEffect(() => {
        socket.connect()

        socket.on("connect", () => {
            if (loggedInUser._id) {
                socket.emit("new_active_user", { userEmail: loggedInUser.email, socketID: socket.id })
            }
        })

        // socket.on("new_conversation", (newConversation) => {
        //     dispatch(addConversationFromSocket(newConversation))
        //     if (newConversation.lastMessage.sender._id == loggedInUser._id) {
        //         dispatch(selectConversation(newConversation))
        //     }
        // })

        // socket.on("new_last_message", (data) => {
        //     dispatch(updateLastMessage(data))
        // })

        // socket.on("new_user", (data) => {
        //     console.log(data)
        //     dispatch(addNewUser(data))
        // })

        // socket.on("active_status_updated", (data) => {
        //     console.log(data)
        //     dispatch(updateActiveStatus(data))
        // })
        return () => socket.removeAllListeners()
    }, [])

    // useEffect(() => {
    //     socket.on("new_message", (data) => {
    //         if (selectedConversation._id == data.conversationID) {
    //             dispatch(socketAddText(data))
    //         }
    //     })
    // }, [selectedConversation])
    return (
        <>
            <div className={`flex bg-1 h-[${textBoxHeight}] lg:h-[100vh] `}>
                <div className='col-span-1 lg:block'>
                    <AllConversations />
                </div>
                <div className='flex-1 p-2'>
                    <TextBox />
                </div>
                <div className='hidden lg:block'>
                    <AllUsers />
                </div>
            </div>
        </>
    );
};

export default Inbox;
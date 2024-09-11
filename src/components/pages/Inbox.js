import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import TextBox from '../main-components/TextBox';
import AllUsers from '../main-components/AllUsers';
import { socket } from '../../socket';
import AllConversations from '../main-components/AllConversations';
import { getToken } from 'firebase/messaging';
import axios from 'axios';
import { messaging } from '../../firebase';
import { loginThunk } from '../../features/userSlice';


const Inbox = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser, receiver, loading } = useSelector(state => state.users)
    useEffect(() => {
        if (!location.state?.doNotVerifyUser) {
            dispatch(loginThunk())
        }
        socket.on("connect", () => {
            if (loggedInUser?._id) {
                socket.emit("new_active_user", { userEmail: loggedInUser.email, socketID: socket.id })
            }
        })
        socket.on("disconnect", () => {
            socket.emit("typingStopped", { typingUser: loggedInUser, receiver })
        })

    }, [])

    useEffect(() => {
        if (window.innerWidth < 570) {
            if (!window.location.pathname.includes("mobile")) {
                navigate("/mobile/conversations")
            }
        }
    }, [])

    const requestPermission = async () => {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
            const token = await getToken(messaging, { vapidKey: "BBX6JaDHzapgmMupkHxIefyIGxKJZccE9D7TXp1OpQm4Dg7M_TKAzuoSPHUTCyPtYCdAZj76-T5Cv6ZPILf9_JI" })
            await axios.post('http://localhost:5000/update-notification-token', { email: loggedInUser.email, token })
        }
    }
    useEffect(() => {
        requestPermission()
    }, [])

    useEffect(() => {
        if (!loggedInUser?._id && !loading) {
            navigate('/login')
        }
    }, [loading, loggedInUser])


    return (
        <>
            <div className={`flex bg-1 h-[100vh] lg:h-[100vh]`}>
                <AllConversations />
                <div className='flex-1 p-2'>
                    <TextBox />
                </div>
                <AllUsers />
            </div>
        </>
    );
};

export default Inbox;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextBox from '../main-components/TextBox';
import AllUsers from '../main-components/AllUsers';
import { socket } from '../../socket';
import AllConversations from '../main-components/AllConversations';
import { getToken } from 'firebase/messaging';
import axios from 'axios';
import { messaging } from '../../firebase';
import { loginThunk } from '../../features/userSlice';


const Inbox = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    useEffect(() => {

    }, [])
    useEffect(() => {
        dispatch(loginThunk())
        socket.on("connect", () => {
            if (loggedInUser?._id) {
                socket.emit("new_active_user", { userEmail: loggedInUser.email, socketID: socket.id })
            }
        })

    }, [])

    useEffect(() => {
        if (window.innerWidth < 570) {
            if (!window.location.pathname.includes("mobile")) {
                navigate("/mobile/conversations")
            }
        }
    }, [])
    useEffect(() => {
        if (!loggedInUser?._id) {
            navigate('/login')
        }
    }, [loggedInUser])

    const requestPermission = async () => {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
            const token = await getToken(messaging, { vapidKey: "BBX6JaDHzapgmMupkHxIefyIGxKJZccE9D7TXp1OpQm4Dg7M_TKAzuoSPHUTCyPtYCdAZj76-T5Cv6ZPILf9_JI" })
            await axios.post('https://chat-app-pzz6.onrender.com/update-notification-token', { email: loggedInUser.email, token })
        }
    }
    useEffect(() => {
        requestPermission()
    }, [])

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
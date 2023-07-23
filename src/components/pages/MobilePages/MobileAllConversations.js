import React, { useEffect } from 'react';
import AllConversations from '../../main-components/AllConversations';
import { socket } from '../../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersThunk } from '../../../features/userSlice';
import { getToken } from 'firebase/messaging';
import axios from 'axios';
import { messaging } from '../../../firebase';
import { useNavigate } from 'react-router-dom';

const MobileAllConversations = () => {
    const { loggedInUser } = useSelector(state => state.users)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => { dispatch(allUsersThunk()) }, [])
    useEffect(() => {
        socket.connect()

        socket.on("connect", () => {
            if (loggedInUser._id) {
                socket.emit("new_active_user", { userEmail: loggedInUser.email, socketID: socket.id })
            }
        })
    }, [])


    // notification
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


    useEffect(() => {
        if (!loggedInUser?._id) {
            navigate('/login')
        }
    }, [loggedInUser])
    return (
        <div className='bg-1 h-[100vh]'>
            <AllConversations />
        </div>
    );
};

export default MobileAllConversations;
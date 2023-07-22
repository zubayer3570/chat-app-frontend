import React, { useEffect } from 'react';
import AllConversations from '../../main-components/AllConversations';
import { socket } from '../../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersThunk } from '../../../features/userSlice';
import { getToken } from 'firebase/messaging';
import axios from 'axios';
import { messaging } from '../../../firebase';

const MobileAllConversations = () => {
    const { loggedInUser } = useSelector(state => state.users)
    const dispatch = useDispatch()
    useEffect(() => { dispatch(allUsersThunk()) }, [])
    useEffect(() => {
        socket.connect()

        socket.on("connect", () => {
            if (loggedInUser._id) {
                socket.emit("new_active_user", { userEmail: loggedInUser.email, socketID: socket.id })
            }
        })
        return () => socket.removeAllListeners()
    }, [])


    // notificationf
    const requestPermission = async () => {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
            const token = await getToken(messaging, { vapidKey: "BBX6JaDHzapgmMupkHxIefyIGxKJZccE9D7TXp1OpQm4Dg7M_TKAzuoSPHUTCyPtYCdAZj76-T5Cv6ZPILf9_JI" })
            await axios.post('http://192.168.1.104:5000/update-notification-token', { email: loggedInUser.email, token })
        }

    }
    useEffect(() => {
        requestPermission()
    }, [])
    return (
        <div className='bg-1 h-[100vh]'>
            <AllConversations />
        </div>
    );
};

export default MobileAllConversations;
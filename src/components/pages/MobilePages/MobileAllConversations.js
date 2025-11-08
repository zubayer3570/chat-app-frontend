import React, { useEffect } from 'react';
import AllConversations from '../../main-components/AllConversations';
import { getSocket } from '../../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersThunk, loginThunk } from '../../../features/userSlice';
import { getToken } from 'firebase/messaging';
import { messaging } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import {api} from "../../../api"

const MobileAllConversations = () => {
    const { loggedInUser } = useSelector(state => state.users)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => { dispatch(allUsersThunk()) }, [])
    useEffect(() => {
        dispatch(loginThunk())
        getSocket() && getSocket().on("connect", () => {
            if (loggedInUser?._id) {
                getSocket() && getSocket().emit("new_active_user", { userEmail: loggedInUser.email, socketID: getSocket().id })
            }
        })
    }, [])


    // notification
    // const requestPermission = async () => {
    //     const permission = await Notification.requestPermission()
    //     if (permission === "granted") {
    //         const token = await getToken(messaging, { vapidKey: "BBX6JaDHzapgmMupkHxIefyIGxKJZccE9D7TXp1OpQm4Dg7M_TKAzuoSPHUTCyPtYCdAZj76-T5Cv6ZPILf9_JI" })
    //         await api.post('https://chat-app-pzz6.onrender.com/update-notification-token', { email: loggedInUser.email, token })
    //     }

    // }
    // useEffect(() => {
    //     requestPermission()
    // }, [])


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
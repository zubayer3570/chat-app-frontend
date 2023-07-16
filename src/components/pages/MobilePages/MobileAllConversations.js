import React, { useEffect } from 'react';
import AllConversations from '../../main-components/AllConversations';
import { socket } from '../../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersThunk } from '../../../features/userSlice';

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
    return (
        <div className='bg-1 h-[100vh]'>
            <AllConversations />
        </div>
    );
};

export default MobileAllConversations;
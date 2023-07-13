import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginThunk } from '../../features/userSlice';
import ConversationCard from '../main-components/ConversationCard';
import TextBox from '../main-components/TextBox';
import AllUsers from '../main-components/AllUsers';

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
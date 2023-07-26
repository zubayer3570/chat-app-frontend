import React, { useEffect } from 'react';
import AllUsers from '../../main-components/AllUsers';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MobileAllUsers = () => {
    const navigate = useNavigate()
    const { loggedInUser } = useSelector(state => state.users)

    useEffect(() => {
        if (!loggedInUser?._id) {
            navigate('/login')
        }
    }, [loggedInUser])
    
    return (
        <div className='bg-1 h-[100vh]'>
            <AllUsers />
        </div>
    );
};

export default MobileAllUsers;
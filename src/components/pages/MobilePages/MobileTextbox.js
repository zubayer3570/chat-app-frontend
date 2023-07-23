import React, { useEffect } from 'react';
import TextBox from '../../main-components/TextBox';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MobileTextbox = () => {

    const navigate = useNavigate()
    const { loggedInUser } = useSelector(state => state.users)

    useEffect(() => {
        if (!loggedInUser?._id) {
            navigate('/login')
        }
    }, [loggedInUser])

    return (
        <div className='h-[100vh] bg-1'>
            <TextBox />
        </div>
    );
};

export default MobileTextbox;
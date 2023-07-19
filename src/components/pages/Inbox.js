import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addNewConversation, loginThunk, updateActiveStatus, updateLastMessage, addNewUser } from '../../features/userSlice';
import TextBox from '../main-components/TextBox';
import AllUsers from '../main-components/AllUsers';
import { socket } from '../../socket';
import { addText } from '../../features/textSlice';
import { selectConversation } from '../../features/conversationSlice';
import AllConversations from '../main-components/AllConversations';


const Inbox = () => {
    const [textBoxHeight, setTextBoxHeight] = useState("100vh")
    const navigate = useNavigate()
    const { loggedInUser } = useSelector(state => state.users)
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
    return (
        <>
            <div className={`flex bg-1 h-[${textBoxHeight}] lg:h-[100vh]`}>
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
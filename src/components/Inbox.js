import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllContext } from '../App';
import ChatBox from './ChatBox';
import Conversation from './Conversation';


const Inbox = () => {
    const navigate = useNavigate()
    const { userContext } = useContext(AllContext)
    useEffect(() => {
        // userContext.user?._id || navigate("/login")
        if(!(userContext.user?._id)){
            navigate("/login")
        }
    }, [])
    return (
        <>
            <div className='grid grid-cols-5'>
                <div>
                    <Conversation />
                </div>
                <div className='col-span-4'>
                    <ChatBox />
                </div>
            </div>
        </>
    );
};

export default Inbox;
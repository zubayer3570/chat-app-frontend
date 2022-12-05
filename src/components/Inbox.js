import React, { useContext } from 'react';
import ChatBox from './ChatBox';
import Conversation from './Conversation';


const Inbox = () => {
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
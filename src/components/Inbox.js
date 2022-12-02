import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import ChatBox from './ChatBox';
import Conversation from './Conversation';

const Inbox = ({ socket }) => {
    const [selectedConversationID, setSelectedConversationID] = useState('')
    const queryParams = useLocation().search
    const receiverID = new URLSearchParams(queryParams).get('ru')
    const getSelectedConversationID = (id) => {
        setSelectedConversationID(id)
    }
    return (
        <>
            <div className='grid grid-cols-5'>
                <div>
                    <Conversation getSelectedConversationID={getSelectedConversationID} />
                </div>
                <div className='col-span-4'>
                    <ChatBox selectedConversationID={selectedConversationID._id} receiverID={receiverID} />
                </div>
            </div>
        </>
    );
};

export default Inbox;
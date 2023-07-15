import React from 'react';
import { useSelector } from 'react-redux';
import ConversationCard from './ConversationCard';
import style from '../../style.module.css'

const AllConversations = () => {
    const { loggedInUser } = useSelector(state => state.users)
    return (
        <div>
            <div className='font-bold text-white text-center mt-4 mb-2'>Your Conversations</div>
            <div className={style.hideScrollbar}>
                {
                    loggedInUser?.conversations?.map(conversation => <ConversationCard conversation={conversation} key={conversation._id} />)
                }
            </div>
        </div>
    );
};

export default AllConversations;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConversationCard from './ConversationCard';
import style from '../../style.module.css'
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { logoutUser } from '../../features/userSlice';
import { addNewConversation, getConversationsThunk, updateLastMessage, updateUnreadThunk } from '../../features/conversationsSlice';

const AllConversations = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const { conversations, selectedConversation } = useSelector(state => state.conversations)

    useEffect(() => {
        socket.on("new_conversation", (newConversation) => {
            // console.log("new conv", newConversation)
            dispatch(addNewConversation(newConversation))
        })
        return () => socket.off("new_conversation")
    }, [])

    useEffect(() => {
        socket.on("new_last_message", (data) => {
            if (selectedConversation?._id === data.conversationId) {
                data.unread = false
                dispatch(updateUnreadThunk(data.conversationId))
            }
            dispatch(updateLastMessage(data))
        })
        return () => socket.removeListener("new_last_message")
    }, [])

    useEffect(()=> {
        dispatch(getConversationsThunk({userId: loggedInUser._id}))
    }, [loggedInUser])

    return (
        <div className={'overflow-auto ' + style.hideScrollbar}>
            {/* mobile layout */}
            <div className='flex lg:hidden items-center justify-between px-8'>
                <p className='text-[20px] p-1 px-2 bg-test-2 rounded-md font-bold mt-4 mb-2'>ZEXT</p>
                <div className='flex'>
                    <div className='w-12 h-12 rounded-full overflow-hidden mr-2'>
                        <img src={loggedInUser?.profileImg} alt="" />
                    </div>
                    <div className='flex items-center mr-2'>
                        <button onClick={() => {
                            dispatch(logoutUser())
                            navigate('/login')
                        }} className='px-4 py-2 rounded-full bg-test-3 font-bold text-white'>logout</button>
                    </div>
                    <div onClick={() => navigate("/mobile/all-users")} className='flex items-center justify-center'>
                        <div className='flex items-center justify-center h-[35px] w-[35px] bg-test-3 overflow-hidden rounded-full'>
                            <p className='font-bold-md text-white text-[26px] p-0 m-0 font-bold mb-1'>+</p>
                        </div>
                    </div>
                </div>
            </div>



            {/* desktop layout */}
            <div className='hidden lg:flex justify-center'>
                <p className='text-[20px] p-2 px-4 bg-test-2 rounded-md font-bold mt-4 mb-2'>ZEXT</p>
            </div>
            <div className='font-bold text-white text-center mt-4 mb-2'>Your Conversations</div>
            <div>
                <div className='w-[280px] h-[1px] mx-2'></div>
                {
                    conversations?.map(conversation => <ConversationCard conversation={conversation} key={conversation?._id} />)
                }
            </div>
        </div>
    );
};

export default AllConversations;
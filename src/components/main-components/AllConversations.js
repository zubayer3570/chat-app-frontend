import React from 'react';
import { useSelector } from 'react-redux';
import ConversationCard from './ConversationCard';
import style from '../../style.module.css'
import { useNavigate } from 'react-router-dom';

const AllConversations = () => {
    const navigate = useNavigate()
    const { loggedInUser } = useSelector(state => state.users)
    return (
        <div>
            {/* mobile layout */}
            <div className='flex lg:hidden items-center justify-between px-8'>
                {/* <p className='text-white font-bold text-[20px]'>Zext</p> */}
                <p className='text-[20px] p-1 px-2 bg-test-2 rounded-md font-bold mt-4 mb-2'>Zext</p>
                <div className='flex'>
                    <div className='w-12 h-12 rounded-full overflow-hidden mr-2'>
                        <img src={loggedInUser?.profileImg} alt="" />
                    </div>
                    <div className='flex items-center mr-2'>
                        <button className='px-4 py-2 rounded-full bg-test-3 font-bold text-white'>logout</button>
                    </div>
                    <div onClick={() => navigate("/mobile/all-users")} className='flex items-center'>
                        <div className='flex items-center justify-center h-[35px] w-[35px] bg-test-3 rounded-full overflow-hidden'>
                            <button className='font-bold-md text-white text-[40px]'>+</button>
                        </div>
                    </div>
                </div>
            </div>



            {/* desktop layout */}
            <div className='hidden lg:flex justify-center'>
                <p className='text-[20px] p-2 px-4 bg-test-2 rounded-md font-bold mt-4 mb-2'>Zext</p>
            </div>
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
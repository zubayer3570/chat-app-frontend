import React, { useContext } from 'react';
import { AllContext } from '../App';

const Message = ({ message }) => {
    const { userContext } = useContext(AllContext)
    const isMyMessage = userContext.user._id == message.sender._id
    return (
        <div className={`flex mx-8 ${isMyMessage ? 'justify-end' : 'justify-start'} `}>
            <div className='flex items-center my-2 text-white'>
                <div className={`${isMyMessage ? 'hidden' : 'block'}`}>
                    <div className='w-[40px] h-[40px] rounded-[50%] overflow-hidden mr-4'>
                        <img src={message.sender.profileImg} alt="" />
                    </div>
                </div>
                <p className={` ${isMyMessage ? 'bg-[purple]' : 'bg-[green]'} inline-block px-4 py-2 rounded-full`}>{message.text}</p>
            </div>
        </div>
    );
};

export default Message;
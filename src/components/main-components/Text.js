import React from 'react';
import { useSelector } from 'react-redux';

const Text = ({ text }) => {
    const { loggedInUser } = useSelector(state => state.users)
    const senderIsTheUser = loggedInUser._id == text.sender._id
    return (
        <div className={`flex items-end ${senderIsTheUser ? "justify-end" : ""} px-4 max-w-full m-2 cursor-pointer`}>
            <div className={`w-[40px] h-[40px] rounded-full overflow-hidden bg-red-500 mr-4 ${senderIsTheUser ? "order-2" : ''}`}>
                <img src={text?.sender.profileImg} alt="" />
            </div>
            <div className={`shrink-0 bg-white max-w-[70%] p-2 rounded-md ${senderIsTheUser ? "order-1 mr-2" : ''}`} >
                {/* <p className='font-bold '>{text?.sender.name}</p> */}
                <p className='font-bold'>{text?.text}</p>
                {/* <p className=''>{text?.text}</p> */}
            </div>
        </div>
    );
};

export default Text;
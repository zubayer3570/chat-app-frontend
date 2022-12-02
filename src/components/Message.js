import React from 'react';

const Message = ({sender, message}) => {
    return (
        <div className='border-2 border-[black] my-2 rounded'>
            <p className='text-orange-500'>{sender}</p>
            <p>{message}</p>
        </div>
    );
};

export default Message;
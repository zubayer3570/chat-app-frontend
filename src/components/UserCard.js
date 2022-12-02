import React from 'react';

const UserCard = ({username}) => {
    return (
        <div className='font-bold shadow-custom-1 my-2 p-3 rounded-xl cursor-pointer'>
            {username}
        </div>
    );
};

export default UserCard;
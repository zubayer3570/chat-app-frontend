import React from 'react';

const UserCard = ({ userData }) => {
    return (
        <div className='flex items-center font-bold shadow-custom-1 my-2 p-3 rounded-xl cursor-pointer'>
            <div className='w-[40px] h-[40px] rounded-[50%] overflow-hidden mr-4'>
                <img src={userData.profileImg} alt="" />
            </div>
            <div>
                {userData.username}
            </div>
        </div>
    );
};

export default UserCard;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersThunk, logoutUser } from '../../features/userSlice';
import UserCard from './UserCard';
import style from '../../style.module.css'
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {
    const { loggedInUser, allUsers } = useSelector(state => state.users)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => { dispatch(allUsersThunk()) }, [])
    const handleLogout = () => {
        dispatch(logoutUser())
    }
    return (
        <div className={style.hideScrollbar}>
            <div className='flex items-center m-2'>
                <button onClick={handleLogout} className='grow py-2 px-4 rounded-full bg-test-3 font-bold text-white mr-2'>Logout</button>
                <div className='h-[40px] w-[40px] rounded-full overflow-hidden mr-4'>
                    <img src={loggedInUser?.profileImg} alt="" />
                </div>
            </div>
            <div className='font-bold text-white text-center mt-4 mb-2'>All Users with Active Status</div>
            {
                allUsers?.map(user => {
                    if (user._id == loggedInUser._id) {
                        return
                    }
                    return <UserCard user={user} key={user._id} />
                })
            }
        </div>
    );
};

export default AllUsers;
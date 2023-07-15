import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersThunk } from '../../features/userSlice';
import UserCard from './UserCard';
import style from '../../style.module.css'

const AllUsers = () => {
    const { loggedInUser, allUsers } = useSelector(state => state.users)
    const dispatch = useDispatch()
    useEffect(() => { dispatch(allUsersThunk()) }, [])
    return (
        <div className={style.hideScrollbar}>
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
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewUser, allUsersThunk, logoutUser, updateActiveStatus } from '../../features/userSlice';
import UserCard from './UserCard';
import style from '../../style.module.css'
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../socket';
import Typing from './Typing/Typing';

const AllUsers = () => {
    const { loggedInUser, allUsers } = useSelector(state => state.users)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    console.log(allUsers)

    useEffect(() => { dispatch(allUsersThunk()) }, [])
    const handleLogout = () => {
        dispatch(logoutUser())
        navigate("/login")
    }

    useEffect(() => {

        getSocket() && getSocket().on("active_status_updated", (data) => {
            dispatch(updateActiveStatus(data))
        })
        getSocket() && getSocket().on("new_user", (data) => {
            // console.log("heheheheh")
            dispatch(addNewUser(data))
        })

        return () => {
            getSocket() && getSocket().off("new_user")
            getSocket() && getSocket().off("active_status_updated")
        }

    }, [])

    return (
        <div className={'overflow-auto ' + style.hideScrollbar}>
            <div className='hidden lg:flex items-center m-2'>
                <button onClick={handleLogout} className='grow py-2 px-4 rounded-full bg-test-3 font-bold text-white mr-2'>Logout</button>
                <div className='h-[40px] w-[40px] rounded-full overflow-hidden mr-4'>
                    <img src={loggedInUser?.profileImg} alt="" />
                </div>
            </div>
            <div onClick={() => navigate("/mobile/conversations")} className='lg:hidden text-white font-bold px-4 pt-4'>Back</div>
            <div className='font-bold text-white text-center pt-4 mb-2'> <span></span> All Users with Active Status</div>
            <div className={"overflow-auto"}>
                {
                    allUsers?.map(user => {
                        if (user?._id === loggedInUser?._id) {
                            return
                        }
                        return <UserCard user={user} key={user?._id} />
                    })
                }
            </div>
        </div>
    );
};

export default AllUsers;
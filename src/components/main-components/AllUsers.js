import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersThunk, selectReceiver } from '../../features/userSlice';

const AllUsers = () => {
    const { allUsers } = useSelector(state => state.users)
    const dispatch = useDispatch()
    useEffect(() => { dispatch(allUsersThunk()) }, [])
    
    return (
        <div>
            {
                allUsers?.map(user => {
                    return (
                        <div onClick={() => dispatch(selectReceiver(user))} className='flex items-center px-4 py-2 bg-white max-w-full rounded-md m-2 cursor-pointer' key={user._id} >
                            <div className='w-[35px] h-[35px] mr-4 rounded-full overflow-hidden'>
                                <img src={user.profileImg} alt="" />
                            </div>
                            <div>
                                <p className='font-bold'>{user.name}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default AllUsers;
import React, { useEffect, useSyncExternalStore } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../features/userSlice';
import Spinner from '../main-components/Spinner';

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loggedInUser, loading } = useSelector(state => state.users)
    const handleLogin = (e) => {
        e.preventDefault()
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
        }
        dispatch(loginThunk(data))
    }
    useEffect(() => {
        if (loggedInUser?._id) {
            navigate("/")
        }
    }, [loggedInUser])

    if (loading) {
        return <Spinner />
    }
    return (
        <div className='h-[80vh] w-full flex items-center justify-center'>
            <div className='bg-1 w-[450px] p-8 rounded-2xl'>
                <p className='text-white font-bold text-[20px] text-center mb-4'>Login to ZEXT!</p>
                <form onSubmit={handleLogin} className='flex flex-col rounded-md font-bold'>

                    <label className='text-[13px] text-white mt-2 ml-2'>Email</label>
                    <input name="email" className='grow h-[35px] rounded-full px-4 mb-2' type="text" />

                    <label className='text-[13px] text-white mt-2 ml-2'>Password</label>
                    <input name="password" className='grow h-[35px] rounded-full px-4 mb-6' type="password" />
                    <button type="submit" className='grow h-[35px] rounded-full px-4 bg-2 text-white mb-2' value="login">Login</button>
                    <Link to="/signup" className='text-white' >Don't have an account? Signup...</Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
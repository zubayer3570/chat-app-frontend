import React, { useEffect, useSyncExternalStore } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../features/userSlice';

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loggedInUser } = useSelector(state => state.users)
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
        } else {

        }
    }, [loggedInUser])
    return (
        <form onSubmit={handleLogin} className='flex flex-col'>
            <p>login page</p>
            <input name='email' className='border-2' type="text" />
            <input name='password' className='border-2' type="text" />
            <input type="submit" value="login" />
            <Link to="/signup" >Already have an account? Signup...</Link>
        </form>
    );
};

export default Login;
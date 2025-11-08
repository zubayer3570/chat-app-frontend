import React, { useEffect, useSyncExternalStore } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../features/userSlice';
import Spinner from '../main-components/Spinner';
import { cryptoToJWKKeyPair, exportPublicKey, generateAndStorePrekeys, generateECDHKeyPair } from '../../utils/cryptoUtils';

const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loggedInUser, loading, errMessage } = useSelector(state => state.users)
    
    const handleLogin = async (e) => {
        e.preventDefault()

        const prekeys = generateAndStorePrekeys()

        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
            prekeys
        }

        dispatch(loginThunk(data))
    }


    useEffect(() => {
        if (loggedInUser?._id) {
            navigate("/")
        }
    }, [loggedInUser])
    

    return (
        <div className='h-[80vh] w-full flex items-center justify-center px-4'>
            <div className='bg-1 w-[450px] p-8 rounded-2xl'>
                <p className='text-white font-bold text-[20px] text-center mb-4'>Login to ZEXT!</p>
                <form onSubmit={handleLogin} className='flex flex-col rounded-md font-bold'>

                    <label className='text-[13px] text-white mt-2 ml-2'>Email</label>
                    <input name="email" className='grow h-[35px] rounded-full px-4 mb-2' type="text" />

                    <label className='text-[13px] text-white mt-2 ml-2'>Password</label>
                    <input name="password" className='grow h-[35px] rounded-full px-4 mb-2' type="password" />
                    <p className='text-red-500 mb-2' >{errMessage}</p>
                    <button type="submit" className='grow h-[35px] rounded-full px-4 bg-2 text-white mb-2' value="login">Login</button>
                    <Link to="/signup" className='text-white' >Don't have an account? <span className='inline-block px-2 py-[2px] rounded-full bg-white text-test-3'>Signup</span></Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
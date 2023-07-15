import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupThunk } from '../../features/userSlice';

const Signup = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const handleSignup = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("profileImg", e.target.profileImg.files[0])
        formData.append("name", e.target.name.value)
        formData.append("email", e.target.email.value)
        formData.append("password", e.target.password.value)
        formData.append("active", false)
        dispatch(signupThunk(formData))
    }
    const getFile = (e) => {
        e.preventDefault()
        document.getElementById("imgFile").click()
    }
    const setFileName = (e) => {
        document.getElementById("fileName").innerHTML = e.target.files[0].name
    }
    useEffect(() => {
        if (loggedInUser?._id) {
            navigate("/")
        }
    }, [loggedInUser])
    return (
        <div className='h-[80vh] w-full flex items-center justify-center'>
            <div className='bg-1 w-[450px] p-8 rounded-2xl'>
                <p className='text-white font-bold text-[20px] text-center mb-4'>Signup with Zext</p>
                <form onSubmit={handleSignup} encType='multipart/form-data' className='flex flex-col rounded-md font-bold'>
                    <label className='text-[13px] text-white mt-2 ml-2'>Name</label>
                    <input name="name" className='grow h-[35px] rounded-full px-4 mb-2' type="text" required />

                    <label className='text-[13px] text-white mt-2 ml-2'>Email</label>
                    <input name="email" className='grow h-[35px] rounded-full px-4 mb-2' type="text" required />

                    {/* file uploading */}
                    <label className='text-[13px] text-white mt-2 ml-2'>Profile Picture</label>
                    <div className='flex'>
                        <button onClick={getFile} id='fileName' className='text-white py-1 px-2 bg-test-2 rounded-full'>Upload</button>
                    </div>
                    <input onChange={setFileName} id="imgFile" name="profileImg" className='grow h-[35px] rounded-full px-4 mb-2 hidden' type="file" required />


                    <label className='text-[13px] text-white ml-2'>Password</label>
                    <input name="password" className='grow h-[35px] rounded-full px-4 mb-2' type="password" required />

                    <button type="submit" className='grow h-[35px] rounded-full px-4 bg-2 text-white mb-2' value="login">Signup</button>
                    <Link to="/login" className='text-white' >Already have an account? Login...</Link>
                </form>
            </div>
        </div>
    );
};

export default Signup;
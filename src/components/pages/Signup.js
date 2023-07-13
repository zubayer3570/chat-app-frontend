import React, { useEffect } from 'react';
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
        dispatch(signupThunk(formData))
    }
    useEffect(() => {
        if (loggedInUser?._id) {
            navigate("/")
        }
    }, [loggedInUser])
    return (
        <form onSubmit={handleSignup} encType='multipart/form-data' className='flex flex-col'>
            <p>Signup page</p>
            <input name="name" className='border-2' type="text" />
            <input name="email" className='border-2' type="text" />
            <input name="profileImg" className='border-2' type="file" />
            <input name="password" className='border-2' type="text" />
            <input type="submit" value="Signup" />
            <Link to="/login" >Already have an account? login...</Link>
        </form>
    );
};

export default Signup;
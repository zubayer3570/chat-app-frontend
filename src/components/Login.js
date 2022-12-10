import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllContext } from '../App';

const Login = () => {
    const {socketContext} = useContext(AllContext)
    const navigate = useNavigate()
    const userCredendtials = JSON.parse(localStorage.getItem("user-credentials"))
    useEffect(()=>{
        if(userCredendtials?.data?._id){
            navigate('/inbox')
        }
    }, [])
    const login = async (e) => {
        try {
            e.preventDefault()
            const username = e.target.username.value
            const password = e.target.password.value
            await axios.post('https://chat-app-pzz6.onrender.com/login', { username, password })
                .then((res) => {
                    localStorage.setItem("user-credentials", JSON.stringify({ data: res.data }))
                    socketContext.socket.emit('add_active_user', res.data._id)
                })
            
            navigate('/inbox')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form onSubmit={login} className="flex flex-col items-center mt-[100px]">
            <input type="text" name="username" className="input input-bordered min-w-[500px]" placeholder="enter your username" required />
            <input type="password" name="password" className="input input-bordered min-w-[500px] m-2" placeholder="enter your password" required />
            <input type="submit" value="Login" className="btn min-w-[500px]" />
        </form>
    );
};

export default Login;
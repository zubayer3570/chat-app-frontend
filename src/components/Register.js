import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = ({ socket }) => {
    const navigate = useNavigate()
    const register = async (e) => {
        try {
            e.preventDefault()
            const username = e.target.username.value
            const password = e.target.password.value
            await axios.post('http://localhost:5000/create-user', { username, password })
                .then((res) => {
                    localStorage.setItem("user-credentials", JSON.stringify({ data: res.data }))
                    socket.emit('add_active_user', res.data._id)
                })
            
            navigate('/inbox')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form onSubmit={register} className="flex flex-col items-center mt-[100px]">
            <input type="text" name="username" className="input input-bordered min-w-[500px]" placeholder="enter your username" required />
            <input type="password" name="password" className="input input-bordered min-w-[500px] m-2" placeholder="enter your password" required />
            <input type="submit" value="Register" className="btn min-w-[500px]" />
        </form>
    );
};

export default Register;
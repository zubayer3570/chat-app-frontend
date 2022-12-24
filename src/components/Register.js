import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AllContext } from '../App';

const Register = () => {
    const { socketContext } = useContext(AllContext)
    const navigate = useNavigate()
    const register = async (e) => {
        try {
            e.preventDefault()
            const username = e.target.username.value
            const password = e.target.password.value
            const formData = new FormData()
            formData.append('image', e.target.image.files[0])
            console.log(e.target.image.files[0])
            axios.post("https://api.imgbb.com/1/upload?key=994885ead587980a17dd092bc9155017", formData).then(res => {
                axios.post('http://localhost:5000/create-user', { profileImg: res.data.data.image.url, username, password })
                    .then((res) => {
                        localStorage.setItem("user-credentials", JSON.stringify({ data: res.data }))
                        socketContext.socket.emit('add_active_user', res.data._id)
                        navigate('/')
                    }).catch(err => console.log(err))
            }).catch(err => console.log(err))

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form onSubmit={register} className="flex flex-col items-center mt-[100px]">
            <input type="file" name='image' />
            <input type="text" name="username" className="input input-bordered min-w-[500px]" placeholder="enter your username" required />
            <input type="password" name="password" className="input input-bordered min-w-[500px] m-2" placeholder="enter your password" required />
            <input type="submit" value="Register" className="btn min-w-[500px]" />
            <div className='min-w-[500px] py-4 font-bold'>
                <Link to='/login' >Already have an Account? Login.</Link>
            </div>
        </form>
    );
};

export default Register;
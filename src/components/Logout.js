import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem("user-credentials")
        navigate('/')
    }
    return (
        <div>
            <button onClick={logout} className='btn'>Logout</button>
        </div>
    );
};

export default Logout;
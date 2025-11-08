import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import TextBox from '../main-components/TextBox';
import AllUsers from '../main-components/AllUsers';
import { getSocket } from '../../socket';
import AllConversations from '../main-components/AllConversations';
import { getToken } from 'firebase/messaging';
import { messaging } from '../../firebase';
import { autoLogin } from '../../features/userSlice';
import {api} from "../../api"


const Inbox = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { loggedInUser, receiver, authUserChecked } = useSelector(state => state.users)

    useEffect(() => {
        dispatch(autoLogin())
    }, [])

    // useEffect(() => {

    //     getSocket() && getSocket().on("connect", () => {
    //         if (loggedInUser?._id) {
    //             getSocket() && getSocket().emit("new_active_user", { userEmail: loggedInUser.email, socketID: getSocket().id })
    //         }
    //     })
        
    //     getSocket() && getSocket().on("disconnect", () => {
    //         getSocket() && getSocket().emit("typingStopped", { typingUser: loggedInUser, receiver })
    //     })

    //     if (window.innerWidth < 570) {
    //         if (!window.location.pathname.includes("mobile")) {
    //             navigate("/mobile/conversations")
    //         }
    //     }

    // }, [])

    // const requestPermission = async () => {
    //     const permission = await Notification.requestPermission()
    //     if (permission === "granted") {
    //         const token = await getToken(messaging, { vapidKey: "BBX6JaDHzapgmMupkHxIefyIGxKJZccE9D7TXp1OpQm4Dg7M_TKAzuoSPHUTCyPtYCdAZj76-T5Cv6ZPILf9_JI" })
    //         await api.post('https://chat-app-pzz6.onrender.com/update-notification-token', { email: loggedInUser.email, token })
    //     }
    // }
    
    // useEffect(() => {
    //     requestPermission()
    // }, [])

    useEffect(() => {
        if (!loggedInUser?._id && authUserChecked) {
            navigate('/login')
        }
    }, [authUserChecked])


    return (
        <>
            <div className={`flex bg-1 h-[100vh] lg:h-[100vh]`}>
                <AllConversations />
                <div className='flex-1 p-2'>
                    <TextBox />
                </div>
                <AllUsers />
            </div>
        </>
    );
};

export default Inbox;
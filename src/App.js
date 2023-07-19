import { Routes, Route, useNavigate } from 'react-router-dom'
import Inbox from './components/pages/Inbox';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import { useEffect } from 'react';
import { socket } from './socket';
import { loginThunk } from './features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import MobileAllConversations from './components/pages/MobilePages/MobileAllConversations';
import MobileAllUsers from './components/pages/MobilePages/MobileAllUsers';
import MobileTextbox from './components/pages/MobilePages/MobileTextbox';


function App() {
  const dispatch = useDispatch()
  const { loggedInUser } = useSelector(state => state.users)


  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(loginThunk(loggedInUser))
    }
  }, [])


  useEffect(() => {
    socket.connect()

    socket.on("connect", () => {
      if (loggedInUser?._id) {
        socket.emit("new_active_user", { userEmail: loggedInUser.email, socketID: socket.id })
      }
    })

    return () => socket.removeAllListeners()
  }, [])

  return (
    <>
      <Routes>
        <Route element={<Inbox />} path='/'></Route>
        <Route element={<Signup />} path='/signup'></Route>
        <Route element={<Login />} path='/login'></Route>
        <Route element={<MobileAllConversations />} path='/mobile/conversations'></Route>
        <Route element={<MobileAllUsers />} path='/mobile/all-users'></Route>
        <Route element={<MobileTextbox />} path='/mobile/textbox'></Route>
      </Routes>
    </>
  );
}

export default App;

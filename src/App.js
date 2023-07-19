import { Routes, Route, useNavigate } from 'react-router-dom'
import Inbox from './components/pages/Inbox';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import { useEffect } from 'react';
import { socket } from './socket';
import { selectConversation } from './features/conversationSlice';
import { addNewConversation, addNewUser, allUsersThunk, loginThunk, updateActiveStatus, updateLastMessage } from './features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addText } from './features/textSlice';
import MobileAllConversations from './components/pages/MobilePages/MobileAllConversations';
import MobileAllUsers from './components/pages/MobilePages/MobileAllUsers';
import MobileTextbox from './components/pages/MobilePages/MobileTextbox';


function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loggedInUser } = useSelector(state => state.users)
  const { selectedConversation } = useSelector(state => state.conversation)


  useEffect(() => {
    // dispatch(allUsersThunk())
    if (loggedInUser?._id) {
      dispatch(loginThunk(loggedInUser))
    }
  }, [])

  // useEffect(() => {
  //   if (!loggedInUser?._id) {
  //     navigate('/login')
  //   }
  // }, [loggedInUser])


  // useEffect(() => {
  //   socket.on("new_message", (data) => {
  //     if (selectedConversation._id == data.conversationID) {
  //       dispatch(addText(data))
  //     }
  //   })
  // }, [selectedConversation])

  useEffect(() => {
    socket.connect()

    socket.on("connect", () => {
      if (loggedInUser._id) {
        socket.emit("new_active_user", { userEmail: loggedInUser.email, socketID: socket.id })
      }
    })

    // socket.on("new_conversation", (newConversation) => {
    //   dispatch(addNewConversation(newConversation))
    //   if (newConversation.lastMessage.sender._id == loggedInUser._id) {
    //     dispatch(selectConversation(newConversation))
    //   }
    // })

    // socket.on("new_last_message", (data) => {
    //   dispatch(updateLastMessage(data))
    // })

    // socket.on("new_user", (data) => {
    //   dispatch(addNewUser(data))
    // })

    // socket.on("active_status_updated", (data) => {
    //   dispatch(updateActiveStatus(data))
    // })

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

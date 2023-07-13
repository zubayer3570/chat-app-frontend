
import { Routes, Route } from 'react-router-dom'
import Inbox from './components/pages/Inbox';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
// const socket = io("https://chat-app-pzz6.onrender.com/")

function App() {

  //socket connection
  // socket.on("connect", () => {
  //   socket.emit('new_active_user', { userID: user?._id, socketID: socket?.id, openedConverstaionID: currentConversation._id })
  // })

  return (
    <>
      <Routes>
        <Route element={<Inbox />} path='/'></Route>
        <Route element={<Signup />} path='/signup'></Route>
        <Route element={<Login />} path='/login'></Route>
      </Routes>
    </>
  );
}

export default App;

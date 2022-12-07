import { Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register';
import Inbox from './components/Inbox';
import Login from './components/Login';
import Users from './components/Users';
import { createContext, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("https://chat-app-pzz6.onrender.com/")

export const AllContext = createContext({
  userContext: {},
  receiverContext: {},
  currentConversationContext: {},
  socketContext: {}
})

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user-credentials"))?.data)
  const [receiver, setReceiver] = useState('')
  const [currentConversation, setCurrentConversation] = useState('')
  const value = {
    userContext: { user, setUser },
    receiverContext: { receiver, setReceiver },
    currentConversationContext: { currentConversation, setCurrentConversation },
    socketContext: { socket }
  }


  return (
    <>
      <AllContext.Provider value={value} >
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/users' element={<Users />} />
          <Route path='/inbox' element={<Inbox />} />
        </Routes>
      </AllContext.Provider>
    </>
  );
}

export default App;

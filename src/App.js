import { Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register';
import Inbox from './components/Inbox';
import { io } from 'socket.io-client'
import Login from './components/Login';
import Users from './components/Users';
import { createContext, useState } from 'react';

const socket = io("http://localhost:5000/")


export const CurrentConversationContext = createContext({
  currentConversation: {},
  setCurrentConversation: () => { }
})

function App() {
  const [currentConversation, setCurrentConversation] = useState('hi')
  const value = { currentConversation, setCurrentConversation }
  return (
    <>
      <CurrentConversationContext.Provider value={value}>
        <Routes>
          <Route path='/' element={<Login socket={socket} />} />
          <Route path='/Register' element={<Register socket={socket} />} />
          <Route path='/users' element={<Users socket={socket} />} />
          <Route path='/inbox' element={<Inbox socket={socket} />} />
        </Routes>
      </CurrentConversationContext.Provider>
    </>
  );
}

export default App;

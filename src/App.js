import { Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login';
import Inbox from './components/Inbox';
import { io } from 'socket.io-client'

const socket = io("http://localhost:5000/")



function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login socket={socket} />} />
        <Route path='/inbox' element={<Inbox socket={socket} />} />
      </Routes>
    </>
  );
}

export default App;

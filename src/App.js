import { Routes, Route } from 'react-router-dom'
import Inbox from './components/pages/Inbox';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import { useDispatch } from 'react-redux';
import { socketAddText } from './features/textSlice';
import { useEffect } from 'react';
import { socket } from './socket';


function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    socket.on("new_message", (data) => {
      dispatch(socketAddText(data))
    })
  }, [])


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

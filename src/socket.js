import { io } from 'socket.io-client'

let socket = null

export const connectSocket = (email) => {
    socket = io("https://chat-app-pzz6.onrender.com/", {
        autoConnect: false,
        query: {
            email
        }
    })
    
    socket.connect()
}

export const getSocket = () => {
    return socket
}


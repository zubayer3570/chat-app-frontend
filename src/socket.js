import { io } from 'socket.io-client'

let socket = null

export const connectSocket = (email) => {
    socket = io("http://localhost:5000/", {
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


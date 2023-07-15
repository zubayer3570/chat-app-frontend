import { io } from 'socket.io-client'

export const socket = io("https://chat-app-pzz6.onrender.com/", {
    autoConnect: false
})
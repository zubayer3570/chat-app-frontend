import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { socket } from '../socket'

export const signupThunk = createAsyncThunk("signupThunk", async (formData) => {
    const { data } = await axios.post("https://chat-app-pzz6.onrender.com/signup", formData)
    return data
})
export const loginThunk = createAsyncThunk("loginThunk", async (userData) => {
    const { data } = await axios.post("https://chat-app-pzz6.onrender.com/login", userData)
    return data
})
export const allUsersThunk = createAsyncThunk("allUsersThunk", async () => {
    const { data } = await axios.get("https://chat-app-pzz6.onrender.com/all-users")
    return data;
})

export const updateUnreadThunk = createAsyncThunk("updateUnreadThunk", async (conversationID) => {
    const { data } = await axios.post("https://chat-app-pzz6.onrender.com/update-unread", { conversationID })
    return data;
})


const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        loggedInUser: JSON.parse(localStorage.getItem("chat-app")) || {},
        receiver: {},
        loading: false,
        allUsers: []
    },
    reducers: {
        selectReceiver: (state, action) => {
            return { ...state, receiver: action.payload }
        },
        addConversationFromSocket: (state, action) => {
            const x = { ...state, loggedInUser: { ...state.loggedInUser, conversations: [...state.loggedInUser.conversations, action.payload] } }
            return x
        },
        updateLastMessage: (state, action) => {
            const newConversation = state.loggedInUser.conversations.map(conversation => {
                if (conversation._id == action.payload.conversationID) {
                    conversation = { ...conversation, lastMessage: action.payload }
                }
                return conversation
            })
            return { ...state, loggedInUser: { ...state.loggedInUser, conversations: newConversation } }
        },
        updateActiveStatus: (state, action) => {
            const updated = state.allUsers.map(user => {
                user = { ...user, active: false }
                action.payload.forEach(activeUserEmail => {
                    if (activeUserEmail == user.email) {
                        user = { ...user, active: true }
                    }
                })
                return user
            })
            return { ...state, allUsers: updated }
        },
        addNewUser: (state, action) => {
            return { ...state, allUsers: [...state.allUsers, action.payload] }
        },
        logoutUser: (state) => {
            localStorage.removeItem("chat-app")
            socket.disconnect()
            return { ...state, loggedInUser: {} }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signupThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(signupThunk.fulfilled, (state, action) => {
            localStorage.setItem("chat-app", JSON.stringify(action.payload))
            const data = { ...action.payload, active: true }
            return { ...state, loggedInUser: data, loading: false, message: {} }
        })


        builder.addCase(loginThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            if (action.payload._id) {
                localStorage.setItem("chat-app", JSON.stringify(action.payload))
                return { ...state, loggedInUser: action.payload, loading: false }
            } else {
                localStorage.removeItem("chat-app")
                return { ...state, loggedInUser: {}, message: action.payload, loading: false }
            }
        })


        builder.addCase(allUsersThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(allUsersThunk.fulfilled, (state, action) => {
            return { ...state, allUsers: action.payload, loading: false }
        })

        builder.addCase(updateUnreadThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateUnreadThunk.fulfilled, (state, action) => {
            const newConversation = state.loggedInUser.conversations.map(conversation => {
                if (conversation._id == action.payload._id) {
                    return action.payload
                }
                return conversation
            })
            return { ...state, loggedInUser: { ...state.loggedInUser, conversations: [...newConversation] } }
        })
    }
})
export const { selectReceiver, addConversationFromSocket, updateLastMessage, updateActiveStatus, addNewUser, logoutUser } = userSlice.actions
export default userSlice.reducer
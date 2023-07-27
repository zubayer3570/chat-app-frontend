import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { socket } from '../socket'
import { setAllConversations } from './conversationsSlice'


export const signupThunk = createAsyncThunk("signupThunk", async (formData, { dispatch }) => {
    const { data } = await axios.post("https://chat-app-pzz6.onrender.com/signup", formData)
    dispatch(setAllConversations([]))
    return data.user
})
export const loginThunk = createAsyncThunk("loginThunk", async (userData = JSON.parse(localStorage.getItem("chat-app")), { dispatch }) => {
    const { data } = await axios.post("https://chat-app-pzz6.onrender.com/login", userData)
    dispatch(setAllConversations(data.conversations))
    return data.user
})
export const allUsersThunk = createAsyncThunk("allUsersThunk", async () => {
    const { data } = await axios.get("https://chat-app-pzz6.onrender.com/all-users")
    return data;
})

export const newConversationThunk = createAsyncThunk("newConversationThunk", async (newConversation) => {
    const res = await axios.post("https://chat-app-pzz6.onrender.com/add-conversation", newConversation)
    return res.data
})


const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        loggedInUser: {},
        receiver: {},
        loading: false,
        allUsers: []
    },
    reducers: {
        selectReceiver: (state, action) => {
            return { ...state, receiver: action.payload }
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
            socket.removeAllListeners()
            socket.disconnect()
            return { ...state, loggedInUser: {}, allUsers: [], receiver: {} }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signupThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(signupThunk.fulfilled, (state, action) => {
            localStorage.setItem("chat-app", JSON.stringify(action.payload))
            const data = { ...action.payload}
            return { ...state, loggedInUser: data, loading: false, message: {} }
        })


        builder.addCase(loginThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            // console.log(action.payload)
            if (action.payload?._id) {
                socket.connect()
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
    }
})
export const {
    selectReceiver,
    updateActiveStatus,
    addNewUser,
    logoutUser
} = userSlice.actions
export default userSlice.reducer
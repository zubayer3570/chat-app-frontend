import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const savedUser = JSON.parse(localStorage.getItem("chat-app"))

export const signupThunk = createAsyncThunk("signupThunk", async (formData) => {
    const { data } = await axios.post("http://localhost:5000/signup", formData)
    return data
})
export const loginThunk = createAsyncThunk("loginThunk", async (userData) => {
    const { data } = await axios.post("http://localhost:5000/login", userData)
    return data
})
export const allUsersThunk = createAsyncThunk("allUsersThunk", async () => {
    const { data } = await axios.get("http://localhost:5000/all-users")
    return data;
})


const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        loggedInUser: savedUser,
        receiver: {},
        loading: false,
        allUsers: []
    },
    reducers: {
        selectReceiver: (state, action) => {
            return { ...state, receiver: action.payload }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signupThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(signupThunk.fulfilled, (state, action) => {
            localStorage.setItem("chat-app", JSON.stringify(action.payload))
            return { ...state, loggedInUser: action.payload, loading: false, message: {} }
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
    }
})
export const {selectReceiver} = userSlice.actions
export default userSlice.reducer
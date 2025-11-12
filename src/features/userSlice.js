import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { connectSocket, getSocket } from '../socket'
import { setAllConversations } from './conversationsSlice'
import {jwtDecode} from "jwt-decode"
import {api} from "../api"


export const signupThunk = createAsyncThunk("signupThunk", async (formData, { dispatch }) => {
    const res = await api.post("http://localhost:5000/signup", formData)
    dispatch(setAllConversations([]))
    return res.data
})

export const loginThunk = createAsyncThunk("loginThunk", async (userData, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post("http://localhost:5000/login", userData)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response.data.message)
    }
})

export const allUsersThunk = createAsyncThunk("allUsersThunk", async () => {
    const { data } = await api.get("http://localhost:5000/all-users", {headers: {Authorization: "Bearer " + JSON.parse(localStorage.getItem("chat-app")).accessToken} })
    return data;
})

const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        loggedInUser: {},
        receiver: {},
        allUsers: [],
        errMessage: "",
        authUserChecked: false,
        loading: true,
    },
    reducers: {
        selectReceiver: (state, action) => {
            return { ...state, receiver: action.payload }
        },
        updateActiveStatus: (state, action) => {
            const temp = [...state.allUsers];
            let activeUserEmail = [...action.payload]
            for (let i = 0; i < temp?.length; i++) {
                temp[i] = { ...temp[i], active: false }
                for (let j = 0; j < activeUserEmail?.length; j++) {
                    if (activeUserEmail[j] === temp[i].email) {
                        temp[i] = { ...temp[i], active: true }
                        activeUserEmail.splice(j, 1)
                        break;
                    }
                }
            }
            return { ...state, allUsers: temp }
        },
        addNewUser: (state, action) => {
            return { ...state, allUsers: [...state.allUsers, action.payload] }
        },
        autoLogin: state=> {
            try {
                const user = jwtDecode(JSON.parse(localStorage.getItem("chat-app")).accessToken).user
                if (user) {
                    connectSocket(user.email)
                    return {...state, loggedInUser: user, authUserChecked: true}
                } else {
                    // // console.log("hi")
                    localStorage.removeItem("chat-app")
                    getSocket() && getSocket().removeAllListeners()
                    getSocket() && getSocket().disconnect()
                    return { ...state, loggedInUser: {}, allUsers: [], receiver: {}, authUserChecked: true }
                }
            } catch (err) {
                // console.log(err)
                // // console.log("hi")
                localStorage.removeItem("chat-app")
                getSocket() && getSocket().removeAllListeners()
                getSocket() && getSocket().disconnect()
                return { ...state, loggedInUser: {}, allUsers: [], receiver: {}, authUserChecked: true }
            }
        },
        logoutUser: state => {
            // console.log("hi")
            localStorage.removeItem("chat-app")
            getSocket() && getSocket().removeAllListeners()
            getSocket() && getSocket().disconnect()
            return { ...state, loggedInUser: {}, allUsers: [], receiver: {} }
        },
        setUserLoading: (state, action) => {
            return {...state, loading: action.payload}
        }
    },
    extraReducers: (builder) => {

        builder.addCase(signupThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(signupThunk.fulfilled, (state, action) => {
            if (action.payload.accessToken){
                localStorage.setItem("chat-app", JSON.stringify(action.payload))

                const user = jwtDecode(action.payload.accessToken).user
                // creating socket connection with server
                connectSocket(user.email)

                return { ...state, loggedInUser: user, loading: false, message: {} }
            } else {
                return { ...state, loggedInUser: {}, loading: false, message: {} }
            }

            
        })
        builder.addCase(signupThunk.rejected, (state, action) => {
            // console.log("Signup error Payload: ", action.payload)
        })


        builder.addCase(loginThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            if (action.payload.accessToken) {
                localStorage.setItem("chat-app", JSON.stringify(action.payload))
                const user = jwtDecode(action.payload.accessToken).user

                // creating socket connection with server
                connectSocket(user.email)

                return { ...state, loggedInUser: user, loading: false }
            } else {
                localStorage.removeItem("chat-app")
                return { ...state, loggedInUser: {}, message: action.payload, loading: false }
            }
        })
        builder.addCase(loginThunk.rejected, (state, action) => {
            localStorage.removeItem("chat-app")
            return { ...state, errMessage: action.payload, loading: false }
        })

        // all users
        builder.addCase(allUsersThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(allUsersThunk.fulfilled, (state, action) => {
            return { ...state, allUsers: action.payload.allUsers, loading: false }
        })
        builder.addCase(allUsersThunk.rejected, (state, action) => {
            return { ...state, allUsers: [], loading: false }
        })
    }
})

export const {
    selectReceiver,
    updateActiveStatus,
    addNewUser,
    logoutUser,
    autoLogin,
    setUserLoading
} = userSlice.actions

export default userSlice.reducer
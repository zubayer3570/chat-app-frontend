import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { socket } from "../socket";
import { updateLastMessage } from "./conversationsSlice";

export const sendTextThunk = createAsyncThunk("sendTextThunk", async (message, { getState, dispatch }) => {
    const res = await axios.post("http://localhost:5000/send-text", message)
    const { loggedInUser, receiver } = getState().users
    const newMessage = { ...res.data.message, sender: loggedInUser, receiver: receiver }
    dispatch(updateLastMessage(newMessage))

    socket.emit("new_message", newMessage)
    socket.emit("new_last_message", newMessage)

    return { ...res.data.message, sender: loggedInUser, receiver: receiver }
})

export const getTextsThunk = createAsyncThunk("getTextsThunk", async (conversationID) => {
    const res = await axios.post("http://localhost:5000/get-texts", { conversationID })
    return res.data
})

const textSlice = createSlice({
    name: "textSlice",
    initialState: {
        texts: [],
        typingReceiver: null,
        loading: false
    },
    reducers: {
        addText: (state, action) => {
            return { ...state, texts: [...state.texts, action.payload] }
        },
        clearAllTexts: (state, action) => {
            return { ...state, texts: [] }
        },
        receiverTyping: (state, { payload }) => {
            return { ...state, typingReceiver: payload }
        },
        receiverStoppedTyping: (state) => {
            return { ...state, typingReceiver: null }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTextsThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(getTextsThunk.fulfilled, (state, action) => {
            return { ...state, texts: action.payload, loading: false }
        })

        builder.addCase(sendTextThunk.fulfilled, (state, action) => {
            return { ...state, texts: [...state.texts, action.payload] }
        })
    }
})

export const { addText, clearAllTexts, receiverTyping, receiverStoppedTyping } = textSlice.actions

export default textSlice.reducer
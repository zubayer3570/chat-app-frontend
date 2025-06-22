import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSocket } from "../socket";
import { updateLastMessage } from "./conversationsSlice";
import { api } from "../api"

export const sendTextThunk = createAsyncThunk("sendTextThunk", async (message, { getState, dispatch }) => {
    try {
        const res = await api.post("http://localhost:5000/send-text", message)
        console.log(getSocket().id)

        return res.data
    } catch (err) {
        console.log(err)
    }
})

export const getTextsThunk = createAsyncThunk("getTextsThunk", async (conversationId) => {
    const res = await api.post("http://localhost:5000/get-texts", { conversationId })
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
            // console.log(action.payload)
            // return { ...state, texts: [...state.texts, state.texts[0]] }
            // return { ...state, texts: [...state.texts, action.payload.message] }
            return state
        })
    }
})

export const { addText, clearAllTexts, receiverTyping, receiverStoppedTyping } = textSlice.actions

export default textSlice.reducer
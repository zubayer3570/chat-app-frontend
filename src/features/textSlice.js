import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const sendTextThunk = createAsyncThunk("sendTextThunk", async (message) => {
    await axios.post("https://chat-app-pzz6.onrender.com/send-text", message)
})

export const getTextsThunk = createAsyncThunk("getTextsThunk", async (conversationID) => {
    const res = await axios.post("https://chat-app-pzz6.onrender.com/get-texts", { conversationID })
    return res.data
})

const textSlice = createSlice({
    name: "textSlice",
    initialState: {
        texts: [],
        loading: false
    },
    reducers: {
        addText: (state, action) => {
            return { ...state, texts: [...state.texts, action.payload] }
        },
        clearAllTexts: (state, action) => {
            return { ...state, texts: [] }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTextsThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(getTextsThunk.fulfilled, (state, action) => {
            return { ...state, texts: action.payload, loading: false }
        })
    }
})

export const { addText, clearAllTexts } = textSlice.actions

export default textSlice.reducer
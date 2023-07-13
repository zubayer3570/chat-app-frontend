import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const sendTextThunk = createAsyncThunk("sendTextThunk", async (message) => {
    await axios.post("http://localhost:5000/send-text", message)
})

export const getTextsThunk = createAsyncThunk("getTextsThunk", async (conversationID) => {
    const res = await axios.post("http://localhost:5000/get-texts", { conversationID })
    console.log(res.data)
    return res.data
})


const textSlice = createSlice({
    name: "textSlice",
    initialState: {
        texts: [],
        loading: false
    },
    reducers: {
        hi: () => { }
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

export default textSlice.reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const sendTextThunk = createAsyncThunk("sendTextThunk", async (message) => {
    await axios.post("http://localhost:5000/send-text", message)
})

export const getTextsThunk = createAsyncThunk("getTextsThunk", async (conversationID) => {
    const res = await axios.post("http://localhost:5000/get-texts", { conversationID })
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
        },
        receiverTyping: (state, { payload }) => {
            const message = {
                _id: "demo-id",
                sender: payload,
                receiver: {},
                typing: true
            }
            return { ...state, texts: [...state.texts, message] }
        },
        receiverStoppedTyping: (state) => {
            const tempTexts = [...state.texts]
            
            if (tempTexts[tempTexts.length - 1].typing) {
                // console.log("hello-typing")
                tempTexts.pop()
            }
            return { ...state, texts: [...tempTexts] }
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

export const { addText, clearAllTexts, receiverTyping, receiverStoppedTyping } = textSlice.actions

export default textSlice.reducer
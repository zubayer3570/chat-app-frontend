import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSocket } from "../socket";
import { updateLastMessage } from "./conversationsSlice";
import { api } from "../api"

export const sendTextThunk = createAsyncThunk("sendTextThunk", async (message, { getState, dispatch }) => {
    try {
        const res = await api.post("http://localhost:5000/send-text", message)
        return res.data
    } catch (err) {
        console.log(err)
    }
})

export const getTextsThunk = createAsyncThunk("getTextsThunk", async (conversationId) => {
    const res = await api.post("http://localhost:5000/get-texts", { conversationId })
    return res.data
})

export const deleteTextThunk = createAsyncThunk("deleteTextThunk", async (textDetails) => {
    const res = await api.post("http://localhost:5000/delete-text", { textDetails })
    return res.data
})

export const updateTextThunk = createAsyncThunk("udpateTextThunk", async ({textDetails, text}) => {
    console.log(text)
    const res = await api.post("http://localhost:5000/update-text", { textDetails, text })
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
        },
        messageUpdated: (state, { payload }) => {
            const { updatedMessage } = payload
            console.log(updatedMessage)
            const newTexts = state.texts.map(text => {
                if (text._id == updatedMessage._id){
                    return updatedMessage
                } else {
                    return text
                }
            })
            return { ...state, texts: newTexts }
        },
        messageDeletedUpdate: (state, { payload }) => {
            const { deletedMessage } = payload
            const newTexts = state.texts.filter(text => text._id !== deletedMessage._id)
            console.log("hi message deleted")
            return { ...state, texts: newTexts }
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

        // builder.addCase(deleteTextThunk.fulfilled, (state, action) => {
        //     const { deletedText } = action.payload
        //     const newTexts = state.texts.filter(text => text._id !== deletedText._id)
        //     return { ...state, texts: newTexts }
        // })
    }
})

export const {
    addText,
    clearAllTexts,
    receiverTyping,
    receiverStoppedTyping,
    messageDeletedUpdate,
    messageUpdated
} = textSlice.actions

export default textSlice.reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSocket } from "../socket";
import { updateLastMessage } from "./conversationsSlice";
import { api } from "../api"
import { decryptMessage, loadAESKey } from "../utils/cryptoUtils";

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
    const aes_key = await loadAESKey(conversationId)
    const data = await Promise.all(res.data.map(async em => {
        const text = await decryptMessage(aes_key, em.text, em.iv)
        return { ...em, text }
    }))
    return data
})

export const deleteTextThunk = createAsyncThunk("deleteTextThunk", async (textDetails) => {
    const res = await api.post("http://localhost:5000/delete-text", { textDetails })
    return res.data
})

export const updateTextThunk = createAsyncThunk("udpateTextThunk", async ({ textDetails, text }) => {
    const res = await api.post("http://localhost:5000/update-text", { textDetails, text })
    return res.data
})

export const addTextThunk = createAsyncThunk("addTextThunk", async (message) => {
    const aes_key = await loadAESKey(message.conversationId)
    const text = await decryptMessage(aes_key, message.text, message.iv)
    return { ...message, text }
})

const textSlice = createSlice({
    name: "textSlice",
    initialState: {
        texts: [],
        typingReceiver: null,
        loading: false
    },
    reducers: {
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
                if (text._id == updatedMessage._id) {
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
            return state
        })

        builder.addCase(addTextThunk.fulfilled, (state, action) => {
            return { ...state, texts: [...state.texts, { ...action.payload }] }
        })

        // builder.addCase(deleteTextThunk.fulfilled, (state, action) => {
        //     const { deletedText } = action.payload
        //     const newTexts = state.texts.filter(text => text._id !== deletedText._id)
        //     return { ...state, texts: newTexts }
        // })
    }
})

export const {
    clearAllTexts,
    receiverTyping,
    receiverStoppedTyping,
    messageDeletedUpdate,
    messageUpdated,
} = textSlice.actions

export default textSlice.reducer
import { api } from "../api"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");


export const newConversationThunk = createAsyncThunk("newConversationThunk", async ({ sender, receiver }) => {
    try {
        const res = await api.post("http://localhost:5000/create-new-conversation", { sender, receiver })
        return res.data
    } catch (err) {
        console.log(err)
    }
})

export const getConversationsThunk = createAsyncThunk("getConversationsThunk", async ({ userId }) => {
    try {
        const res = await api.post("http://localhost:5000/get-conversations", { userId })
        return res.data
    } catch (err) {
        console.log(err)
    }
})

export const updateUnreadThunk = createAsyncThunk("updateUnreadThunk", async (lastMessage) => {
    const { data } = await api.post("http://localhost:5000/update-unread", { lastMessage })
    return data.updatedMessage;
})


const conversationsSlice = createSlice({
    name: "conversationsSlice",
    initialState: {
        selectedConversation: {},
        conversations: [],
        loading: false
    },
    reducers: {
        setAllConversations: (state, action) => {
            return { ...state, allConversations: action.payload }
        },
        selectConversation: (state, action) => {
            return { ...state, selectedConversation: action.payload }
        },
        addNewConversation: (state, action) => {
            // console.log("action payload", action.payload)
            return { ...state, selectedConversation: action.payload.conversation, conversations: [action.payload.conversation, ...state.conversations] }
        },
        updateLastMessage: (state, action) => {
            let targetIndex = null
            const tempConversation = state.conversations.filter((conversation, index) => {
                if (conversation?._id !== action.payload.conversationId) {
                    return conversation
                } else {
                    targetIndex = index
                    return 
                }
            })
            const targetConversation = state.conversations[targetIndex]
            return { ...state, conversations: [{...targetConversation, lastMessage: action.payload }, ...tempConversation] }
        },
    },
    extraReducers: (builder) => {

        builder.addCase(getConversationsThunk.fulfilled, (state, action) => {
            return { ...state, conversations: action.payload?.conversations }
        })

        builder.addCase(updateUnreadThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateUnreadThunk.fulfilled, (state, action) => {
            const newConversation = state.conversations.map(conversation => {
                if (conversation?._id === action.payload?.conversationId) {
                    return { ...conversation, lastMessage: { ...action.payload } }
                }
                return conversation
            })
            return { ...state, allConversations: [...newConversation] }
        })
    }
})

export const { 
    selectConversation, 
    setAllConversations, 
    updateLastMessage, 
    addNewConversation
} = conversationsSlice.actions

export default conversationsSlice.reducer
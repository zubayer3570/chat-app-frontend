import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// have to update the imports
export const updateUnreadThunk = createAsyncThunk("updateUnreadThunk", async (conversationID) => {
    const { data } = await axios.post("http://192.168.1.104:5000/update-unread", { conversationID })
    return data;
})

const conversationsSlice = createSlice({
    name: "conversationsSlice",
    initialState: {
        selectedConversation: {}, allConversations: [], loading: false
    },
    reducers: {
        setAllConversations: (state, action) => {
            return { ...state, allConversations: action.payload }
        },
        selectConversation: (state, action) => {
            return { ...state, selectedConversation: action.payload }
        },
        addNewConversation: (state, action) => {
            return { ...state, allConversations: [...state.allConversations, action.payload] }
        },
        updateLastMessage: (state, action) => {
            const newConversation = state.allConversations.map(conversation => {
                if (conversation._id == action.payload.conversationID) {
                    conversation = { ...conversation, lastMessage: action.payload }
                }
                return conversation
            })
            return { ...state, allConversations: [...newConversation] }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateUnreadThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateUnreadThunk.fulfilled, (state, action) => {
            const newConversation = state.allConversations.map(conversation => {
                if (conversation._id == action.payload._id) {
                    return action.payload
                }
                return conversation
            })
            return { ...state, allConversations: [...newConversation] }
        })
    }
})

export const { selectConversation, setAllConversations, updateLastMessage, addNewConversation } = conversationsSlice.actions
export default conversationsSlice.reducer
import { getSocket } from "../socket";
import { addText } from "./textSlice";
import { api } from "../api"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const newConversationThunk = createAsyncThunk("newConversationThunk", async ({ newConversation, message }, { dispatch }) => {
    try {
        const res = await api.post("http://localhost:5000/add-conversation", { newConversation, message })

        dispatch(addText(res.data.newConversation.lastMessage))

        getSocket() && getSocket().emit("new_conversation", res.data.newConversation)

        return res.data.newConversation

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
            return { ...state, allConversations: [action.payload, ...state.allConversations] }
        },
        updateLastMessage: (state, action) => {
            let targetIndex = null
            // console.log("payload", action.payload)
            const tempConversation = state.conversations.filter((conversation, index) => {
                // console.log(index)
                if (conversation?._id !== action.payload.conversationId) {
                    return conversation
                } else {
                    targetIndex = index
                    return 
                }
            })
            // console.log("tempConversation", tempConversation)
            const targetConversation = state.conversations[targetIndex]
            // console.log("convos: ", { ...state, conversations: [{...targetConversation, lastMessage: action.payload }, ...tempConversation] })
            return { ...state, conversations: [{...targetConversation, lastMessage: action.payload }, ...tempConversation] }
        },
    },
    extraReducers: (builder) => {

        builder.addCase(newConversationThunk.fulfilled, (state, action) => {
            return { ...state, selectedConversation: action.payload, allConversations: [action.payload, ...state.allConversations] }
        })

        builder.addCase(getConversationsThunk.fulfilled, (state, action) => {
            console.log(action.payload)
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

export const { selectConversation, setAllConversations, updateLastMessage, addNewConversation } = conversationsSlice.actions
export default conversationsSlice.reducer
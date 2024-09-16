import axios from "axios";
import { socket } from "../socket";
import { addText, sendTextThunk } from "./textSlice";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const newConversationThunk = createAsyncThunk("newConversationThunk", async ({ newConversation, message }, { dispatch }) => {
    try {
        const res = await axios.post("http://localhost:5000/add-conversation", { newConversation, message })

        dispatch(addText(res.data.newConversation.lastMessage))

        socket.emit("new_conversation", res.data.newConversation)

        return res.data.newConversation

    } catch (err) {

        console.log(err)

    }
})


export const updateUnreadThunk = createAsyncThunk("updateUnreadThunk", async (lastMessage) => {
    const { data } = await axios.post("http://localhost:5000/update-unread", { lastMessage })
    return data.updatedMessage;
})


const conversationsSlice = createSlice({
    name: "conversationsSlice",
    initialState: {
        selectedConversation: {},
        allConversations: [],
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
            const tempConversation = state.allConversations.filter(conversation => conversation?._id !== action.payload.conversationID)
            let targetConversation = state.allConversations.find(conversation => conversation?._id === action.payload.conversationID)
            targetConversation = { ...targetConversation, lastMessage: action.payload }
            return { ...state, allConversations: [targetConversation, ...tempConversation] }
        },
    },
    extraReducers: (builder) => {

        builder.addCase(newConversationThunk.fulfilled, (state, action) => {
            return { ...state, selectedConversation: action.payload, allConversations: [action.payload, ...state.allConversations] }
        })


        builder.addCase(updateUnreadThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateUnreadThunk.fulfilled, (state, action) => {
            const newConversation = state.allConversations.map(conversation => {
                if (conversation?._id === action.payload?.conversationID) {
                    return {...conversation, lastMessage: {...action.payload}}
                }
                return conversation
            })
            return { ...state, allConversations: [...newConversation] }
        })
    }
})

export const { selectConversation, setAllConversations, updateLastMessage, addNewConversation } = conversationsSlice.actions
export default conversationsSlice.reducer
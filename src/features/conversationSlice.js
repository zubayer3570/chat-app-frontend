import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
export const newConversationThunk = createAsyncThunk("newConversationThunk", async (newConversation) => {
    const res = await axios.post("http://localhost:5000/add-conversation", newConversation)
    return res.data
})


const conversationSlice = createSlice({
    name: "conversationSlice",
    initialState: {
        selectedConversation: {}, loading: false
    },
    reducers: {
        selectConversation: (state, action) => {
            state = { ...state, selectedConversation: action.payload }
            return state
        }
    }
})

export const { selectConversation } = conversationSlice.actions
export default conversationSlice.reducer
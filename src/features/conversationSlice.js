import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
export const newConversationThunk = createAsyncThunk("newConversationThunk", async (data) => {
    const res = await axios.post("http://localhost:5000/add-conversation", data)
    return res.data
})


const conversationSlice = createSlice({
    name: "conversationSlice",
    initialState: {
        selectedConversation: {}, loading: false
    },
    reducers: {
        selectConversation: (state, action) => {
            return { ...state, selectedConversation: action.payload }
        }
    }
})

export const { selectConversation } = conversationSlice.actions
export default conversationSlice.reducer
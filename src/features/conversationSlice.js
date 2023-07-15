const { createSlice } = require("@reduxjs/toolkit");

const conversationSlice = createSlice({
    name: "conversationSlice",
    initialState: {
        selectedConversation: {}, loading: false
    },
    reducers: {
        selectConversation: (state, action) => {
            return {...state, selectedConversation: action.payload}
        }
    }
})

export const { selectConversation } = conversationSlice.actions
export default conversationSlice.reducer
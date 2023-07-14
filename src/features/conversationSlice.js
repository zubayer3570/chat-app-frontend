const { createSlice } = require("@reduxjs/toolkit");

const conversationSlice = createSlice({
    name: "conversationSlice",
    initialState: {
        selectecdConversation: {}, loading: false
    },
    reducers: {
        selectConversation: (state, action) => {
            return {...state, selectecdConversation: action.payload}
        }
    },
    // extraReducers: (builder) => {
    //     builder.addCase()
    // }
})

export const { selectConversation } = conversationSlice.actions
export default conversationSlice.reducer
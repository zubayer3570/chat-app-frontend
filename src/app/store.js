import { configureStore } from "@reduxjs/toolkit";
import texts from '../features/textSlice'
import users from '../features/userSlice'
import conversation from '../features/conversationSlice'
import mobile from '../features/mobile.slice'

const store = configureStore({
    reducer: {
        users, texts, conversation, mobile
    }
})

export default store;
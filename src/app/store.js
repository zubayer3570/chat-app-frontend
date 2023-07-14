import { configureStore } from "@reduxjs/toolkit";
import texts from '../features/textSlice'
import users from '../features/userSlice'
import conversation from '../features/conversationSlice'

const store = configureStore({
    reducer: {
        texts, users, conversation
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false
    })
})

export default store;
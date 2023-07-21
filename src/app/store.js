import { configureStore } from "@reduxjs/toolkit";
import texts from '../features/textSlice'
import users from '../features/userSlice'
import conversations from '../features/conversationsSlice'

const store = configureStore({
    reducer: {
        users, texts, conversations
    }
})

export default store;
export { store };
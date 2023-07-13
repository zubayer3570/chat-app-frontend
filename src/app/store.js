import { configureStore } from "@reduxjs/toolkit";
import texts from '../features/textSlice'
import users from '../features/userSlice'

const store = configureStore({
    reducer: {
        texts, users
    }
})

export default store;
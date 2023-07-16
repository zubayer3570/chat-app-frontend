import { createSlice } from "@reduxjs/toolkit";

const mobileSlice = createSlice({
    name: "mobileSlice",
    initialState: "",
    reducers: {
        updatePage: (state, action)=>{

        }
    }
})

export const {updatePage} = mobileSlice.actions
export default mobileSlice.reducer
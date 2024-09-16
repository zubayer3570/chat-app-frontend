import { nanoid } from "@reduxjs/toolkit"

export const createNewConversation = (sender, receiver) => {
    
    return {
        participantsIDs: sender?._id + "###" + receiver?._id,
        lastMessage: {}
    }
}
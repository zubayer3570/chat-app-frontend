import { nanoid } from "@reduxjs/toolkit"

export const createNewConversation = (sender, receiver) => {
    const _id = nanoid()
    return {
        _id,
        participantsIDs: sender._id + "###" + receiver._id,
        lastMessage: {}
    }
}
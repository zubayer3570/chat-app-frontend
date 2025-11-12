import { api } from "../api"
import { deriveConversationKey, importPeerPublicKey, jwkToCryptoKeyPair, storeAESKey } from "../utils/cryptoUtils";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");


export const newConversationThunk = createAsyncThunk("newConversationThunk", async ({ sender, receiver }) => {
    try {
        const res = await api.post("http://localhost:5000/create-new-conversation", { sender, receiver })
        return res.data
    } catch (err) {
        console.log(err)
    }
})

export const getConversationsThunk = createAsyncThunk("getConversationsThunk", async ({ userId }) => {
    try {
        const res = await api.post("http://localhost:5000/get-conversations", { userId })
        return res.data
    } catch (err) {
        console.log(err)
    }
})

export const updateUnreadThunk = createAsyncThunk("updateUnreadThunk", async (lastMessage) => {
    const { data } = await api.post("http://localhost:5000/update-unread", { lastMessage })
    return data.updatedMessage;
})

export const getUsedPreKeysThunk = createAsyncThunk("getUsedPreKeysThunk", async ({ user }) => {
    try {
        const res = await api.post("http://localhost:5000/get-used-prekeys", { user })
        const { usedPreKeys } = res.data
        // console.log(usedPreKeys)
        const storedPreKeys = JSON.parse(localStorage.getItem("preKeys"))
        // console.log("storedPreKeys", storedPreKeys)

        if (Object.keys(storedPreKeys).length > 0) {
            await Promise.all(usedPreKeys?.map(async usedPreKey => {
                console.log("here I aaaaaaaam");

                const jwk = storedPreKeys[usedPreKey.preKey]; // get the JWK from object
                if (!jwk) return; // skip if not found

                const keyPair = await jwkToCryptoKeyPair(jwk);
                const senderPublicKey = await importPeerPublicKey(usedPreKey.senderPubKey);
                const aesKey = await deriveConversationKey(keyPair.privateKey, senderPublicKey);

                await storeAESKey(usedPreKey.conversationId, aesKey);

                // Optionally remove the key from object **after processing**
                delete storedPreKeys[usedPreKey.preKey];
            }));
        }

        localStorage.setItem("preKeys", JSON.stringify(storedPreKeys))

        return res.data
    } catch (err) {
        console.log(err)
    }
})


const conversationsSlice = createSlice({
    name: "conversationsSlice",
    initialState: {
        selectedConversation: {},
        conversations: [],
        loading: false
    },
    reducers: {
        setAllConversations: (state, action) => {
            return { ...state, allConversations: action.payload }
        },
        selectConversation: (state, action) => {
            return { ...state, selectedConversation: action.payload }
        },
        addNewConversation: (state, action) => {
            // console.log("action payload", action.payload)
            return { ...state, selectedConversation: action.payload.conversation, conversations: [action.payload.conversation, ...state.conversations] }
        },
        updateLastMessage: (state, action) => {
            let targetIndex = null
            const tempConversation = state.conversations.filter((conversation, index) => {
                if (conversation?._id !== action.payload.conversationId) {
                    return conversation
                } else {
                    targetIndex = index
                    return
                }
            })
            const targetConversation = state.conversations[targetIndex]
            return { ...state, conversations: [{ ...targetConversation, lastMessage: action.payload }, ...tempConversation] }
        },
    },
    extraReducers: (builder) => {

        builder.addCase(getConversationsThunk.fulfilled, (state, action) => {
            return { ...state, conversations: action.payload?.conversations }
        })

        builder.addCase(updateUnreadThunk.pending, (state) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateUnreadThunk.fulfilled, (state, action) => {
            const newConversation = state.conversations.map(conversation => {
                if (conversation?._id === action.payload?.conversationId) {
                    return { ...conversation, lastMessage: { ...action.payload } }
                }
                return conversation
            })
            return { ...state, allConversations: [...newConversation] }
        })
    }
})

export const {
    selectConversation,
    setAllConversations,
    updateLastMessage,
    addNewConversation
} = conversationsSlice.actions

export default conversationsSlice.reducer






// MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE2hxnLtYHX+x7UisgCLu9X3I5k3jWaI+4ps0c5CT0zDhSy8Faa+unE22VCUT2sIvAZjXno0Z7+jCNctzMCQDDzg==
// MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAED9PapqK+mtDR8NxoBZOyZl83yiW6UO/ocMcnRrdU5oXZzmeBblV4KSpzRXz3V1+eAw/jZFqhChHYq0oomLG35A==
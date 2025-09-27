import React from 'react'
import { deleteTextThunk, updateTextThunk } from '../../features/textSlice'
import { useDispatch } from 'react-redux'

export default function MessageOptions({ textDetails, handleClose }) {
    const dispatch = useDispatch()
    const handleDelete = () => {
        const ans = prompt("Are you sure to delete this message?")
        if (ans) {
            dispatch(deleteTextThunk(textDetails))
            handleClose()
        } else {
            alert("Message not deleted")
        }
    }

    const handleUpdate = () => {
        const text = prompt("Write the updated message here.")
        dispatch(updateTextThunk({textDetails, text}))
        handleClose()
    }

    return (
        <div className="flex justify-center space-x-4">
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700 box-shadow-md">
                Delete
            </button>
            <button onClick={handleUpdate} className="px-4 py-2 bg-yellow-200 text-gray-800 rounded hover:bg-gray-300">
                Update
            </button>
        </div>
    )
}

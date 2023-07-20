import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectReceiver } from '../../features/userSlice';
import { clearAllTexts, getTextsThunk } from '../../features/textSlice';
import { selectConversation } from '../../features/conversationSlice';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const handleClick = () => {
        dispatch(selectReceiver(user))
        dispatch(clearAllTexts())
        dispatch(selectConversation({}))
        for (const loggedInUserConversationID of loggedInUser.conversationIDs) {
            const conversationExists = user.conversationIDs.includes(loggedInUserConversationID)
            if (conversationExists) {
                const conversationToBeSelected = loggedInUser.conversations.find(con => con._id == loggedInUserConversationID)
                dispatch(selectConversation(conversationToBeSelected))
                dispatch(getTextsThunk(loggedInUserConversationID))
                break;
            }
        }

        if (window.location.pathname.includes("mobile")) {
            navigate("/mobile/textbox")
        }
    }
    return (
        <div onClick={handleClick} className='flex items-center justify-between px-8 lg:px-4 py-2 lg:w-[250px] rounded-md m-4 lg:m-2 cursor-pointer bg-test-3 shadow-1 text-white' key={user._id} >
            <div className='flex items-center'>
                <div className='w-[35px] h-[35px] mr-4 rounded-full overflow-hidden'>
                    <img src={user.profileImg} alt="" />
                </div>
                <div>
                    <p className='font-bold'>{user.name.split(" ")[0]}</p>
                </div>
            </div>
            {
                user.active ?
                    <div className={'h-[10px] w-[10px] rounded-full bg-test-2 mr-[20px]'}></div>
                    :
                    ""
            }
        </div>
    );
};

export default UserCard;
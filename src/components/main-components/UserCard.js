import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectReceiver } from '../../features/userSlice';
import { clearAllTexts, getTextsThunk } from '../../features/textSlice';
import { selectConversation } from '../../features/conversationSlice';

const UserCard = ({ user }) => {
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const handleClick = () => {
        dispatch(selectReceiver(user))
        dispatch(clearAllTexts())
        for (const loggedInUserConversationID of loggedInUser.conversationIDs) {
            for (const clickedUserConverationID of user.conversationIDs) {
                if (loggedInUserConversationID == clickedUserConverationID) {
                    dispatch(getTextsThunk(clickedUserConverationID))
                    const conversationToBeSelected = loggedInUser.conversations.find(con => con._id == clickedUserConverationID)
                    dispatch(selectConversation(conversationToBeSelected))
                    break;
                }
            }
        }
    }
    return (
        <div onClick={handleClick} className='flex items-center px-4 py-2 bg-white max-w-full rounded-md m-2 cursor-pointer' key={user._id} >
            <div className='w-[35px] h-[35px] mr-4 rounded-full overflow-hidden'>
                <img src={user.profileImg} alt="" />
            </div>
            <div>
                <p className='font-bold'>{user.name}</p>
            </div>
            {
                user.active ?
                    <div className={'h-[10px] w-[10px] rounded-full bg-green-500 mr-[20px]'}></div>
                    :
                    ""
            }
        </div>
    );
};

export default UserCard;
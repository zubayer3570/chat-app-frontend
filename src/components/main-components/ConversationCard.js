import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTextsThunk } from '../../features/textSlice';
import { selectReceiver, updateUnreadThunk } from '../../features/userSlice';

const ConversationCard = ({ conversation }) => {
    const dispatch = useDispatch()
    const { loggedInUser, allUsers } = useSelector(state => state.users)
    const conReceiverID = conversation?.participantsIds?.split("###").filter(id => !(loggedInUser._id == id))[0]
    const target = allUsers.find(user => user._id == conReceiverID)
    return (
        <div onClick={() => {
            dispatch(getTextsThunk(conversation._id))
            dispatch(selectReceiver(target))
            dispatch(updateUnreadThunk(conversation._id))
        }} className='flex justify-between  items-center px-4 bg-white h-[80px] max-w-full m-2 rounded-md cursor-pointer'>
            <div className='flex items-center h-full'>
                <div className='w-[50px] h-[50px] rounded-full overflow-hidden bg-red-500 mr-4'>
                    <img src={target?.profileImg} alt="" />
                </div>
                <div>
                    <p className='font-bold'>{target?.name}</p>
                    <p className=''>{conversation?.lastMessage.text}</p>
                </div>
            </div>
            {
                conversation.lastMessage.unread ?
                    <div className={'h-[10px] w-[10px] rounded-full bg-red-500 mr-[20px]'}></div>
                    :
                    ""
            }
        </div>
    );
};

export default ConversationCard;
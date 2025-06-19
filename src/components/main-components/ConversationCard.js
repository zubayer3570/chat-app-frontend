import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAllTexts, getTextsThunk } from '../../features/textSlice';
import { selectReceiver } from '../../features/userSlice';
import { selectConversation } from '../../features/conversationsSlice';
import { useNavigate } from 'react-router-dom';
import { updateUnreadThunk } from '../../features/conversationsSlice';

const ConversationCard = ({ conversation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.users)
    const receiver = conversation.userId_1._id === loggedInUser._id ? conversation.userId_2 : conversation.userId_1

    // console.log("this is receiver: ", receiver)
    // console.log(conversation)

    const handleCick = () => {
        dispatch(selectReceiver(receiver))
        dispatch(selectConversation(conversation))
        if (loggedInUser?._id === conversation?.lastMessage?.receiver?._id) {
            dispatch(updateUnreadThunk(conversation.lastMessage))
        }
        dispatch(clearAllTexts())
        dispatch(getTextsThunk(conversation?._id))

        if (window.location.pathname.includes("mobile")) {
            navigate('/mobile/textbox')
        }
    }

    return (
        <div className='p-2'>
            <div onClick={handleCick} className='flex justify-between items-center px-4 bg-test-2 w-full lg:w-[280px] h-[80px] rounded-md cursor-pointer shadow-1'>
                <div className='flex items-center h-full'>
                    <div className='w-[50px] h-[50px] rounded-full overflow-hidden bg-red-500 mr-4'>
                        <img src={receiver?.profileImg} alt="" />
                    </div>
                    <div>
                        <p className='font-bold'>{receiver?.name?.split(" ")[0]}</p>
                        <p className=''> <span>{conversation?.lastMessage?.sender?._id === loggedInUser?._id ? "You: " : ""}</span>  {conversation?.lastMessage?.text?.slice(0, 20)}</p>
                    </div>
                </div>
                {
                    conversation?.lastMessage?.unread && conversation?.lastMessage?.receiver?._id === loggedInUser?._id ?
                        <div className={'h-[10px] w-[10px] rounded-full bg-red-500 mr-[20px]'}></div>
                        :
                        ""
                }
            </div>
        </div>
    );
};

export default ConversationCard;
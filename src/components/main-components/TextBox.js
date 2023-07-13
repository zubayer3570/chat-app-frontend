import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendTextThunk } from '../../features/textSlice';
import Text from './Text';

const TextBox = () => {
    const { loggedInUser, receiver } = useSelector(state => state.users)
    const { texts } = useSelector(state => state.texts)
    const dispatch = useDispatch()
    if (!receiver._id) {
        return
    }
    const handleSend = (e) => {
        e.preventDefault()
        const text = e.target.text.value
        dispatch(sendTextThunk({ sender: loggedInUser, receiver, text, unread: true }))
        e.target.reset()
    }
    return (
        <>
            <div className='relative h-[100vh]'>
                <div className='flex justify-between items-center px-4 h-[50px] bg-white'>
                    <div className='w-[35px] h-[35px] rounded-full overflow-hidden'>
                        <img src={receiver.profileImg} alt="" />
                    </div>
                    <div>
                        <p className='font-bold'>{receiver.name}</p>
                    </div>
                </div>
                <div>
                    {
                        texts?.map(text => <Text text={text} key={text._id} />)
                    }
                </div>
                <form onSubmit={handleSend} className='absolute flex bottom-0 w-full pb-4'>
                    <input type="text" name="text" className='grow h-[50px]' />
                    <input type="submit" value="Send" />
                </form>
            </div>
        </>
    );
};

export default TextBox;
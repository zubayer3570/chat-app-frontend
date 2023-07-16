import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendTextThunk } from '../../features/textSlice';
import Text from './Text';
import style from '../../style.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const TextBox = () => {
    const navigate = useNavigate()
    const { loggedInUser, receiver } = useSelector(state => state.users)
    const { texts } = useSelector(state => state.texts)
    const dispatch = useDispatch()
    const handleSend = (e) => {
        e.preventDefault()
        const text = e.target.text.value
        dispatch(sendTextThunk({ sender: loggedInUser, receiver, text, unread: true }))
        e.target.reset()
    }
    useEffect(() => {
        document.getElementById("tool")?.scrollIntoView()
    }, [texts])

    // if (!receiver?._id) {
    //     return
    // }
    const sendheight = (e) => {
        axios.post('http://192.168.1.104:5000/send-height', { innerHeight: window.innerHeight, windowVisual: window.visualViewport.height })
    }
    return (
        <>
            <div className='flex flex-col justify-between relative shadow-1 h-full rounded-2xl'>
                {
                    receiver?._id ?
                        <>
                            <div className='flex justify-between absolute top-0 w-full items-center px-4 lg:px-12 h-[50px] backdrop-blur-xl bg-opacity-0'>
                                <div className='flex'>
                                    <span onClick={() => navigate('/mobile/conversations')} className='mr-2 inline lg:hidden font-bold'>Back</span>
                                    <div className='w-[35px] h-[35px] rounded-full overflow-hidden'>
                                        <img src={receiver.profileImg} alt="" />
                                    </div>
                                </div>
                                <div>
                                    <p className='font-bold'>{receiver.name}</p>
                                </div>
                            </div>
                            <div className={'overflow-auto pt-[50px] pb-4 ' + style.hideScrollbar} >
                                {
                                    texts?.map(text => <Text text={text} key={text._id} />)
                                }
                                <div id='tool' ></div>
                            </div>
                            <form onSubmit={handleSend} className='flex bottom-0 w-full px-4 mb-3'>
                                <input type="text" name="text" className='grow h-[35px] rounded-l-full px-4' />
                                <button type="submit" className='font-bold bg-test-3 h-[35px] rounded-r-full px-4 flex items-center'>
                                    <img src='/send.svg' className='h-[22px] w-[22px]' />
                                </button>
                            </form>
                        </>
                        :
                        <div></div>
                }
            </div>
        </>
    );
};

export default TextBox;
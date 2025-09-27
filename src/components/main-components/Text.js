import React from 'react'
import { useSelector } from 'react-redux';
import Typing from './Typing/Typing';
import OptionsModal from './modal';


const Text = ({ textDetails, img }) => {
    const { loggedInUser } = useSelector(state => state.users)
    const senderIsTheUser = loggedInUser?._id === textDetails?.sender?._id

    // modal state
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className={`flex items-center ${senderIsTheUser ? "justify-end" : ""} px-4 max-w-full m-2 cursor-pointer`}>
            <div className={`w-[40px] h-[40px] rounded-full overflow-hidden bg-red-500 mr-4 ${senderIsTheUser ? "order-2" : ''}`}>
                <img src={textDetails?.sender.profileImg} alt="" />
            </div>
            <div className={`shrink-0 max-w-[70%] p-2 px-4 rounded-[30px] shadow-1 ${senderIsTheUser ? "order-1 mr-2 bg-test-3" : 'bg-test-2'}`} >
                <p className='font-bold text-[white]'>{textDetails?.text}</p>
                {
                    // textDetails.text ?
                    //     <p className='font-bold text-[white]'>{textDetails?.text}</p>
                    //     :
                    //     textDetails.img ?
                    //         <img src={text?.img} alt="" />
                    //         :
                    //         text.typing ?
                    //             <Typing />
                    //             :
                    //             ""
                }
            </div>
            <span onClick={handleOpen} className='flex items-center w-[30px]' ><img src='/more.png' /></span>

            <OptionsModal textDetails={textDetails} open={open} setOpen={setOpen} handleClose={handleClose} />
            {/* {console.log(textDetails)} */}

        </div>
    );
};

export default Text;







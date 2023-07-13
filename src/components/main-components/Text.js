import React from 'react';

const Text = ({ text }) => {
    return (
        <div className='flex items-center px-4 h-[80px] max-w-full m-2 cursor-pointer'>
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden bg-red-500 mr-4'>
                <img src={text?.sender.profileImg} alt="" />
            </div>
            <div className='bg-white p-2 rounded-md'>
                {/* <p className='font-bold '>{text?.sender.name}</p> */}
                <p className='font-bold '>{text?.text}</p>
                {/* <p className=''>{text?.text}</p> */}
            </div>
        </div>
    );
};

export default Text;
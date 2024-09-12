import React from 'react';
import "./style.css"

const Typing = ({receiverProfileImage}) => {
    return (
        <div className={`flex items-end  px-4 max-w-full m-2 cursor-pointer`}>
            <div className={`w-[40px] h-[40px] rounded-full overflow-hidden bg-red-500 mr-4`}>
                <img src={receiverProfileImage} alt="" />
            </div>
            <div className={`shrink-0 max-w-[70%] p-2 px-4 rounded-[30px] shadow-1 bg-test-2`} >
                <div id="wave">
                    <span className="dot one"></span>
                    <span className="dot two"></span>
                    <span className="dot three"></span>
                </div>
            </div>
        </div>
    );
};

export default Typing;
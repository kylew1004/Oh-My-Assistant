import {useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import expiredImg from '../assets/expired.png';

export default function ExpiredModal({open}){
    const dialog=useRef();

    useEffect(()=>{
        if(open) dialog.current.showModal();
        else dialog.current.close();

    },[open]);
    
    return <dialog className="flex flex-col rounded-xl justify-center items-center p-3 gap-3 h-[55%] min-h-[500px] overflow-auto" ref={dialog}>
        <h2 className="mx-auto">Session Expired</h2>
        <hr className="h-[2px] bg-black w-11/12"></hr>
        <img src={expiredImg} className="h-1/3 min-h-[170px] m-7 "/>
        <p className="text-gray-500 m-7">Your session has expired! Please log back in to return to your page.</p>
        <Link to='/auth?mode=login' className="bg-yellow-500 rounded-full p-3 px-6 ">Log me in</Link>
    </dialog>

}
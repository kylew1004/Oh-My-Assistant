import { NavLink } from 'react-router-dom';
import arrowImg from '../assets/arrow.png';

export default function CreateNewPanel({type, detail, link, img, disable}){
    const splitType = type.split("&");

    return <NavLink to={link} onClick={disable ? e=>e.preventDefault() : (e)=>{}} className={`flex flex-col h-auto w-2/5 m-auto my-16 bg-${disable ? 'gray-400 cursor-auto hover:cursor-auto' : 'yellow-500'} rounded-3xl overflow-hidden py-5 pt-16`}>
        <h2 className="font-bold text-3xl h-1/4 mx-8 mb-4">{splitType[0]}<br />{splitType[1]}</h2>
        <p className="text-lg text-gray-600 h-1/4 mx-8"> {detail} </p>
        <img src={img} className=" w-full h-2/3 overflow-scroll opacity-20" />
        <div className="flex flex-row">
            {disable && <p className="text-sm px-4 m-auto text-red-800 mt-5">*Style reference를 먼저 실행해야 합니다.</p>}
            <img src={arrowImg} className="h-1/7 w-1/5 ml-auto mr-8 mt-4" />

        </div>
    </NavLink>
}
import { NavLink } from 'react-router-dom';
import arrowImg from '../assets/arrow.png';

export default function CreateNewPanel({type, detail, link, img}){
    const splitType = type.split("&");

    
    return <NavLink to={link} className="flex flex-col h-auto w-full m-10 my-16 bg-yellow-500 rounded-3xl overflow-hidden">
        <h2 className="font-bold text-3xl mt-10 ml-9">{splitType[0]}<br />{splitType[1]}</h2>
        <p className="text-lg mx-9 my-3 mb-8 h-10  text-gray-600"> {detail} </p>
        <img src={img} className=" h-72 w-full" />
        <img src={arrowImg} className="h-auto w-1/5 ml-auto mr-8 mt-4" />
    </NavLink>
}
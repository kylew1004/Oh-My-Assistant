import { NavLink } from 'react-router-dom';
import arrowImg from '../assets/arrow.png';

export default function CreateNewPanel({type, detail, link, img}){
    const splitType = type.split("&");

    
    return <NavLink to={link} className="flex flex-col h-auto w-4/6 m-20 bg-yellow-500 rounded-3xl overflow-hidden">
        <h1 className="font-bold text-5xl mx-auto mt-16">{splitType[0]}<br />{splitType[1]}</h1>
        <p className="text-xl mx-20 my-7 h-10  text-gray-600"> {detail} </p>
        <img src={img} className="h-auto w-full" />
        <img src={arrowImg} className="h-auto w-1/5 ml-auto mr-8 mt-7" />
    </NavLink>
}
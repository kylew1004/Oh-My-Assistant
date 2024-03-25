import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.svg';



export default function BackButton(){
    const navigate = useNavigate();

    return <button onClick={() => navigate(-1)} className="flex flex-row gap-1 bg-yellow-500 rounded-full py-2 pl-4 pr-7 hover:bg-yellow-600/70">
                <img src={backIcon} className="h-5 my-auto"/>
                <p className=" my-auto">Back</p>
            </button>

}
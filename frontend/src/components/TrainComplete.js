import {useNavigate, useParams} from 'react-router-dom';
import checkSvg from '../assets/check.svg';

export default function TrainComplete(){
    const navigate = useNavigate();
    const {webtoonName} = useParams();

    function handleClick(){
        navigate(`/${webtoonName}/assets`);
    }
    return <>
        <div className="flex flex-col mx-auto max-h-[90%] justify-center">
            <img src={checkSvg} className="h-1/5" />
            <h2 className="text-yellow-500">&nbsp;Training complete!</h2>
            <p className="text-gray-300">Style transfser is now available.</p>
        </div>
        
        <button onClick={handleClick} className="rounded-full text-[#342C5A] text-xl py-3 px-10
        bg-gradient-to-r from-[#F19E39] to-[#E34F6B] font-bold w-1/3 mx-auto">Go back to main page</button>
    </>
}
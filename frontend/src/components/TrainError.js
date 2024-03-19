import {useNavigate, useParams} from 'react-router-dom';
import nopePng from '../assets/nope.png';

export default function TrainError(){
    const navigate = useNavigate();
    const {webtoonName} = useParams();

    function handleClick(){
        navigate(`/${webtoonName}/train`);
    }
    return <>
        <div className="flex flex-col mx-auto max-h-[90%] justify-center">
            <img src={nopePng} className="h-[40%] mb-5" />
            <h2 className="text-yellow-500">&nbsp;Training model is busy now!</h2>
            <p className="text-gray-300">Please try again later.</p>
        </div>
        
        <button onClick={handleClick} className="rounded-full text-[#342C5A] text-xl py-3 px-10
        bg-gradient-to-r from-[#F19E39] to-[#E34F6B] font-bold w-1/3 mx-auto">Go back to train page</button>
    </>
}
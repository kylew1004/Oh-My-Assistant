import nopePng from '../assets/nope.png';

export default function TrainError({handleState}){

    return <>
        <div className="flex flex-col mx-auto max-h-[90%] m-auto justify-center">
            <img src={nopePng} className="h-24 w-24 mb-8 mx-auto" />
            <h2 className="text-yellow-500">Training model is busy now!</h2>
            <p className="text-gray-300 mx-auto">Please try again later.</p>
        </div>
        
        <button onClick={()=>handleState(0)} className="rounded-full text-[#342C5A] text-xl py-3 px-10
        bg-gradient-to-r from-[#F19E39] to-[#E34F6B] font-bold w-1/3 mx-auto">Go back to train page</button>
    </>
}
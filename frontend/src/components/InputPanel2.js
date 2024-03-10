import arrowImg from '../assets/arrow.png';

export default function InputPanel({characterUrl, poseUrl, isFetching, handleCharacter, handlePose, handleSubmit}){

    return  <div className="flex flex-col shadow-xl bg-white bg-opacity-90 rounded-3xl h-[95%] m-5 p-3 gap-4">
        <div className="flex flex-row h-full">
            <div className="w-full h-full flex-grow flex-col pb-16 my-auto relative shadow-xl bg-white bg-opacity-90  border-#7264a9 rounded-3xl p-5 py-4 mx-3">
                <div className="flex flex-row mb-2">
                    <h3 className="text-black text-lg font-bold">Target Character</h3>
                    <label className="create-new border-gray-300 mb-2 inline-block px-3 py-1 cursor-pointer ml-auto rounded-full bg-yellow-500">
                        <input className="hidden" type="file" onChange={handleCharacter} />
                        <p className="font-bold text-sm">Upload Image</p>
                    </label>
                </div>
                <span className="h-full mb-3 flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
                    {characterUrl && <img className="h-full w-full object-contain mx-auto" src={characterUrl}/>}
                </span>


            </div>
            <div className="w-full h-full flex-grow flex-col pb-16 my-auto relative shadow-xl bg-white bg-opacity-90  border-#7264a9 rounded-3xl p-5 py-4 mx-3">
                <div className="flex flex-row mb-2">
                    <h3 className="text-black text-lg font-bold">Target Pose</h3>
                    <label className="create-new border-gray-300 mb-2 inline-block px-3 py-1 cursor-pointer ml-auto rounded-full bg-yellow-500">
                        <input className="hidden" type="file" onChange={handlePose} />
                        <p className="font-bold text-sm">Upload Image</p>
                    </label>
                </div>
                <span className="h-full mb-3 flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
                    {poseUrl && <img className="h-full w-full object-contain mx-auto" src={poseUrl}/>}
                </span>
            </div>

        </div>
        <button className="flex flex-row h-12 w-full ml-auto bg-yellow-500 font-bold rounded-full disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
            onClick={handleSubmit}>
            <p className="flex flex-row m-auto">
                RUN
                <img className="h-4 mt-1.5 ml-3 transform rotate-90" onClick={handleSubmit} disabled={isFetching} src={arrowImg} />
            </p>
            
        </button>
        

    </div>

}
import arrowImg from '../assets/arrow.png';

export default function InputPanel({imageUrl, isFetching, handleChange, handleSubmit, handlePromptChange, prompt}){

    return  <div className="w-full h-full my-auto relative shadow-xl bg-white bg-opacity-90  border-#7264a9 rounded-3xl p-5 py-4 mx-3">
        <div className="flex flex-row mb-2">
            <h3 className="text-black text-lg font-bold">Input Image</h3>
            <label className="create-new border-gray-300 mb-2 inline-block px-3 py-1 cursor-pointer ml-auto rounded-full bg-yellow-500">
                <input className="hidden" type="file" onChange={handleChange} />
                <p className="font-bold text-sm">Upload Image</p>
            </label>
        </div>
        <span className="h-4/6 mb-3 flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
            {imageUrl && <img className="h-full w-full object-contain mx-auto" src={imageUrl}/>}
        </span>

        <h3 className="text-black text-lg">Prompt(optional)</h3>
        <input className=" w-full flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" id="prompt" name="prompt" type="text" value={prompt} onChange={handlePromptChange}/>
        <img className="h-9 mt-4 ml-auto my-auto disabled:bg-gray-400 cursor-pointer disabled:text-gray-700 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={isFetching} src={arrowImg} />
    </div>
}
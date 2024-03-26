import arrowImg from '../assets/arrow.png';
import Help from './Help.js';

export default function InputPanel({imageUrl, isFetching, handleChange, handleSubmit, handlePromptChange, prompt, cancelChange, handleModelChange}){

    return  <div className="flex flex-col w-full h-full my-auto relative shadow-xl bg-white bg-opacity-90  border-#7264a9 rounded-3xl p-5 py-4 mx-3 overflow-auto no-scrollbar">
        <div className="h-[7%] flex flex-row mb-2">
            <h3 className="text-black text-lg font-bold my-auto mr-1.5">Input Image</h3>
            <Help />
            <div className="flex flex-row ml-auto">
                {imageUrl && <button className="my-auto mr-1.5 bg-red-400 text-white rounded-full py-1 px-3 text-sm mb-2" onClick={cancelChange}>Cancel</button>}
                <label className="create-new border-gray-300 mb-2 inline-block px-3 py-1 cursor-pointer ml-0 rounded-full bg-yellow-500">
                    <input className="hidden" type="file" onChange={handleChange} />
                    <p className="font-bold text-sm">Upload Image</p>
                </label>
            </div>
        </div>
        <span className="h-[70%] w-full mb-3 flex border rounded-lg p-3 bg-violet-300/20 justify-center items-center object-contain mx-auto" >
            {imageUrl && <img className="h-full w-full object-contain mx-auto" src={imageUrl}/>}
        </span>

        <h3 className="text-black h-[5%] text-lg">Prompt</h3>
        <input className=" w-full h-[10%] flex border rounded-lg p-3 bg-violet-300/20 justify-center items-center object-contain mx-auto" id="prompt" name="prompt" type="text" value={prompt} onChange={handlePromptChange}/>

        <h3 className="text-black h-[5%] text-lg my-2">Model Type</h3>
        <select onChange={handleModelChange} className="p-1 bg-violet-300/20 rounded-lg">
            <option value="Lora">Lora</option>
            <option value="DreamStyler">DreamStyler</option>
        </select>

        <button className="flex h-[5%] mt-4 ml-auto my-auto cursor-pointer disabled:cursor-not-allowed" onClick={handleSubmit} disabled={isFetching}>
            <img className="h-full"  src={arrowImg} />
        </button>
    </div>
}
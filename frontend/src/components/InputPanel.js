export default function InputPanel({imageUrl, isFetching, handleChange, handleSubmit}){

    return  <div className="w-5/6 h-full my-auto relative shadow-xl space-y-5 bg-white bg-opacity-90  border-#7264a9 rounded-3xl p-5 py-10 mx-8">
        <h2 className="text-black">Add Image</h2>
        <label className="create-new border-gray-300 inline-block px-3 py-2 cursor-pointer">
            <input className="hidden" type="file" onChange={handleChange} />
            Upload file
        </label>
        <span className="h-4/6 flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
            {imageUrl && <img className="h-full w-full object-contain mx-auto" src={imageUrl}/>}
        </span>
        <button className="absolute bottom-8 right-8 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={isFetching}>Sumbit</button>
    </div>
}
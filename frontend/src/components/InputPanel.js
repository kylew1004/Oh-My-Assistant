export default function InputPanel({imageUrl, handleChange, handleSubmit}){

    return  <div className="w-2/5 h-5/6 relative shadow-xl mx-auto space-y-5 bg-white bg-opacity-90 border-violet-300 rounded-3xl p-5 py-10">
        <h2>Add Image</h2>
        <label className="border border-gray-300 inline-block px-3 py-2 cursor-pointer">
            <input className="hidden" type="file" onChange={handleChange} />
            Upload file
        </label>
        <img className="h-4/6 object-contain mx-auto" src={imageUrl} />
        <button className="absolute bottom-8 right-8" onClick={handleSubmit}>Sumbit</button>
    </div>
}
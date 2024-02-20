import DownloadBtn from './DownloadBtn.js';

export default function OutputPanel({imageUrl}){

    return  <div className="w-2/5 h-5/6 relative shadow-xl mx-auto space-y-5 bg-white bg-opacity-90  border-#7264a9 rounded-3xl p-5 py-10">
        <h2 className="pb-16">Output Image</h2>
        <img className="h-4/6 object-contain mx-auto"  src={imageUrl} />
        <DownloadBtn imageUrl={imageUrl}/>
    </div>
}
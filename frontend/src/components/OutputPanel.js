import spinner from '../assets/loading.gif';
import DownloadBtn from './DownloadBtn.js';
import Error from './Error.js';

export default function OutputPanel({imageUrl, isFetching, error}){
    let styling = "h-full w-full object-contain mx-auto"
    if(isFetching) {
        imageUrl=spinner;
        styling="h-1/6 object-contain mx-auto";
    }

    return  <div className="w-2/5 h-5/6 relative shadow-xl mx-auto space-y-5 bg-white bg-opacity-90  border-#7264a9 rounded-3xl p-5 py-10">
        <h2 className="pb-16">Output Image</h2>
        {error ? <Error message={error.message} /> : 
         <span className="h-4/6 flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
         {imageUrl && <img className={styling} src={imageUrl}/>}
        </span>}
        <DownloadBtn imageUrl={imageUrl} isFetching={isFetching}/>
    </div>
}
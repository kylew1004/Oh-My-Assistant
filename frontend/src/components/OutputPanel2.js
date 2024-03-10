import {useState, useEffect} from 'react';
import spinner from '../assets/loading.gif';
import Error from './Error.js';
import SaveAssetModal from './SaveAssetModal.js';

export default function OutputPanel({imageUrl, isFetching, error}){
    const [isModal, setIsModal] = useState(false);

    let styling = "h-full w-full object-contain mx-auto"
    if(isFetching) {
        imageUrl=spinner;
        styling="h-1/6 object-contain mx-auto";
    }

    function handleSubmit(){
        setIsModal(true); 
    }

    function handleClose(){
        setIsModal(false);
    }


    return  <>
            <SaveAssetModal open={isModal} handleClose={handleClose} />
        
       

        <div className="flex flex-row shadow-xl bg-white bg-opacity-90 rounded-3xl h-[95%] m-5 p-5 gap-4">
            {error ? <Error message={error.message} /> : 
            <span className=" h-full w-[55%] flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
            {isFetching ? <img className={styling} src={imageUrl}/> 
                : (imageUrl && <img className={styling} src={imageUrl[0]}/>) }
            
            </span>}

            <div className="flex flex-col w-[45%] h-full gap-3">
                <p className="text-black text-lg font-bold">Process Image</p>
                <span className=" h-full w-full flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
                {isFetching ? <img className={styling} src={imageUrl}/> 
                    : (imageUrl && <img className={styling} src={imageUrl[1]}/>) }
                
                </span>
                {/* <DownloadBtn imageUrl={imageUrl} isFetching={isFetching}/> */}
                <button className="m-auto w-full h-16 rounded-full bg-yellow-500 px-5 py-1 mt-4 mr-1 disabled:text-gray-700 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={isFetching || !imageUrl}>Save</button>
            </div>
            
        
    </div>
    
    </>
}
import {useState, useEffect} from 'react';
import spinner from '../assets/loading.gif';
import Error from './Error.js';
import SaveAssetModal from './SaveAssetModal.js';

export default function OutputPanel({imageUrl, isFetching, error}){
    const [activeImage, setActiveImage] = useState();
    const [isSelect, setIsSelect] = useState(false);
    const [selected, setSelected] = useState([]);
    const [isModal, setIsModal] = useState(false);

    let styling = "h-full w-full object-contain mx-auto"
    if(isFetching) {
        imageUrl=spinner;
        styling="h-1/6 object-contain mx-auto";
    }

    useEffect(()=>{
        if(imageUrl) setActiveImage(imageUrl[0]);
    },[imageUrl]);

    function handleSelect(item){
        setSelected(prev=>{
            let updated=[...prev];
            if(updated.includes(item)) updated = updated.filter(item1 => item1 !== item);
            else updated.push(item);
            return updated; 
        });
    }

    function handleSubmit(){
        if(!isSelect) setIsSelect(true);
        else{
            if(selected.length===0) alert("Please select at leat one image!");
            else setIsModal(true);

        } 
    }

    function handleClose(){
        setIsModal(false);
        setIsSelect(false);
        setSelected([]);
    }

    function handleCancel(){
        setIsSelect(false);
        setSelected([]);
    }

    return  <>
            <SaveAssetModal open={isModal} handleClose={handleClose} />
        
       

        <div className="w-full h-full my-auto relative shadow-xl bg-white bg-opacity-90  border-#7264a9 rounded-3xl p-4 py-5 mx-3">
        {error ? <Error message={error.message} /> : 
         <span className=" h-[75%] flex border rounded-lg p-3 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
         {isFetching ? <img className={styling} src={imageUrl}/> 
            : (activeImage && <img className={styling} src={activeImage}/>) }
         
        </span>}
        <ul className="h-[14%] gap-3 mt-3 flex flex-row rounded-lg p-3 pr-5 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
         {imageUrl && !isFetching && imageUrl.map((item,index)=>{
            return <li className="relative inline-block"key={index}>
                <img className={`h-14 w-14 rounded-xl ${activeImage===item && " border-4 border-yellow-500"}`} src={item} onClick={ (()=>setActiveImage(item))}/>
                {isSelect && <button className={`absolute top-0 right-0 transform translate-y--2 -translate-x--1 border-2  bg-white bg-opacity-80 rounded-full ${!selected.includes(item) ? 'px-3 border-gray-500' : 'px-2 text-green-600 border-green-600'} text-md`}
                            onClick={()=>handleSelect(item)}>{selected.includes(item) ? 'v' : <br />}</button> }
            </li>
         })}
        </ul>
        {/* <DownloadBtn imageUrl={imageUrl} isFetching={isFetching}/> */}
        <div className="flex flex-row">
            {isSelect && <button className="mr-auto my-auto rounded-full bg-red-500 px-5 text-white py-1 mt-4" onClick={handleCancel}>Cancel</button>}
            <button className="ml-auto my-auto rounded-full bg-yellow-500 px-5 py-1 mt-4 mr-1 disabled:text-gray-700 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={isFetching || !imageUrl}>{!isSelect ? 'Select': 'Save'}</button>
        </div>
        
    </div>
    
    </>
}
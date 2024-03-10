import React, { useState } from "react";

import OutputPanel from '../components/OutputPanel.js';
import InputPanel from '../components/InputPanel.js';

import { fetchOutput, postInput } from '../util/http.js';
import { postStyleTransfer } from "../util/http.js";
 
function StyleTransfer() {
    const [file, setFile] = useState();
    const [outputUrl, setOutputUrl] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const [errorFetching, setErrorFetching] = useState();

    let fileUrl=null;
    if(file) {fileUrl = URL.createObjectURL(file);}

    function handleChange(e) {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
        setErrorFetching(null);
        setIsFetching(false);
        
    }

    async function handleSubmit(){
      if(file){
        //send data to backend
        setErrorFetching(null);
        setIsFetching(true);

        postStyleTransfer(file)
          // .then(() =>{
          //   return fetchOutput();
          // })
          .then(imgUrl =>{
            console.log(imgUrl);
            setOutputUrl(imgUrl);
            setErrorFetching(null);
            setIsFetching(false);
          })
          .catch(error => {
            setErrorFetching({
              message: 
                error.message || 'Could not process image, please try again later.',
            });
            setIsFetching(false);
          });

      }else{
        alert('Please uplaod an image!');
      }

    }

 
    return (
        <>
        <header className="flex font-sans flex-row items-center justify-center pt-5 pb-3">
          <h2 className="text-gray-600">SCENE STYLE TRANSFER</h2>
          {/* <button>Back</button> */}
        </header>
        <hr className="bg-gray-700 h-[0.4px] w-11/12 mx-auto" />

        <div className="flex font-sans flex-row items-center justify-center h-screen my-auto pt-6 pb-3">
          <InputPanel imageUrl={fileUrl} isFetching={isFetching} handleChange={handleChange} handleSubmit={handleSubmit}/>
          <OutputPanel imageUrl={outputUrl} isFetching={isFetching} error={errorFetching} />    
        </div>
        </>
    );
}
 
export default StyleTransfer;

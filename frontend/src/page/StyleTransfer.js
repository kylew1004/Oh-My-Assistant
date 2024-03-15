import React, { useState , useEffect} from "react";
import {redirect, useParams} from 'react-router-dom';

import OutputPanel from '../components/OutputPanel.js';
import InputPanel from '../components/InputPanel.js';

import { fetchOutput, postInput } from '../util/http.js';
import { postStyleTransfer } from "../util/http.js";
 
function StyleTransfer() {
    const [file, setFile] = useState();
    const [prompt, setPrompt] = useState();
    const [outputs, setOutputs] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const [errorFetching, setErrorFetching] = useState();
    const {webtoonName} = useParams();

    let fileUrl=null;
    if(file) {fileUrl = URL.createObjectURL(file);}

    function handleChange(e) {
        console.log(e.target.files[0]);
        setPrompt("");
        setFile(e.target.files[0]);
        setErrorFetching(null);
        setIsFetching(false);
        setOutputs(null);
    }

    function handlePromptChange(e){
      setPrompt(e.target.value);
    }

    async function handleSubmit(){
      console.log(prompt, webtoonName);
      console.log(file);
      if(file || prompt){
        //send data to backend
        setErrorFetching(null);
        setIsFetching(true);

        postStyleTransfer(file,prompt,webtoonName)
          .then(imgArr =>{
            console.log(imgArr);
            setOutputs(imgArr);
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
        alert('Please uplaod an image or enter prompt!');
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
          <InputPanel imageUrl={fileUrl} prompt={prompt} isFetching={isFetching} handleChange={handleChange} handleSubmit={handleSubmit} handlePromptChange={handlePromptChange}/>
          <OutputPanel images={outputs} isFetching={isFetching} error={errorFetching} originalImg={file} />    
        </div>
        </>
    );
}
 
export default StyleTransfer;


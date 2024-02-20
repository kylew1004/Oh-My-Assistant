import React, { useState } from "react";

import OutputPanel from './components/OutputPanel.js';
import InputPanel from './components/InputPanel.js';

import { fetchOutput, postInput } from './http.js';
import arrowImg from './assets/arrow.png';
 
function App() {
    const [file, setFile] = useState();
    const [outputFile, setOutputFile] = useState();

    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function handleSubmit(){
      //send data to backend
      setOutputFile(()=> file);
    }

 
    return (
        <div className="flex font-sans flex-row items-center justify-center h-screen md:mb-16">
          <InputPanel imageUrl={file} handleChange={handleChange} handleSubmit={handleSubmit}/>
          <img className="object-contain max-h-24" src={arrowImg}/>
          <OutputPanel imageUrl={outputFile}/>    
        </div>
    );
}
 
export default App;

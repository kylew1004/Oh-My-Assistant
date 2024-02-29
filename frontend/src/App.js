import React, { useState } from "react";

import OutputPanel from './components/OutputPanel.js';
import InputPanel from './components/InputPanel.js';

import { fetchOutput, postInput } from './http.js';
import arrowImg from './assets/arrow.png';
 
function App() {
    const [file, setFile] = useState();
    const [outputUrl, setOutputUrl] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const [errorFetching, setErrorFetching] = useState();

    let fileUrl=null;
    if(file) {fileUrl = URL.createObjectURL(file);}

    function handleChange(e) {
        console.log("!!"+URL.createObjectURL(e.target.files[0])+"!!");
        // setFile(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
        setErrorFetching(null);
        setIsFetching(false);
        
    }

    async function handleSubmit(){
      if(file){
        //send data to backend
        setErrorFetching(null);
        setIsFetching(true);

        postInput(file)
          .then(() =>{
            return fetchOutput();
          })
          .then(imgUrl =>{
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
        {/* <header className="flex font-sans flex-row items-center justify-center p-16">
          <h2>Style Transfer demo</h2>
        </header> */}

        <div className="flex font-sans flex-row items-center justify-center h-screen md:mb-16">
          <InputPanel imageUrl={fileUrl} isFetching={isFetching} handleChange={handleChange} handleSubmit={handleSubmit}/>
          <img className="object-contain max-h-24" src={arrowImg}/>
          <OutputPanel imageUrl={outputUrl} isFetching={isFetching} error={errorFetching} />    
        </div>
        </>
    );
}
 
export default App;

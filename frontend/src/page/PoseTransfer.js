import React, { useState, useRef, useEffect } from "react";

import OutputPanel from '../components/OutputPanel2.js';
import InputPanel from '../components/InputPanel2.js';

import { postPoseTransfer } from '../util/http.js';
import BackButton from "../components/BackButton.js";

import { validateExt } from "../util/util.js";
 
function PoseTransfer() {
    const [character, setCharacter] = useState();
    const [pose, setPose] = useState();

    const [outputs, setOutputs] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const [errorFetching, setErrorFetching] = useState();
    const bottomRef = useRef();

    useEffect(()=>{
      if(isFetching) scrollToBottom();
    },[isFetching]);

    let characterUrl=null;
    if(character) {characterUrl = URL.createObjectURL(character);}
    let poseUrl=null;
    if(pose) {poseUrl = URL.createObjectURL(pose);} 

    const scrollToBottom = async () => {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' }); 
    };

    function handleCharacter(e) {
      if(e.target.files.length>0){
        const currFile = e.target.files[0];
        if(validateExt(currFile)){
          setCharacter(currFile);
          setErrorFetching(null);
          setIsFetching(false);
          setOutputs(null);   
        }else alert('The file must have jpg, jpeg or png extension!');
      }
      
    }

    function handlePose(e) {
      if(e.target.files.length>0){
        const currFile = e.target.files[0];
        if(validateExt(currFile)){
          setPose(currFile);
          setErrorFetching(null);
          setIsFetching(false);
          setOutputs(null);   
        }else alert('The file must have jpg, jpeg or png extension!');

      }
      
  }

    async function handleSubmit(){
      if(character && pose){
        //send data to backend
        setErrorFetching(null);
        setIsFetching(true);

        const data = new FormData();
        data.append('poseImage', pose);
        data.append('characterImage', character);

        postPoseTransfer(data)
          .then(imgArray =>{
            if(imgArray.error){
              setErrorFetching({
                message: 
                  imgArray.error || 'Could not process image, please try again later.',
              });
            }else{
              setOutputs(imgArray);
              setErrorFetching(null);
            }
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
        <header className="flex font-sans flex-row items-center justify-center pt-5 pb-3 ml-5">
          <BackButton />
          <h2 className="text-gray-600 w-full m-auto text-center mr-32">CHARACTER POSE TRANSFER</h2>
        </header>
        <hr className="bg-gray-700 h-[0.4px] w-11/12 mx-auto" />

        <div className="overflow-y-scroll h-full">
          <InputPanel 
            characterUrl={characterUrl}
            poseUrl={poseUrl} 
            isFetching={isFetching} 
            handleCharacter={handleCharacter} 
            handlePose={handlePose} 
            handleSubmit={handleSubmit}
            />
          <OutputPanel ref={bottomRef} images={outputs} isFetching={isFetching} error={errorFetching} originalImages={[character,pose]} />    
        </div>
        </>
    );
}
 
export default PoseTransfer;

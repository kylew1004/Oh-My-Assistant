import React, { useState } from "react";

import OutputPanel from '../components/OutputPanel2.js';
import InputPanel from '../components/InputPanel2.js';

import { postPoseTransfer } from '../util/http.js';
 
function PoseTransfer() {
    const [character, setCharacter] = useState();
    const [pose, setPose] = useState();

    const [outputUrl, setOutputUrl] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const [errorFetching, setErrorFetching] = useState();

    let characterUrl=null;
    if(character) {characterUrl = URL.createObjectURL(character);}
    let poseUrl=null;
    if(pose) {poseUrl = URL.createObjectURL(pose);}

    function handleCharacter(e) {
        console.log(e.target.files[0]);
        setCharacter(e.target.files[0]);
        setErrorFetching(null);
        setIsFetching(false);   
    }

    function handlePose(e) {
      console.log(e.target.files[0]);
      setPose(e.target.files[0]);
      setErrorFetching(null);
      setIsFetching(false);   
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
            console.log(imgArray);
            setOutputUrl(imgArray);
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
          <h2 className="text-gray-600">CHARACTER POSE TRANSFER</h2>
          {/* <button>Back</button> */}
        </header>
        <hr className="bg-gray-700 h-[0.4px] w-11/12 mx-auto" />

        <div className="overflow-scroll h-full">
          <InputPanel 
            characterUrl={characterUrl}
            poseUrl={poseUrl} 
            isFetching={isFetching} 
            handleCharacter={handleCharacter} 
            handlePose={handlePose} 
            handleSubmit={handleSubmit}/>
          <OutputPanel imageUrl={outputUrl} isFetching={isFetching} error={errorFetching} />    
        </div>
        </>
    );
}
 
export default PoseTransfer;


export async function action({request}){
  // const data = await request.formData();
  // let result;
  // if(mode=='login'){
  //   const authData = {
  //     userEmail: data.get('email'),
  //     userPassword:data.get('password'),
  //   }

  //   result = await postLogin(authData);

  // }

  window.location.reload();
  return null;
}

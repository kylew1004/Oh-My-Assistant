import React, { useState } from "react";
import { useParams } from "react-router-dom";

import OutputPanel from "../components/OutputPanel.js";
import InputPanel from "../components/InputPanel.js";

import { postStyleTransfer } from "../util/http.js";
import BackButton from "../components/BackButton.js";

import { validateExt } from "../util/util.js";

function StyleTransfer() {
  const [file, setFile] = useState();
  const [prompt, setPrompt] = useState();
  const [model, setModel] = useState("Lora");

  const [outputs, setOutputs] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [errorFetching, setErrorFetching] = useState();
  const { webtoonName } = useParams();

  let fileUrl = null;
  if (file) {
    fileUrl = URL.createObjectURL(file);
  }

  function handleChange(e) {
    if (e.target.files.length > 0) {
      const currFile = e.target.files[0];
      if (validateExt(currFile)) {
        setPrompt("");
        setFile(currFile);
        setErrorFetching(null);
        setIsFetching(false);
        setOutputs(null);
      } else alert("The file must have jpg, jpeg or png extension!");
    }
  }

  function handlePromptChange(e) {
    setPrompt(e.target.value);
  }

  function handleModelChange(e) {
    setModel(e.target.value);
  }

  function cancelChange() {
    setFile(null);
  }

  async function handleSubmit() {
    if (file || prompt) {
      //send data to backend
      setErrorFetching(null);
      setIsFetching(true);

      postStyleTransfer(file, prompt, webtoonName, model)
        .then((imgArr) => {
          if (imgArr.error) {
            setErrorFetching({
              message:
                imgArr.error ||
                "Could not process image, please try again later.",
            });
          } else {
            setOutputs(imgArr);
            setErrorFetching(null);
          }
          setIsFetching(false);
        })
        .catch((error) => {
          setErrorFetching({
            message:
              error.message ||
              "Could not process image, please try again later.",
          });
          setIsFetching(false);
        });
    } else {
      alert("Please uplaod an image or enter prompt!");
    }
  }

  return (
    <>
      <header className="flex h-[10%] font-sans flex-row items-center justify-center pt-5 pb-3 ml-5">
        <BackButton />
        <h2 className="text-gray-600 w-full text-center mr-28 m-auto">
          SCENE STYLE TRANSFER
        </h2>
      </header>
      <hr className="bg-gray-700 h-[0.4px] w-11/12 mx-auto" />

      <div className="flex font-sans flex-row items-center h-[90%] my-auto py-4">
        <InputPanel
          imageUrl={fileUrl}
          prompt={prompt}
          isFetching={isFetching}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handlePromptChange={handlePromptChange}
          cancelChange={cancelChange}
          handleModelChange={handleModelChange}
        />
        <OutputPanel
          images={outputs}
          isFetching={isFetching}
          error={errorFetching}
          originalImg={file}
        />
      </div>
    </>
  );
}

export default StyleTransfer;

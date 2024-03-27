import { useParams } from "react-router-dom";
import { useState } from "react";
import TrainUpload from "../components/TrainUpload.js";
import TrainComplete from "../components/TrainComplete.js";
import TrainLoading from "../components/TrainLoading.js";
import TrainError from "../components/TrainError.js";
import { useIsMutating } from "@tanstack/react-query";

export default function Train() {
  const { webtoonName } = useParams();
  const isMutatingTrain = useIsMutating({
    mutationKey: ["train", webtoonName],
  });
  const [state, setState] = useState(isMutatingTrain ? 1 : 0);

  function handleState(target) {
    setState(target);
  }

    return <div className="flex flex-col w-auto h-full bg-gradient-to-tl from-[#5748B9] to-[#624F77] m-6 mx-8 rounded-3xl p-7 px-16 overflow-hidden">
        {state===0 && <TrainUpload handleState={handleState} />}
        {isMutatingTrain ? <TrainLoading /> : null}
        {state==2 && <TrainComplete />}
        {state===3 && !isMutatingTrain && <TrainError handleState={handleState}/>} 
    </div>
  );
}

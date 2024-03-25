import {useParams} from 'react-router-dom';
import styleTransferImg from '../assets/style-transfer.png';
import poseTransferImg from '../assets/pose-transfer.png';
import CreateNewPanel from '../components/CreateNewPanel.js';
import { useQueryClient } from '@tanstack/react-query';


export default function CreateNew(){
    const {webtoonName} = useParams();

    const queryClient = useQueryClient();
    const trainedData = queryClient.getQueryData(['train',webtoonName]);
    console.log(trainedData);

    return <div className="flex flex-row h-full w-full m-auto overflow-auto">
        {trainedData && <CreateNewPanel link={`/${webtoonName}/createNew/styleTransfer`} 
                            type="SCENE&STYLE TRANSFER"
                            detail="학습된 웹툰의 그림체로 실사 배경 이미지를 웹툰 배경으로 변환합니다."
                            img={styleTransferImg}
                            disable={!trainedData.isTrained}/>}
        
        <CreateNewPanel link={`/${webtoonName}/createNew/poseTransfer`} 
            type="CHARACTER&POSE TRANSFER"
            detail="특정 캐릭터를 원하는 포즈로 재생산합니다."
            img={poseTransferImg}
            disable={false}/>

    </div>
}
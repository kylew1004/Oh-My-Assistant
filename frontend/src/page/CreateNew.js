import {useParams} from 'react-router-dom';
import styleTransferImg from '../assets/style-transfer.png';
import poseTransferImg from '../assets/pose-transfer.png';
import CreateNewPanel from '../components/CreateNewPanel.js';


export default function CreateNew(){
    const {webtoonName} = useParams();

    return <div className="flex flex-row h-full w-full overflow-auto">
        {/* <NavLink to="/styleTransfer" className="flex flex-col h-11/12 w-11/12 m-20 bg-yellow-500 rounded-3xl">
            <h1 className="font-bold text-5xl mx-auto mt-16">SCENE<br/>STYLE TRANSFER</h1>
            <p className="text-xl mx-20 my-7  text-gray-600"> 학습된 웹툰의 그림체로 실사 배경 이미지를 웹툰 배경으로 변환합니다. </p>
            <img src={styleTransferImg} className="h-auto w-full" />
            <img src={arrowImg} className="h-auto w-1/5 ml-auto mr-8 mt-7" />
        </NavLink> */}

        <CreateNewPanel link={`/${webtoonName}/createNew/styleTransfer`} 
            type="SCENE&STYLE TRANSFER"
            detail="학습된 웹툰의 그림체로 실사 배경 이미지를 웹툰 배경으로 변환합니다."
            img={styleTransferImg}/>
        
        <CreateNewPanel link={`/${webtoonName}/createNew/poseTransfer`} 
            type="CHARACTER&POSE TRANSFER"
            detail="특정 캐릭터를 원하는 포즈로 재생산합니다."
            img={poseTransferImg}/>

    </div>
}
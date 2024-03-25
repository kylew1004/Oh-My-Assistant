import {useState} from 'react';
import slide1Img from '../assets/slide1.png';
import slide2Img from '../assets/slide2.png';
import slide3Img from '../assets/slide3.png';
import mainLogoImg from '../assets/main-logo.png';

export default function WelcomeSlide(){
    const [slide, setSlide] = useState(1);
    const [towards, setTowards] = useState(3);

    if(slide==towards) setTowards(prev=>{
        return prev==3 ? 1 : 3;
    })

    function handleClick(){
        if(towards==1) setSlide(prev=>{
            return prev-1;
        })
        else setSlide(prev=>{
            return prev+1;
        })
    }


    return <div className="px-10 py-5 h-[680px] w-[470px] flex flex-col shadow-xl justify-center items-center rounded-l-3xl bg-gray-50/20 gap-5">
    <div className="flex flex-col h-[700px] w-[440px] w3-content w3-display-container bg-gradient-to-tl from-[#5748B9] to-[#624F77] rounded-3xl">
        <div className="flex flex-row my-auto w-full h-full justify-center items-center">
            <div className={`w3-left mr-auto ml-5 ${towards==3 ? 'text-white/0 cursor-default hover:cursor-default' : 'text-white cursor-pointer hover:cursor-pointer' }`} onClick={towards==1 ? handleClick : ()=>{}}>&#10094;</div>
            <div className="flex flex-col h-full w-full mx-auto text-gray-50">
                <div className="h-12 flex flex-row mr-auto mt-8">
                    <img src={mainLogoImg} className="h-full w-auto mt-1" />
                </div>
                {slide==1 && <>
                    <div className="h-[60%] flex flex-col mr-3 mt-12">
                        <img src={slide1Img} className="h-[70%] w-[72%] mx-auto" />
                    </div>
                    <div className="mx-auto mb-10">
                        <p className="mx-auto text-center">환영합니다!</p>
                        <p className="mx-auto text-center">Assistant AI는 웹툰작가 개개인의 그림체를 학습하는 <span className="text-yellow-500">맞춤형 생성 AI 서비스</span>입니다.</p>
                    </div>
                    </>}
                {slide==2 && <>
                    <div className="h-[65%] w-full flex flex-col mt-6 mb-0">
                        <img src={slide2Img} className="m-auto h-[90%] w-[80%]"/>
                    </div>
                    <div className="mx-auto mt-3">
                        <p className="mx-auto text-center"><span className="text-yellow-500">인물의 포즈 변경</span> 및 <span className="text-yellow-500">배경 이미지 생성</span>, 후처리 등</p>
                        <p className="mx-auto text-center">반복적이고 번거로운 작업들을 짧은 시간에 해결해줍니다.</p>
                    </div>
                    </>}
                {slide==3 && <>
                    <div className="h-[70%] flex flex-col">
                        <img src={slide3Img} className="h-[60%] w-[75%] m-auto" />
                    </div>
                    <div className="mx-auto">
                        <p className="mx-auto text-center"><span className="text-yellow-500">이미지 생성</span>부터, <span className="text-yellow-500">생성된 이미지 관리</span>까지</p>
                        <p className="mx-auto text-center">지금 바로 시작해보세요!</p>
                    </div>
                    </>}

            </div>
            <div className={`w3-right ml-auto mr-5 ${towards==1 ? 'text-white/0 cursor-default hover:cursor-default' : 'text-white cursor-pointer hover:cursor-pointer'}`} onClick={towards==3 ? handleClick : ()=>{}}>&#10095;</div>

        </div>
        
        
        <div className="flex flex-row h-4 mx-auto mb-4 gap-1">
            <span className={`border-2 border-white rounded-full h-2 w-2 ${slide==1 &&'bg-white'}`} />
            <span className={`border-2 border-white rounded-full h-2 w-2 ${slide==2 &&'bg-white'}`} />
            <span className={`border-2 border-white rounded-full h-2 w-2 ${slide==3 &&'bg-white'}`} />
        </div>


        </div>
  </div>
}
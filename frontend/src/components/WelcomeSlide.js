import {useState} from 'react';

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
        <div className="flex flex-row my-auto">
            <div className={`w3-left mr-auto ml-5 ${towards==3 ? 'text-white/0 cursor-default hover:cursor-default' : 'text-white cursor-pointer hover:cursor-pointer' }`} onClick={towards==1 ? handleClick : ()=>{}}>&#10094;</div>
            <div className="m-auto text-white">
                {slide==1 && <h1>111</h1>}
                {slide==2 && <h1>222</h1>}
                {slide==3 && <h3>333</h3>}
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
import {useRef, useEffect} from 'react';

export default function HelpModal({open, handleCloseModal}){
    const mod=useRef();

    useEffect(()=>{
        if(open) mod.current.showModal();
        else mod.current.close();

    },[open]);
    
    
    return <div onClick={handleCloseModal}>
        <dialog className="rounded-lg max-w-[50%]" ref={mod} >
            <div className="flex flex-col p-6 gap-4 bg-gray-100" onClick={e => e.stopPropagation()}>
                <div className="flex flex-row">
                    <div className="my-auto border-2 border-yellow-600 rounded-full px-1.5 text-yellow-600 text-sm mr-2">?</div>
                    <h2 className="text-md text-yellow-600 my-auto">Help</h2>
                    <button className="ml-auto rounded-full px-1.5  text-gray-600 h-1/2 text-sm" onClick={handleCloseModal}>X</button>
            </div>
            <h3>Style Transfer은 Input에 여러 옵션이 존재합니다.</h3>
            <ul className="list-disc marker:text-yellow-600 flex flex-col gap-4 rounded-xl border-2 border-yellow-600 p-3 pl-8">
                <div className="flex flex-col">
                    <li className="font-bold">Input Image만 넣을 경우</li> 
                    <p>Input Image로 입력된 원본 이미지를 웹툰 스타일로 재생성합니다.</p>
                </div>
                <div className="flex flex-col">
                    <li className="font-bold">Text Prompt만 넣을 경우</li> 
                    <p>Text description을 기반으로 웹툰 스타일의 배경을 새로 생성합니다.<br />이 경우 Prompt를 자세히 쓸 수록 효과가 더 좋습니다.</p>
                </div>
                <div className="flex flex-col">
                    <li className="font-bold">Input Image와 Prompt를 함께 넣을 경우</li> 
                    <p>입력된 원본 이미지를 웹툰 스타일로 변환하는 과정에 강조하거나 보조하려는 부분에 대한 설명을 추가하여 더 완성도 높은 이미지를 생성할 수 있습니다.</p>
                </div>
            </ul>
        </div>
        </dialog>

            

    </div> 
}
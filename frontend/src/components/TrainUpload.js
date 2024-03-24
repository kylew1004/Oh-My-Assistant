import {useParams} from 'react-router-dom';
import {useState} from 'react';
import {postModelTrain} from '../util/http.js';
import BackButton from './BackButton.js';
import { validateExt } from '../util/util.js';

import {useMutation} from '@tanstack/react-query';
import {waitFunc} from '../util/http.js';

export default function TrainUpload({handleState}){
    const [files,setFiles] = useState([]);
    const {webtoonName} = useParams();
    const mutation = useMutation({
        mutationKey: ['train',webtoonName],
        mutationFn: (file)=>{
            return waitFunc(file);
        },
        onSuccess:()=>{
            handleState(2);
            console.log('done');
        }
    });

    function handleChange(e){
        for(let i = 0; i < e.target.files.length; i++){
            const imgFile = e.target.files[i];
    
            if(validateExt(imgFile)){
                setFiles((prev)=>{
                    const updated=[...prev];
                    updated.push(imgFile);
                    return updated;
                });
            }else alert('The file must have jpg, jpeg or png extension!')    
        } 
    
    }

    function handleImageClick(index){
        setFiles((prev)=>{
            const updated=[...prev];
            updated.splice(index,1);
            return updated;
        });

    }

    async function handleSubmit(){
        if(files.length===0) alert("Please upload at least one image!");
        else{
            const data = new FormData();
            files.forEach((file)=>{
                data.append('images', file);
            });
            
            handleState(1);
            mutation.mutate(data);
            // const result = await postModelTrain(webtoonName, data);
            // if(result==='tokenError') redirect('/auth');
            // if(result.status == 500) handleState(3);
            // else handleState(2);

        }
        

    }


    return <>
        <div className="flex flex-row h-[7%] mb-3">
            <BackButton />
            <h1 className=" text-white font-bold text-2xl text-center mx-auto mb-6 pr-28">Add your illustrations</h1>
        </div>
        <p className="text-gray-400 text-md mx-auto">해당 웹툰의 그림체, 채색 스타일이 잘 드러나는 웹툰 이미지를 업로드해주세요. 업로드 된 사진들은 모델 학습에 사용됩니다. <br /> ** 허용 파일 확장자: jpg, jpeg, png  &nbsp;/&nbsp; 이미지 수: 1 - 10장 사이로 업로드</p>
        
        <div className="flex flex-col h-full overflow-auto no-scrollbar">
            <label className={`mx-auto my-4 rounded-full px-10 ${files.length>9 ? "text-gray-700 bg-gray-500" : "text-[#342C5A] bg-gradient-to-r from-[#F6C443] to-[#F3AC58] font-bold cursor-pointer"}`}>
                <input className="hidden" type="file" id="input" name="input" multiple onChange={handleChange} disabled={files.length>9}/>
                <p className="mx-1 my-2">Upload Image</p>
            </label>

            <div className="flex flex-row mt-3 mb-3">
                <h2 className="text-white font-bold text-2xl text-center ml-12 w-[90%]">Preview</h2>
                <p className="my-auto ml-auto text-gray-300 mr-4">{files.length}/10</p>
            </div>
            

            <ul className="flex flex-row flex-wrap justify-start px-5 py-3 h-full w-full mx-auto no-scrollbar bg-white bg-opacity-50 overflow-scroll rounded-3xl">
                    {
                        files.map((item,index)=>{
                            return <li className="flex w-[20%] aspect-square m-4 relative " key={index}> 
                                <img className="aspect-square" src={URL.createObjectURL(item)}/> 
                                <button className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 border-2 border-gray-500 text-gray-500 bg-white bg-opacity-50 rounded-full px-2 text-lg font-bold"
                                onClick={()=>handleImageClick(index)}>x</button> 
                            </li>
                        })
                    }

            </ul>

            <button onClick={handleSubmit} className="mx-auto my-auto mb-auto rounded-full text-[#342C5A] text-xl h-[10%] py-3 px-12 mt-8
        bg-gradient-to-r from-[#F19E39] to-[#E34F6B] font-bold cursor-pointer disabled:bg-gray-600">Start Model Training</button>
        </div>
    </>
}
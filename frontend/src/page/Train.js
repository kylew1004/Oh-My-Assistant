import {Form} from 'react-router-dom';
import {useState} from 'react';

export default function Train(){
    const [files,setFiles] = useState([]);
    // const urls = files.map((item)=>{
    //     return URL.createObjectURL(item);
    // })


    function handleChange(e){
        setFiles((prev)=>{
            const updated=[...prev];
            updated.push(e.target.files[0]);
            return updated;
        });
    }

    function handleImageClick(index){
        setFiles((prev)=>{
            const updated=[...prev];
            updated.splice(index,1);
            return updated;
        });

    }

    return <div className="flex flex-col w-auto h-5/6 bg-gradient-to-tl from-[#5748B9] to-[#624F77] m-12 rounded-3xl p-14 px-20 overflow-auto">
        <h1 className=" text-white font-bold text-4xl mx-auto mb-8">Add your illustrations</h1>
        <p className="text-gray-400 text-xl mx-auto">해당 웹툰의 그림체, 채색 스타일이 잘 드러나는 웹툰 이미지를 업로드해주세요. 업로드 된 사진들은 모델 학습에 사용됩니다.  (5장 이하로 업로드)</p>
        
        <Form className="flex flex-col h-full">
        <label className={`mx-auto my-10 rounded-full px-10 py-2 ${files.length>4 ? "text-gray-700 bg-gray-500" : "text-[#342C5A] bg-gradient-to-r from-[#F6C443] to-[#F3AC58] font-bold cursor-pointer"}`}>
            <input className="hidden" type="file" multiple onChange={handleChange} disabled={files.length>4}/>
            <p className="mx-1 my-3">Upload Image</p>
        </label>

        <h2 className=" text-white font-bold text-4xl mx-auto mb-8">Preview</h2>

        <ul className="flex flex-row px-20 flex-wrap py-5 h-[380px] md:grid-cols-3 train-preview bg-white bg-opacity-50 overflow-scroll rounded-3xl">
                {
                    files.map((item,index)=>{
                        return <li className="h-[210px] w-[210px] m-4 relative inline-block" key={index}> 
                            <img className="h-[210px] w-[210px]" src={URL.createObjectURL(item)}/> 
                            <button className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 border-2 border-gray-500 text-gray-500 bg-white bg-opacity-50 rounded-full px-2 text-lg font-bold"
                            onClick={()=>handleImageClick(index)}>x</button> 
                        </li>
                    })
                }

        </ul>

        <button className="mx-auto my-auto mb-auto rounded-full text-[#342C5A] text-xl h-auto py-6 px-12 mt-8
    bg-gradient-to-r from-[#F19E39] to-[#E34F6B] font-bold cursor-pointer">Start Model Training</button>
        </Form>
        

        
    </div>
}
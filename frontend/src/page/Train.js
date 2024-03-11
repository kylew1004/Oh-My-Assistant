import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {postModelTrain} from '../util/http.js';

export default function Train(){
    const [files,setFiles] = useState([]);
    const navigate = useNavigate();
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

    async function handleSubmit(){
        const data = new FormData();
        data.append('webtoonName','웹툰명');
        // data.append('images', files);
        files.forEach((file)=>{
            data.append('images', file);
        });
        
        const result = await postModelTrain(data);

        // console.log(result);
        // return null


        navigate('/assets');

    }

    return <div className="flex flex-col w-auto h-full bg-gradient-to-tl from-[#5748B9] to-[#624F77] m-6 mx-8 rounded-3xl p-7 px-16 overflow-auto">
        <h1 className=" text-white font-bold text-2xl mx-auto mb-6">Add your illustrations</h1>
        <p className="text-gray-400 text-md mx-auto">해당 웹툰의 그림체, 채색 스타일이 잘 드러나는 웹툰 이미지를 업로드해주세요. 업로드 된 사진들은 모델 학습에 사용됩니다. <br /> (5장 이하로 업로드)</p>
        
        <div className="flex flex-col h-full">
        <label className={`mx-auto my-4 rounded-full px-10 ${files.length>4 ? "text-gray-700 bg-gray-500" : "text-[#342C5A] bg-gradient-to-r from-[#F6C443] to-[#F3AC58] font-bold cursor-pointer"}`}>
            <input className="hidden" type="file" id="input" name="input" multiple onChange={handleChange} disabled={files.length>4}/>
            <p className="mx-1 my-2">Upload Image</p>
        </label>

        <h2 className=" text-white font-bold text-2xl mx-auto mt-3 mb-3">Preview</h2>

        <ul className="flex flex-row px-5 flex-wrap py-3 h-[250px] md:grid-cols-3 no-scrollbar bg-white bg-opacity-50 overflow-scroll rounded-3xl">
                {
                    files.map((item,index)=>{
                        return <li className="h-[170px] w-[170px] m-4 relative inline-block" key={index}> 
                            <img className="h-[170px] w-[170px]" src={URL.createObjectURL(item)}/> 
                            <button className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 border-2 border-gray-500 text-gray-500 bg-white bg-opacity-50 rounded-full px-2 text-lg font-bold"
                            onClick={()=>handleImageClick(index)}>x</button> 
                            <input type="file" id="images" name="images" filename="hey" hidden/>
                        </li>
                    })
                }

        </ul>

        <button onClick={handleSubmit} disabled={files.length==0} className="mx-auto my-auto mb-auto rounded-full text-[#342C5A] text-xl h-auto py-3 px-12 mt-8
    bg-gradient-to-r from-[#F19E39] to-[#E34F6B] font-bold cursor-pointer disabled:bg-gray-600">Start Model Training</button>
        </div>
        

        
    </div>
}

  
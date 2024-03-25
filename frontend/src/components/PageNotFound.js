import errorImg from '../assets/404-error.png';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound(){
    const navigate = useNavigate();

    return <div className="flex h-screen w-full">
            <div className="flex flex-col h-[90%] w-full rounded-xl bg-white/20 justify-center items-center m-auto mx-5">
                <img className="h-[40%] mb-5" src={errorImg} />
                <h2 className="text-[#645e9a] text-4xl">PAGE NOT FOUND</h2>
                <p className="text-[#552f56] text-xl">해당 페이지가 존재하지 않습니다.</p>
                <button onClick={() => navigate(-1)} className="rounded-full px-8 py-4 mt-14 font-bold bg-gradient-to-r from-[#a7a1f9] to-[#dc93dd]">이전 페이지로 이동</button>
            </div>
        </div>
}
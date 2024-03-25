import { NavLink, useParams, defer, useLoaderData, redirect, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getIsTrained } from '../util/http';
import { getAuthToken } from '../util/auth';

import { useIsMutating, useMutation, useQueryClient, useQuery} from '@tanstack/react-query';

const activeStyle = "flex flex-col mx-4 text-gray-600 text-md h-full"
const inactiveStyle = "flex flex-col pl-3 text-black font-bold text-md"

export default function Panel(){
    const {webtoonName} = useParams();
    const mutationKey = ['train',webtoonName];
    const isMutatingTrain = useIsMutating({mutationKey: mutationKey});
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const webtoons = queryClient.getQueryData(['webtoons']);

    const mutation = useMutation({
        mutationKey: ['train',webtoonName],
        mutationFn: (file)=>{
            return null;
        },
    });

    const {
        isLoading: isLoadingTrain,
        isError: isErrorTrain,
        data: trainData,
        isSuccess: isSuccessTrain,
      } = useQuery({queryKey: ['train',webtoonName], queryFn: ()=>getIsTrained({webtoonName:webtoonName}), options: {
        refetchOnWindowFocus:true,
        refetchOnMount: true,
        staleTime: Infinity,
        cacheTime: Infinity,
      }});
    

    useEffect(()=>{
        if (webtoons && webtoons.webtoonList && !webtoons.webtoonList.includes(webtoonName)) navigate(`/`);
        else{
            let currPath = location.pathname
            if(currPath.endsWith('/')) currPath=currPath.slice(0,-1);
            if (currPath.split('/').length<3) navigate(currPath+'/assets');
            return;
        }
    },[webtoons]);
    

    return <div className="flex flex-row bg-gray-100 h-[11%] min-h-[11%] w-full">
    <div className="flex flex-col pl-3 h-full">
        <h1 className="text-gray-800 text-2xl my-auto ml-5 font-bold mb-0" >{webtoonName}</h1>
        <div className="flex flex-row mt-auto">
            <NavLink to={`/${webtoonName}/assets`} className={({ isActive }) => isActive ? inactiveStyle : activeStyle }>
                {({ isActive }) => (
                    isActive ? <div><p>Assets</p><hr className="bg-yellow-500 h-1.5 bottom-0 mt-1 justify-end" /></div> 
                    : <p>Assets</p>
                )}
            </NavLink>
            <NavLink to={`/${webtoonName}/createNew`} className={({ isActive }) => isActive ? inactiveStyle : activeStyle }>
                {({ isActive }) => (
                    isActive ? <div><p>Create new</p><hr className="bg-yellow-500 h-1.5 bottom-0 mt-1 justify-end" /></div> 
                    : <p>Create new</p>
                )}
            </NavLink>
        </div>
    </div>

    {trainData && <NavLink to={`/${webtoonName}/train`} className={`ml-auto my-auto mr-12 h-[45px] px-8 rounded-full bg-gradient-to-b ${trainData.isTrained ? 'from-[#2f2750] to-[#4a3ba0] text-yellow-500 ' 
                    : ' from-[#E9522E] via-pink-600 to-[#D58ABD] text-white'} font-bold`}>
        <p className="text-center mt-3">
         {isMutatingTrain ? "Training..." : 
         (trainData.isTrained ? "Re-initialize Style Reference" : "Initialize Style Reference")}
        </p>
    </NavLink>}
</div>
}
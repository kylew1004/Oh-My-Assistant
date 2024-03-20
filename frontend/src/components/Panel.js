import { NavLink, useParams, defer, useLoaderData, Await, redirect } from 'react-router-dom';
import {Suspense } from 'react';
import { getIsTrained } from '../util/http';
import { getAuthToken } from '../util/auth';

const activeStyle = "flex flex-col mx-4 text-gray-600 text-md h-full"
const inactiveStyle = "flex flex-col pl-3 text-black font-bold text-md"

export default function Panel(){
    const {webtoonName} = useParams();
    const {isTrained} = useLoaderData();

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

    <Suspense fallback={<p></p>}>
               <Await resolve={isTrained}>
                    {(loadedIsTrained) =>  loadedIsTrained && <NavLink to={`/${webtoonName}/train`} className={`ml-auto my-auto mr-12 h-[45px] px-8 rounded-full bg-gradient-to-b ${loadedIsTrained.isTrained ? 'from-[#2f2750] to-[#4a3ba0] text-yellow-500 ' 
                    : ' from-[#E9522E] via-pink-600 to-[#D58ABD] text-white'} font-bold`}>
        <p className="text-center mt-3">
         {loadedIsTrained.isTrained ? "Re-initialize " : "Initialize "}Style Reference
        </p>
    </NavLink>}
                </Await>
    </Suspense>
</div>
}

export async function loader({params}){
    const token = getAuthToken();
    if(!token || token=='EXPIRED') return redirect('/auth');

    const data={
        webtoonName: params.webtoonName,
    }

    return defer({
        isTrained: getIsTrained(data),
      });
}
import {useState, Suspense, useEffect} from 'react';
import {Form, useLoaderData, useActionData, Await, Link, redirect, useParams} from 'react-router-dom';
import menuLogo from '../assets/menu-logo.png';
import profileImg from '../assets/profile.png';
import AddWebtoonModal from './AddWebtoonModal';
import DeleteMenu from './DeleteMenu.js';
import generalLoading from '../assets/generalLoading.gif';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../util/http.js';

export default function Menu(){
    const [isModal, setIsModal] = useState(false);
    const {webtoons} = useLoaderData();
    const {webtoonName} = useParams();

    const {
        isLoading: isLoadingUser,
        isError: isErrorUser,
        data: userData,
        isSuccess: isSuccessUser,
      } = useQuery({queryKey: ['user'], queryFn: getUser, options: {
        refetchOnWindowFocus:true,
        refetchOnMount: true,
        staleTime: Infinity,
        cacheTime: Infinity,
      }});

    function handleClick(){
        setIsModal(true);
    }

    function handleClose(){
        setIsModal(false);
    }

    return<div className="flex flex-col bg-gradient-to-bl from-[#0f0417] to-[#24263d] h-screen w-[220px] float-left overflow-hidden">
        
        <AddWebtoonModal open={isModal} handleClose={handleClose} />
        <div className="flex flex-row m-1 pl-4 pt-2">
            <img src={menuLogo} className=" w-9 h-9 p-1 mt-[1px] mr-2"/>
            <h3 className="text-gray-200 mt-2 text-md" >MENU</h3>
        </div>

        <div className="flex flex-row mt-3  pl-4 bg-gray-950 py-4">
            <img src={profileImg} className="w-9 h-9 mt-1"/>
            <div className="flex flex-col pl-3">
            {isLoadingUser && <img className="h-[8%] w-auto m-auto" src={generalLoading}/>}
            {userData && <>
                <h3 className="text-white text-md pb-1" >{userData.userNickname}</h3>
                <p className=" text-gray-600 text-sm"> {userData.userEmail}</p>
            </>}
            </div>
        </div>

        {/* <div className="flex flex-row m-2 ml-0 pl-4 ">
            <div className="flex flex-col pl-3">
                <h3 className="text-white text-md pb-1" >4</h3>
                <p className=" text-gray-600 text-sm"> WEBTOONS TOTAL</p>
            </div>
        </div> */}


        <div className="flex flex-col py-4 h-2/3">
            <p className=" text-gray-600 pl-3 text-md my-3"> WEBTOONS </p>
            <div className="flex flex-col h-auto max-h-1/2 overflow-y-auto overflow-x-hidden no-scrollbar">
                <Suspense fallback={<img className="h-[8%] w-auto m-auto" src={generalLoading}/>}>
                        <Await resolve={webtoons}>
                            {(loadedWebtoons) => {
                                if(loadedWebtoons.webtoonList) return loadedWebtoons.webtoonList.map((webtoon, index)=> <div className={`flex flex-row h-11 p-1 ${webtoonName===webtoon ? 'text-yellow-500 bg-gray-950' : 'text-white'} hover:bg-gray-950`}>
                                <div className={`bg-yellow-500${webtoonName!==webtoon ? '/0' : ''} mr-4 h-full w-1`} />
                                <Link key={index} to={`/${webtoon}/assets`} className={`pb-1 w-full flex ${webtoonName===webtoon ? 'text-yellow-500 bg-gray-950' : 'text-white'}`} ><p className="text-left my-auto  text-md">{webtoon}</p></Link>
                                <div className="flex h-full ml-auto w-5 justify-center"><DeleteMenu subject={{webtoonName: webtoon}}/></div>
                            </div>)}}
                        </Await>
                </Suspense> 
            </div>

            <button className="text-yellow-500 text-md pb-1 bg-transparent text-left mt-3 mx-auto" onClick={handleClick}>+ Add New Webtoon</button>
        </div>

        <Form action="/logout" method="post" className="flex flex-col h-full">
        <button className="mt-auto text-gray-900 text-lg mb-4 bg-gray-300 rounded-full h-[47px] w-10/12 mx-auto">Log out</button>
        </Form>


    </div>

}
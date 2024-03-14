import {useState, Suspense} from 'react';
import {Form, useLoaderData, Await, Link, redirect, useNavigate} from 'react-router-dom';
import menuLogo from '../assets/menu-logo.png';
import profileImg from '../assets/profile.png';
import AddWebtoonModal from './AddWebtoonModal';
import {deleteWebtoon} from '../util/http.js';

export default function Menu(){
    const [isModal, setIsModal] = useState(false);
    const {userInfo, webtoons} = useLoaderData();
    const navigate = useNavigate()
    console.log(userInfo);

    function handleClick(){
        setIsModal(true);
    }

    function handleClose(){
        setIsModal(false);
    }

    async function handleDelete(webtoon){
        const result = await deleteWebtoon({
            webtoonName: webtoon,
        });

        if(result==='tokenError') return redirect('/auth');
        navigate('.', { replace: true });
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
            <Suspense fallback={<h3 className="text-gray-100 text-md pb-1 my-auto" >loading...</h3>}>
                    <Await resolve={userInfo}>
                        {(loadedInfo) => <>
                            <h3 className="text-white text-md pb-1" >{loadedInfo.userNickname}</h3>
                            <p className=" text-gray-600 text-sm"> {loadedInfo.userEmail}</p>
                        </>}
                    </Await>
            </Suspense>
            </div>
        </div>

        {/* <div className="flex flex-row m-2 ml-0 pl-4 ">
            <div className="flex flex-col pl-3">
                <h3 className="text-white text-md pb-1" >4</h3>
                <p className=" text-gray-600 text-sm"> WEBTOONS </p>
            </div>
            <div className="flex flex-col pl-3">
                <h3 className="text-white text-lg pb-1" >34</h3>
                <p className=" text-gray-600 text-md"> ASSETS </p>
            </div>
        </div> */}


        <div className="flex flex-col pl-4 py-4 h-2/3">
            <p className=" text-gray-600 text-md my-3"> WEBTOONS </p>
            <div className="flex flex-col h-1/2 overflow-auto">
                <Suspense fallback={<h3 className="text-gray-100 text-md pb-1 m-auto ml-4" >loading...</h3>}>
                        <Await resolve={webtoons}>
                            {(loadedWebtoons) => {
                                if(loadedWebtoons.webtoonList) return loadedWebtoons.webtoonList.map((webtoon, index)=> <div className="flex flex-row pl-3 p-1 hover:bg-gray-950">
                                <Link key={index} to={`/${webtoon}/assets`} className="text-white text-md pb-1 w-full text-left " >{webtoon}</Link>
                                <button onClick={()=>handleDelete(webtoon)} className="bg-white text-red-700 w-3 px-2 rounded-full m-auto pr-4">x</button>
                            </div>)}}
                        </Await>
                </Suspense> 
            </div>

            <button className="text-yellow-500 text-md pb-1 bg-transparent text-left mt-3" onClick={handleClick}>+ Add New Webtoon</button>
        </div>

        <Form action="/logout" method="post" className="flex flex-col h-full">
        <button className="mt-auto text-gray-900 text-lg mb-4 bg-gray-300 rounded-full h-[47px] w-10/12 mx-auto">Log out</button>
        </Form>


    </div>

}
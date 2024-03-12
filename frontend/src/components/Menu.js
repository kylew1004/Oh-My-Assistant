import {useState, Suspense} from 'react';
import {Form, useLoaderData, Await, Link} from 'react-router-dom';
import menuLogo from '../assets/menu-logo.png';
import profileImg from '../assets/profile.png';
import AddWebtoonModal from './AddWebtoonModal';

export default function Menu(){
    const [isModal, setIsModal] = useState(false);
    const {userInfo, webtoons} = useLoaderData();

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


        <div className="flex flex-col pl-4 py-4">
            <p className=" text-gray-600 text-md my-3"> WEBTOONS </p>
            <Suspense fallback={<h3 className="text-gray-100 text-md pb-1 m-auto ml-4" >loading...</h3>}>
                    <Await resolve={webtoons}>
                        {(loadedWebtoons) => {
                            if(loadedWebtoons) return loadedWebtoons.webtoonList.map(webtoon=> <div className="flex flex-col pl-3 p-1">
                            <Link to={`/${webtoon}/assets`} className="text-white text-md pb-1  w-full text-left hover:bg-gray-950" >{webtoon}</Link>
                        </div>)}}
                    </Await>
            </Suspense>

            <button className="text-yellow-500 text-md pb-1 bg-transparent text-left mt-3" onClick={handleClick}>+ Add New Webtoon</button>
        </div>

        <Form action="/logout" method="post" className="flex flex-col h-full">
        <button className="mt-auto text-gray-900 text-lg mb-10 bg-gray-300 rounded-full h-[47px] w-10/12 mx-auto bottom-8">Log out</button>
        </Form>


    </div>

}
import {useState} from 'react';
import {Form} from 'react-router-dom';
import menuLogo from '../assets/menu-logo.png';
import profileImg from '../assets/profile.png';

export default function Menu(){

    return<div className="flex flex-col bg-gray-900 h-screen w-1/6 float-left overflow-hidden">
        <div className="flex flex-row m-2 ml-0 pl-4 pt-5">
            <img src={menuLogo} className=" w-10 h-auto p-2"/>
            <h3 className="text-gray-200 p-2 text-xl" >MENU</h3>
        </div>

        <div className="flex flex-row m-2 ml-0 pl-4 bg-gray-950 py-4">
            <img src={profileImg} className=" w-14 h-14 p-2"/>
            <div className="flex flex-col pl-3">
                <h3 className="text-white text-lg pb-1" >김작가</h3>
                <p className=" text-gray-600 text-md"> jakga@gmail.com </p>
            </div>
        </div>

        <div className="flex flex-row m-2 ml-0 pl-4 ">
            <div className="flex flex-col pl-3">
                <h3 className="text-white text-lg pb-1" >4</h3>
                <p className=" text-gray-600 text-md"> WEBTOONS </p>
            </div>
            <div className="flex flex-col pl-3">
                <h3 className="text-white text-lg pb-1" >34</h3>
                <p className=" text-gray-600 text-md"> ASSETS </p>
            </div>
        </div>


        <div className="flex flex-col m-2 ml-0 pl-4 py-4">
            <p className=" text-gray-600 text-md my-3"> WEBTOONS </p>
            <div className="flex flex-col pl-3 py-1">
                <button className="text-white text-lg pb-1  w-full text-left hover:bg-gray-950" >웹툰 1</button>
            </div>
            <div className="flex flex-col pl-3 py-1">
                <button className="text-white text-lg pb-1  w-full text-left hover:bg-gray-950" >웹툰 2</button>
            </div>
            <div className="flex flex-col pl-3 py-1">
            <button className="text-white text-lg pb-1  w-full text-left hover:bg-gray-950" >웹툰 3</button>
            </div>

            <button className="text-yellow-500 text-lg pb-1 bg-transparent text-left pl-2 mt-3">+ Add New Webtoon</button>
        </div>

        <Form action="/logout" method="post" className="flex flex-col h-full">
        <button className="mt-auto text-gray-900 text-lg mb-10 bg-gray-300 rounded-full h-[47px] w-10/12 mx-auto bottom-8">Log out</button>
        </Form>


    </div>

}
import { Outlet } from 'react-router-dom';
import {useState} from 'react';
import Panel from '../components/Panel';
import Notification from '../components/Notification.js';

export default function WebtoonPage(){
    const {noti, setNoti} = useState(true);


    return <>
    <Panel />
    <div className="relative flex flex-col  w-full h-[89%]">
    <Notification />
    <Outlet />

    </div>
    


    
    {/* <div className="flex h-full w-full">
        <Notification />
        {/* {noti && <Notification /> } 
        <Outlet />
    </div> */}
    
  </>
}
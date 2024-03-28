import { Outlet } from 'react-router-dom';
import {useState, useContext} from 'react';
import Panel from '../components/Panel';
import Notification from '../components/Notification.js';
import NotiContext from '../store/noti_context.js';

export default function WebtoonPage(){
    const {noti} = useContext(NotiContext);


    return <>
    <Panel />
    <div className="relative flex flex-col  w-full h-[89%]">
    <div className="absolute  z-20 top-0 right-0 m-3">
      {noti.map((item)=>{
        return <Notification item={item}/>
      })}
    </div>
    <Outlet />

    </div>
    


    
    {/* <div className="flex h-full w-full">
        <Notification />
        {/* {noti && <Notification /> } 
        <Outlet />
    </div> */}
    </>
  );
}

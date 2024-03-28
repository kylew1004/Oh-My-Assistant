import { Outlet } from "react-router-dom";
import { useState } from "react";
import Panel from "../components/Panel";
import Notification from "../components/Notification.js";

export default function WebtoonPage() {
  const { noti, setNoti } = useState(true);

  return (
    <>
      <Panel />
      <Notification />
      <Outlet />

      {/* <div className="flex h-full w-full">
        <Notification />
        {/* {noti && <Notification /> } 
        <Outlet />
    </div> */}
    </>
  );
}

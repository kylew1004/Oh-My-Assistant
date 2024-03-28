import { useEffect, useState } from "react";
import { Outlet, useSubmit } from "react-router-dom";

import Menu from "./Menu.js";
import ExpiredModal from "./ExpiredModal.js";
import { getAuthToken, getTokenDuration } from "../util/auth.js";

function RootLayout() {
  const token = getAuthToken();
  const submit = useSubmit();
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    // if(!token){
    //   return null;
    // }
    if (token === "EXPIRED") {
      setIsModal(true);
      // submit(null,{action:'/logout', method:'post'})
      // return null ;
    }
    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      // submit(null,{action:'/logout', method:'post'})
      setIsModal(true);
    }, tokenDuration);
  }, [token]);

  return (
    <div className="flex flex-row w-full h-full">
      {isModal && <ExpiredModal open={isModal} />}
      <Menu />
      <div className="flex flex-col w-full h-screen overflow-hidden no-scrollbar">
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;

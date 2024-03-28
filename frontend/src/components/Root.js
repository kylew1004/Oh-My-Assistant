import { useEffect } from "react";
import { Outlet, useSubmit } from "react-router-dom";

import Menu from "./Menu.js";
import { getAuthToken, getTokenDuration } from "../util/auth.js";

function RootLayout() {
  const token = getAuthToken();
  const submit = useSubmit();

  useEffect(() => {
    // if(!token){
    //   return null;
    // }
    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
      return null;
    }
    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);

  return (
    <div className="flex flex-row w-full">
      <Menu />
      <div className="flex flex-col w-full h-screen overflow-hidden no-scrollbar">
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;

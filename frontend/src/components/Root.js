import { Outlet, useLoaderData, defer} from 'react-router-dom';
import {getUser, getWebtoons} from '../util/http.js';

import Menu from "./Menu.js";
import Panel from './Panel.js';

// import MainNavigation from '../components/MainNavigation';
// import {getTokenDuration} from '../util/auth';

function RootLayout() {
//   const token = useLoaderData();
//   const submit = useSubmit();

//   useEffect(()=>{
//     if(!token){
//       return null;
//     }
//     if(token==="EXPIRED"){
//       submit(null,{action:'/logout', method:'post'})
//       return null ;

//     }
//     const tokenDuration = getTokenDuration();
//     console.log(tokenDuration);

//     setTimeout(()=>{
//       submit(null,{action:'/logout', method:'post'})

//     },tokenDuration);

//   },[token, submit])

  return (
    <div className="flex flex-row">
      <Menu />
      <div className="flex flex-col w-full h-screen overflow-scroll no-scrollbar">
         {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Panel />
        {/* <div className=""> */}
          <Outlet />
        {/* </div> */}
      </div>
    </div>
  );
}

export default RootLayout;

export function loader(){
  return defer({
    userInfo: getUser(),
    webtoons: getWebtoons()
  })
}

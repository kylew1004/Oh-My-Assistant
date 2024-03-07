import { Outlet, useLoaderData} from 'react-router-dom';
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
    <>
      <Menu />
      <div className="flex flex-col w-5/6 h-screen">
         {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Panel />
        <Outlet />
      </div>
    </>
  );
}

export default RootLayout;

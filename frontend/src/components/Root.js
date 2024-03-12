import {useEffect} from 'react';
import { Outlet, useLoaderData, defer, redirect, useSubmit} from 'react-router-dom';
import {getUser, getWebtoons, postWebtoon} from '../util/http.js';

import Menu from "./Menu.js";
import {getAuthToken, getTokenDuration} from '../util/auth.js';

function RootLayout() {
  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(()=>{
    if(!token){
      return null;
    }
    if(token==="EXPIRED"){
      submit(null,{action:'/logout', method:'post'})
      return null ;

    }
    const tokenDuration = getTokenDuration();
    console.log(tokenDuration);

    setTimeout(()=>{
      submit(null,{action:'/logout', method:'post'})

    },tokenDuration);

  },[token, submit])

  return (
    <div className="flex flex-row">
      <Menu />
      <div className="flex flex-col w-full h-screen overflow-scroll no-scrollbar">
         {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        {/* <div className=""> */}
        <Outlet />
        {/* </div> */}
      </div>
    </div>
  );
}

export default RootLayout;

export function loader(){
  const token = getAuthToken();
  if(!token || token=='EXPIRED') return redirect('/auth');

  return defer({
    userInfo: getUser(token),
    webtoons: getWebtoons(token)
  });
}

export async function action({request}){
  const fd = await request.formData();
  const data = {
    webtoonName: fd.get('name')
  }
  const result = await postWebtoon(data);

  if(!result.error){

    return redirect(`/${result.webtoonName}/assets`);
    // window.location.reload();
    // return redirect(`/${result.webtoonName}/assets`);
  }
  return null;

}

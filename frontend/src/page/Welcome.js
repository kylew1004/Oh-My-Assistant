import {useSearchParams, Link, useActionData, useNavigation, json, redirect} from 'react-router-dom';
import SignupForm from '../components/SignupForm.js';
import LoginForm from '../components/LoginForm.js';



export default function Welcome() {
    const [searchParams, setSearchParams] = useSearchParams();
    const isLogin = searchParams.get('mode')==='login';

    const active = !isLogin ? 'left-[23px] bg-yellow-500' : 'right-[23px] bg-green-500';
    const inactive = !isLogin ? 'right' : 'left';


    return (
    <div className="welcome-bg flex justify-center items-center h-screen">
        <div className="px-10 py-5 flex flex-col shadow-xl justify-center items-center rounded-3xl bg-blue-950 gap-5">
        <h2 className="py-20 text-6xl text-yellow-500">SERVICE NAME</h2>
        <p className="form-actions h-14 relative flex justify-end w-full">
          <Link to={`?mode=${isLogin ? "signup" : "login"}`} className={`button h-14 w-1/2 absolute ${inactive}-[23px] bg-gray-300 text-gray-500 rounded-full float-left`}>
            {isLogin ? "Sign up" : "Log in "}
          </Link>
          <Link to={`?mode=${isLogin ? "login" : "signup"}`}  className={`button h-14 w-1/2 absolute ${active} text-black rounded-full float-right`}>
            {isLogin ? "Log in" : "Sign up"}
          </Link>
          
        </p>
        <hr className="border-0 h-[0.3px] w-full px-3 bg-gray-200 my-5"/>

        
        {isLogin ? <LoginForm /> : <SignupForm />}
        

            
        </div>

    </div>
      
    );
  }

  export async function action({request}) {
    const searchParams = new URL(request.url).searchParams;
    const mode = searchParams.get('mode') || 'signup';
  
    if(mode!=='login' && mode!=='signup'){
      throw json({message: 'Unsupported mode.'},{status:422})
    }
  
    const data = await request.formData();
    let authData;
    if(mode=='login'){
      authData = {
        userEmail: data.get('email'),
        userPassword:data.get('password'),
      }

    }else{
      authData = {
        userNickname: data.get('name'),
        userEmail: data.get('email'),
        userPw:data.get('password'),
      }

    }
  
    
    //!!!API call!!!
    // let response = {
    //   status: 200,
    //   ok: true,
    // }

    const response = await fetch('http://localhost:8000/'+'api/user/login',{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(authData)
    });
    ////////////////
    
  
    //handle response
    if(response.status===422 || response.status ==401){
      return response;
    }
  
    if(!response.ok){
      throw json({message: 'Could not athenticate user.'},{status:500});
    }
  
  
    //manage the token returned 
    const resData = await response.json();
    const token = resData.access_token;
  
    //쿠키를 쓰는 옵션도 있음
    localStorage.setItem('token',token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours()+1);
    localStorage.setItem('expiration', expiration.toISOString());
  
  
    return redirect('/assets');
  
  
  }
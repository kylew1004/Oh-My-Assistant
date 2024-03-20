import {useSearchParams, Link, useActionData, useNavigation, json, redirect} from 'react-router-dom';
import SignupForm from '../components/SignupForm.js';
import LoginForm from '../components/LoginForm.js';
import logoImg from '../assets/logo.png';
import WelcomeSlide from '../components/WelcomeSlide.js';
import { postLogin, postSignup } from '../util/http.js';
import {tokenLoader} from '../util/auth.js';
import ErrorMessage from '../components/ErrorMessage.js';



export default function Welcome() {
    const [searchParams, setSearchParams] = useSearchParams();
    const isLogin = searchParams.get('mode')==='login';
    const data=useActionData();
    const navigation=useNavigation();

    const isSubmitting = navigation.state==='submitting';

    const active = !isLogin ? 'left-[23px]  bg-gradient-to-r from-[#F6C443] to-[#F3AC58]' : 'right-[23px]  bg-gradient-to-l from-[#F6C443] to-[#F3AC58]';
    const inactive = !isLogin ? 'right' : 'left';


    return (
    <div className="welcome-bg flex justify-center items-center h-screen">
        <WelcomeSlide />

        <div className=" py-10 h-[680px] w-[470px] flex flex-col shadow-xl justify-center items-center rounded-r-3xl bg-gray-50/20">
          <div className="h-10 flex flex-row mx-auto my-4">
              <img src={logoImg} className="h-6 w-auto mt-1" />
              <h2 className="text-2xl text-blue-950">&nbsp;SERVICE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h2>
          </div>
          
          <div className="h-[470px] w-full flex flex-col">
            <h2 className="text-3xl text-gray-800 mx-auto mb-1 ">Welcome!</h2>
            <p className="text-2xl text-gray-700 mx-auto mb-10">Sign up to start the service.</p>
            
            <p className="form-actions h-14 relative flex justify-end w-full mb-3 ">
              <Link to={`?mode=${isLogin ? "signup" : "login"}`} className={`button flex h-14 w-1/2 absolute ${inactive}-[23px] bg-gray-300 text-gray-500 rounded-full float-left`}>
                <label className="font-bold m-auto">{isLogin ? "Sign up" : "Log in"}</label>
              </Link>
              <Link to={`?mode=${isLogin ? "login" : "signup"}`}  className={`button flex h-14 w-1/2 absolute ${active} text-black rounded-full float-right`}>
                <label className="font-bold m-auto">{isLogin ? "Log in" : "Sign up"}</label>
              </Link>
            </p>
            <hr className=" h-[0.9px] w-5/6 mx-auto px-3 bg-blue-950 my-7"/>
            {data && data.error && <div className="w-[80%] mx-auto mb-2"><ErrorMessage>{data.error}</ErrorMessage></div>}

          </div>

         

          {isLogin ? <LoginForm isSubmitting={isSubmitting}/> : <SignupForm isSubmitting={isSubmitting} />} 
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
    let result;
    if(mode=='login'){
      const authData = {
        grant_type:'',
        username: data.get('username'),
        password:data.get('password'),
        scope:'',
        client_id:'',
        client_secret:''
      }

      result = await postLogin(authData);

    }else{
      if(data.get('verified')=='false'){
        alert('Please verify email!');
        return null;
      }

      if(data.get('password')!==data.get('confirm-password')) return {error:'Password and Confirim-password do not match.'}
      
      const authData = {
        userNickname: data.get('name'),
        userEmail: data.get('email'),
        userPw:data.get('password'),
      }

      result = await postSignup(authData);
    }
  
    if(!result.error){
      //쿠키를 쓰는 옵션도 있음
      localStorage.setItem('token',result);
      const expiration = new Date();
      expiration.setHours(expiration.getHours()+1);
      localStorage.setItem('expiration', expiration.toISOString());
    
    
      return redirect('/');
      
    }

    console.log(result);

    return result;
  }


  export function loader(){
    const token=tokenLoader();
    if(token=='EXPIRED'){
      localStorage.removeItem('token');
      return null;
    }
    if(token) return redirect('/');
    return null;

  }
import {useState} from 'react'; 
import { Form } from 'react-router-dom';
import { postVerifyEmail } from '../util/http.js';
import generalLoading from '../assets/generalLoading.gif';

export default function SignupForm({isSubmitting}) {
    const [pwNotEqual, setPwNotEqual] = useState(false);
    const [verified, setVerified] = useState('false');
    const [email, setEmail] = useState('');

    async function handleVerify(){
      if(email.trim().length===0) alert('Please enter an email!');
      else{
        const result = await postVerifyEmail({userEmail:email});
        if(result.detail==="Email is available"){
          setVerified('true');
          alert('Email verified!');
        }else alert('Email already exists!');

      }
      
    }

    function handleEmailChange(e){
      setVerified('false');
      setEmail(e.target.value);
    }

    // function handleSubmit(event){
    //     event.preventDefault();

    //     const fd = new FormData(event.target);
    //     //handling checkbox(multi options)
    //     const acquisitionChannel = fd.getAll('acquisition');
    //     const data = Object.fromEntries(fd.entries());
    //     data.acquisition = acquisitionChannel;

    //     if(data.password!==data['confirm-password']){
    //         setPwNotEqual(true);
    //         return;
    //     }

    //     console.log(data);

    //     // //reset(alternative to reset type button)
    //     // event.target.reset();
    // }

    return (
        <Form method="post" className="flex flex-col w-5/6 h-full" >

        <div className="control-row w-full">
            <input className=" h-16 w-full p-4 rounded-lg bg-gray-50 text-gray-700 text-lg  focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400" type="text" id="name" name="name" placeholder="Nickname" required/>
        </div>
        
        {/* <div className="control-row w-full my-5">
          <input className="h-16 w-full rounded-lg p-4 bg-gray-50 text-gray-700 text-lg  focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400" id="email" type="email" name="email" placeholder="Email Address" required />
        </div> */}
        <div className="flex flex-row control-row h-16 w-full my-5 rounded-lg bg-gray-50 text-gray-700 text-lg ">
            <input className="h-16 w-full p-4 rounded-lg focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 bg-gray-50 m-auto placeholder-gray-400" id="email" type="email" name="email" placeholder="Email Address" required
                  onChange={handleEmailChange} />
            <button className="h-8 my-auto mx-3 bg-[#5748B9] text-gray-50 rounded-full px-3 text-sm" type="button" onClick={handleVerify}>Verify</button>
        </div>
    
        <div className="flex flex-row w-full gap-3">
   
          <input className="h-16 w-[190px] rounded-lg bg-gray-50 text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400" type="password" id="password" name="password" placeholder="Password" required/>
          <div className=" w-2/5">
              <input className=" h-16  w-[190px] rounded-lg bg-gray-50 text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400" type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" required/>
            <div className='control-error'>{pwNotEqual && <p>Passwords must match.</p>}</div>
          </div>
        </div>

        <input id="verified" name="verified" type="text" value={verified} hidden /> 

        <button type="submit" disabled={isSubmitting} className="flex m-auto h-12 my-6 mt-10 w-1/2 bg-gradient-to-r from-[#F6C443] to-[#F3AC58] rounded-full text-black">
          {isSubmitting ? <img className="h-[60%] w-auto m-auto" src={generalLoading}/> : <p className="m-auto">Sign up</p>}
          </button>

  

      </Form>
      
    );
  }
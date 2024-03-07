import {useState} from 'react'; 
import { Form } from 'react-router-dom';

export default function LoginForm(){
    const [pwNotEqual, setPwNotEqual] = useState(false);

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
        <Form method="post" className="flex flex-col w-5/6 h-auto" >

        
        <div className="control control-row w-full my-5 mb-9 flex flex-col">
          <input className="h-16 w-full rounded-lg bg-gray-50 text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400" id="email" type="email" name="email" placeholder="Email Address" required />
        </div>
    
        <div className="control p-1 flex flex-col control-row w-full my-5">
            <input className="h-16 rounded-lg bg-gray-50 text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400" type="password" id="password" name="password" placeholder="Password" required/>
        </div>



          <button type="submit" className="button m-auto h-12 my-6 w-1/2  bg-gradient-to-r from-[#F6C443] to-[#F3AC58] rounded-full text-black">
            Log in
          </button>

      </Form>
      
    );

}
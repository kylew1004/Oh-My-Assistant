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
        <Form method="post" className="w-full" >

        
        <div className="control-row w-full my-5">
        <div className="control p-1 flex flex-col">
          <label className="w-1/4 text-green-500 mb-3" htmlFor="email">Email</label>
          <input className="h-12 w-full rounded-lg bg-blue-200 text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500" id="email" type="email" name="email" required />
        </div>
        </div>
    
        <div className="control-row w-full my-5">
          <div className="control p-1 flex flex-col">
            <label className="w-1/4 text-green-500 mb-3" htmlFor="password">Pasword</label>
            <input className="h-12 rounded-lg bg-blue-200 text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500" type="password" id="password" name="password" required/>
          </div>
        </div>


  
        <p className="form-actions flex justify-end h-full w-full">
          <button type="submit" className="button h-12 my-12 w-1/2 bg-green-500 rounded-full float-right text-black">
            Log in
          </button>
        </p>
      </Form>
      
    );

}
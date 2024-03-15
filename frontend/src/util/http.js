import {getAuthToken} from '../util/auth.js';
import {redirect} from 'react-router-dom';

import qs from 'qs';
const URL = "http://localhost:8000";

async function sleep(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
  }

const convertURLtoFile = async (url) => {
    const response = await fetch(url, { mode: 'no-cors' });
    const data = await response.blob();
    const ext = url.split(".").pop(); // url 구조에 맞게 수정할 것
    const filename = url.split("/").pop(); // url 구조에 맞게 수정할 것
    const metadata = { type: `image/${ext}` };
    return new File([data], filename, metadata);
};


export async function fetchOutput() {

    const response = await fetch(`${URL}/get-image`);
    const resData = await response.json();

    // if(!response.ok) {
    //     throw new Error('Failed to load image');
    // }
   
    return resData["image_path"];

    // await new Promise(resolve => setTimeout(resolve, 3000));
    // // throw new Error('Failed to load image');
    // return 'https://global.discourse-cdn.com/business7/uploads/glideapps/original/2X/4/4936e0f28f79c8a2aa95582741091356d0ed61d8.jpeg'

}

export async function postInput(image) {
    console.log(image);
    let formData = new FormData();
    formData.append('image', image);

    const response = await fetch(`${URL}/post-image`,{
        method: 'POST',
        body: formData//{image},
        // header: {'Content-Type':'multipart/form-data'},
    });

    const resData = await response.json();

    // if(!response.ok){
    //     throw new Error('Failed to send image');
    // }

    return resData.message;

    // return 'ok';
}

//------------------------------------------------------------------------------------
export async function postLogin(authData){
    try{
        const response = await fetch(`${URL}/api/user/login`,{
            method:'POST',
            headers:{
              'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body: qs.stringify(authData) 
          });
    
        //handle response
        if(response.status===422 || response.status ==401 || response.stastus==400){
            throw {error: 'Could not athenticate user.',
                  status:response.status}
        }
      
        if(!response.ok){
            throw {error: 'Could not athenticate user.',
                   status:500}
        }
      
        //manage the token returned 
        const resData = await response.json();
        return resData.token_type+" "+resData.access_token;

    }catch(e){
        if(e.error) return e;
        else return {error: 'Could not athenticate user.',
        status:'unkown'}
    }


}

export async function postSignup(authData){

    try{
        const response = await fetch(`${URL}/api/user/create`,{
            method:'POST',
            headers:{
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify(authData)
          });
    
        //handle response
        if(response.status===422 || response.status ==401 || response.status ==400){
            throw {error: 'Could not create user.',
                  status:response.status}
        }
      
        if(!response.ok){
            throw {error: 'Could not create user.',
                   status:500}
        }
      
        //manage the token returned 
        const resData = await response.json();
        return resData.token_type+" "+resData.access_token;

    }catch(e){
        if(e.error) return e;
        else return {error: 'Could not create user.',
        status:'unknown'}
    }


}
 
export async function getUser(){
    // //dummy-------------------------
    // // await sleep(2000);
    // return {
    //     userEmail: 'juhee@gmail.com',
    //     userNickname: '주희'
    // }
    // //------------------------------
    const token = getAuthToken();
    if(!token || token=='EXPIRED') return redirect('/auth');

    try{
        const response = await fetch(`${URL}/api/user/me`,{
            method:'GET',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization' : token
            }
            });
    
        //handle response
        if(response.status===422 || response.status ==401 || response.status ==400){
            throw {error: 'Could not get user info.',
                    status:response.status}
        }
        
        if(!response.ok){
            throw {error: 'Could not get user info.',
                    status:500}
        }
        
        //manage the token returned 
        const resData = await response.json();
        return resData;

    }catch(e){
        if(e.error) return e;
        else return {error: 'Could not create user.',
        status:'unknown'}
    }

    



}

export async function postVerifyEmail(data){
    try{
        const response = await fetch(`${URL}/api/user/email-check`,{
            method:'POST',
            headers:{
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
          });
    
        //handle response
        if(response.status===422 || response.status ==401 || response.stastus==400){
            throw {error: 'Could not verify email.',
                  status:response.status}
        }
      
        if(!response.ok){
            throw {error: 'Could not verify email.',
                   status:500}
        }
      
        //manage the token returned 
        const resData = await response.json();
        return resData;

    }catch(e){
        if(e.error) return e;
        else return {error: 'Could not verify email.',
        status:'unkown'}
    }



}

export async function getWebtoons(){
    // //dummy--------------------------
    // // await sleep(2000);
    // return {
    //     webtoonList: ['webtoon1', 'webtoon2', '웹툰3']
    // };
    // //--------------------------------

    const token = getAuthToken();
    if(!token || token=='EXPIRED') return redirect('/auth');

    try{
        const response = await fetch(`${URL}/api/webtoon/list`,{
            method:'GET',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization' : token
            }
            });
    
        //handle response
        if(response.status===422 || response.status ==401 || response.status ==400){
            throw {error: 'Could not get user info.',
                    status:response.status}
        }
        
        if(!response.ok){
            throw {error: 'Could not get user info.',
                    status:500}
        }
        
        //manage the token returned 
        const resData = await response.json();
        return resData;

    }catch(e){
        if(e.error) return e;
        else return {error: 'Could not create user.',
        status:'unknown'}
    }



    
}

export async function getPoseAssets(data){
    //dummy----
    // return [
    //     {
    //         assetName: 'Pose Asset 1',
    //         characterImgUrl: "https://www.akamai.com/site/im-demo/perceptual-standard.jpg?imbypass=true",
    //     },
    //     {
    //         assetName: 'Pose Asset 2',
    //         characterImgUrl: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    //     },
    //     {
    //         assetName: 'Pose Asset 3',
    //         characterImgUrl: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    //     },
    // ]
    //---------

    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/pose/asset/${data.webtoonName}`,{
                method:'GET',
                headers:{
                //   'Content-Type' : 'application/json',
                  'Authorization' : token,
                },
                // body: JSON.stringify(data)
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not fetch assets.',
                      status:response.status}
            }

            if(!response.ok) return [];
          
            // if(!response.ok){
            //     const resData = await response.json();
            //     console.log(resData);
            //     throw {error: 'Could not fetch assets.',
            //            status:500}
            // }
          
            //manage the token returned 
            const resData = await response.json();
            return resData;
    
        }catch(e){
            console.log(e);
            if(e.error) return e;
            else return {error: 'Could not fetch assets.',
            status:'unknown'}
        }
    

    }

    return 'tokenError';

}

export async function getStyleAssets(data){
        //dummy----
        // return [
        //     {
        //         assetName: 'Style Asset 1',
        //         characterImgUrl: "https://www.akamai.com/site/im-demo/perceptual-standard.jpg?imbypass=true",
        //     },
        //     {
        //         assetName: 'Style Asset 2',
        //         characterImgUrl: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        //     },
        //     {
        //         assetName: 'Style Asset 3',
        //         characterImgUrl: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
        //     },
        //     {
        //         assetName: 'Style Asset 4',
        //         characterImgUrl: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
        //     },
        //     {
        //         assetName: 'Style Asset 5',
        //         characterImgUrl: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
        //     },
        // ]
        //---------
        const token=getAuthToken();
        if(token && token!='EXPIRED'){
            try{
                const response = await fetch(`${URL}/api/background/asset/${data.webtoonName}`,{
                    method:'GET',
                    headers:{
                    //   'Content-Type' : 'application/json',
                      'Authorization' : token,
                    },
                    // body: JSON.stringify(data)
                  });
            
                //handle response
                if(response.status===422 || response.status ==401 || response.stastus==400){
                    throw {error: 'Could not fetch assets.',
                          status:response.status}
                }
    
              
                // if(!response.ok){
                //     const resData = await response.json();
                //     console.log(resData);
                //     throw {error: 'Could not fetch assets.',
                //            status:500}
                // }
              
                //manage the token returned 
                const resData = await response.json();
                console.log(resData);
                if(!response.ok) return [];
                return resData;
        
            }catch(e){
                console.log(e);
                if(e.error) return e;
                else return {error: 'Could not fetch assets.',
                status:'unknown'}
            }
        
    
        }
    
        return 'tokenError';

}

export async function getPoseAlbum(data){
    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/pose/asset/${data.webtoonName}/${data.assetName}`,{
                method:'GET',
                headers:{
                //   'Content-Type' : 'application/json',
                  'Authorization' : token,
                },
                // body: JSON.stringify(data)
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not fetch asset detail.',
                      status:response.status}
            }
          
            if(!response.ok){
                throw {error: 'Could not fetch asset detail.',
                       status:500}
            }
          
            //manage the token returned 
            const resData = await response.json();
            return resData;
    
        }catch(e){
            console.log(e);
            if(e.error) return e;
            else return {error: 'Could not fetch asset detail.',
            status:'unknown'}
        }
    

    }

    return 'tokenError';



}

export async function getStyleAlbum(data){

}

export async function postModelTrain(webtoonName, data){

    // console.log(data.get('images'));
    // return data.get('images');
    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/background/train/${webtoonName}`,{
                method:'POST',
                headers:{
                //   'Content-Type' : 'application/json',
                  'Authorization' : token,
                },
                body: data
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not process train.',
                      status:response.status}
            }
          
            if(!response.ok){
                throw {error: 'Could not process train.',
                       status:500}
            }
          
            //manage the token returned 
            const resData = await response.json();
            return resData;
    
        }catch(e){
            console.log(e);
            if(e.error) return e;
            else return {error: 'Could not process train.',
            status:'unknown'}
        }
    

    }

    return 'tokenError';


}

export async function postStyleTransfer(file, prompt, webtoonName){

    //dummy 
    // const urls=["https://www.akamai.com/site/im-demo/perceptual-standard.jpg?imbypass=true", 
    //     "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    //     "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg",
    //     "data:image/jpeg;base64,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",
    //     "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg",
    //     "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    // ];
    // return urls;
    //--------

    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            let response;

            if(!file){
                response = await fetch(`${URL}/api/background/txt2img/${webtoonName}?prompt=${encodeURIComponent(prompt)}`,{
                    method:'POST',
                    headers:{
                        'Content-Type' : 'application/json',
                        'Authorization' : token,
                      },
                    body:JSON.stringify({})
                  });

            }else{
                let data=new FormData();
                data.append('image',file);
                
                response = await fetch(`${URL}/api/background/img2img/${webtoonName}`,{
                    method:'POST',
                    headers:{
                      'Authorization' : token,
                    },
                    body: data,
                  });
            }

        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not process inference.',
                      status:response.status}
            }
          
            if(!response.ok){
                const resData = await response.json();
                console.log(resData);
                return resData.images;
                throw {error: 'Could not process inference.',
                       status:500}
            }
          
            //manage the token returned 
            const resData = await response.json();
            return resData.images;
    
        }catch(e){
            console.log(e);
            if(e.error) return e;
            else return {error: 'Could not process inference.',
            status:'unknown'}
        }
    

    }

    return 'tokenError';


    
}

export async function postPoseTransfer(data){

    //dummy
    //첫번째가 character, 두번째가 pose
    // const urls=["https://www.akamai.com/site/im-demo/perceptual-standard.jpg", 
    //     "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    // ];
    // const result= await Promise.all(urls.map(async (item)=>{
    //     const temp = await convertURLtoFile(item);
    //     return {
    //         url:item,
    //         file:temp,
    //     };
    // }));
    // return result;
    //------------------------------

    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/pose/inference`,{
                method:'POST',
                headers:{
                //   'Content-Type' : 'application/json',
                  'Authorization' : token,
                },
                body: data,
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not process inference.',
                      status:response.status}
            }
          
            if(!response.ok){
                const resData = await response.json();
                console.log(resData);
                return resData.images;
                throw {error: 'Could not process inference.',
                       status:500}
            }
          
            //manage the token returned 
            const resData = await response.json();
            return resData.images;
    
        }catch(e){
            console.log(e);
            if(e.error) return e;
            else return {error: 'Could not process inference.',
            status:'unknown'}
        }
    

    }

    return 'tokenError';


}

export async function postWebtoon(data){
    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/webtoon/create`,{
                method:'POST',
                headers:{
                  'Content-Type' : 'application/json',
                  'Authorization' : token,
                },
                body: JSON.stringify(data)
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not add webtoon.',
                      status:response.status}
            }
          
            if(!response.ok){
                throw {error: 'Could not add webtoon.',
                       status:500}
            }
          
            //manage the token returned 
            const resData = await response.json();
            return resData;
    
        }catch(e){
            if(e.error) return e;
            else return {error: 'Could not add webtoon.',
            status:'unkown'}
        }
    

    }

    return 'tokenError';

}

export async function postPoseAsset(fd, files){
    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/pose/save?webtoonName=${fd.get('webtoonName')}&assetName=${fd.get('assetName')}&description=${fd.get('description')}`,{
                method:'POST',
                headers:{
                  'Authorization' : token,
                },
                body: files
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not save asset.',
                      status:response.status}
            }
          
            // if(!response.ok){
            //     throw {error: 'Could not save asset.',
            //            status:500}
            // }

            const resData = await response.json();
            console.log(resData);
            return resData;
    
        }catch(e){
            console.log(e);
            if(e.error) return e;
            else return {error: 'Could not save asset.',
            status:'unknown'}
        }
    

    }

    return 'tokenError';

}

export async function postStyleAsset(fd, files){
    //dummy---------
    // return 'ok';
    //--------------

    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/background/save/${fd.get('webtoonName')}?assetName=${fd.get('assetName')}&description=${fd.get('description')}`,{
                method:'POST',
                headers:{
                  'Authorization' : token,
                },
                body: files
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not save asset.',
                      status:response.status}
            }
          
            // if(!response.ok){
            //     throw {error: 'Could not save asset.',
            //            status:500}
            // }

            const resData = await response.json();
            console.log(resData);
            return resData;
    
        }catch(e){
            console.log(e);
            if(e.error) return e;
            else return {error: 'Could not save asset.',
            status:'unknown'}
        }
    

    }

    return 'tokenError';


}

export async function deletePoseAsset(data){

}

export async function deleteBackgroundAsset(data){

}

export async function deleteWebtoon(data){
    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/webtoon/delete/${data.webtoonName}`,{
                method:'DELETE',
                headers:{
                  'Content-Type' : 'application/json',
                  'Authorization' : token,
                },
                body: JSON.stringify(data)
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not delete webtoon.',
                      status:response.status}
            }
          
            if(!response.ok){
                throw {error: 'Could not delete webtoon.',
                       status:500}
            }
          
            //manage the token returned 
            const resData = await response.json();
            console.log(resData);
            return resData;
    
        }catch(e){
            if(e.error) return e;
            else return {error: 'Could not delete webtoon.',
            status:'unkown'}
        }
    

    }

    return 'tokenError';

}

export async function getIsTrained(data){
    const token=getAuthToken();
    if(token && token!='EXPIRED'){
        try{
            const response = await fetch(`${URL}/api/webtoon/check-train/${data.webtoonName}`,{
                method:'GET',
                headers:{
                //   'Content-Type' : 'application/json',
                  'Authorization' : token,
                },
              });
        
            //handle response
            if(response.status===422 || response.status ==401 || response.stastus==400){
                throw {error: 'Could not check if the webtoon is trained.',
                      status:response.status}
            }
          
            if(!response.ok){
                throw {error: 'Could not check if the webtoon is trained.',
                       status:500}
            }
          
            //manage the token returned 
            const resData = await response.json();
            return resData;
    
        }catch(e){
            if(e.error) return e;
            else return {error: 'Could not check if the webtoon is trained.',
            status:'unknown'}
        }
    

    }

    return 'tokenError';




}

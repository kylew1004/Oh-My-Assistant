import { useRef, useEffect } from 'react';
import { useLocation, redirect } from 'react-router-dom';
import { postPoseAsset, postStyleAsset } from '../util/http.js';

function base64toFile(base64Data){
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' }); // 파일 형식에 따라서 변경해야 합니다.

  // Blob을 File 객체로 변환 (파일명 지정 가능)
  const file = new File([blob], 'filename.jpg', { type: 'image/jpeg' });

  return file
}

const SaveAssetModal = function Modal({ open, handleClose, images, originalImg}) {
  const dialog = useRef();
  const location = useLocation();

  useEffect(()=>{
    if(open) dialog.current.showModal();
    else dialog.current.close();

  },[open]);

  async function handleSubmit(event){
    event.preventDefault();
    let fd = new FormData(event.target);
    fd.append('webtoonName',location.pathname.split("/")[1]);

    let files = new FormData();
    let result;
    if(location.pathname.includes('styleTransfer')){
      files.append('original_image',originalImg);
      images.forEach(item=>{
        files.append('generated_images',base64toFile(item));
      });

      console.log(fd.get('outputImages'));
      console.log(fd.get('webtoonName'));

      result = await postStyleAsset(fd, files);
    }else{
      files.append('originalCharacterImg',originalImg[0]);
      files.append('originalPoseImg',originalImg[1]);
      files.append('characterImage',base64toFile(images[0]));
      files.append('poseImage',base64toFile(images[1]));
      
      result = await postPoseAsset(fd, files);
    }

    if(result==='tokenError') redirect('/auth');
    
  
    window.location.reload();

  }


  return <div onClick={handleClose}>
    <dialog className="modal" ref={dialog} >
      <form onSubmit={handleSubmit} method="post" encType="multipart/form-data" onClick={e => e.stopPropagation()} className="px-7 py-3 flex flex-col bg-gray-200">
        <button type="button" onClick={handleClose} className="ml-auto text-3xl text-gray-500">x</button>
        <h2 className="font-bold ">Save as Asset</h2>
        <hr className="h-[2px] bg-black"></hr>
        <div className="control control-row w-full my-5 flex flex-col">
          <label className="font-bold mb-3">Asset Name</label>
          <input className="h-16 w-full rounded-lg bg-gray-300 text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400" id="assetName" type="text" name="assetName" placeholder="Enter Asset name" required />
        </div>
    
        <div className="control p-1 flex flex-col control-row w-full my-5">
            <label className="font-bold mb-3">Description(optional)</label>
            <textarea className="rounded-lg bg-gray-300 h-[120px] text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400" rows="10" id="description" name="description" placeholder="Enter description here"/>
        </div>


        <button  className="button mx-auto h-12 my-6 w-full  bg-yellow-500 rounded-full text-black font-bold">
        Create Asset
        </button>

      </form>
      
    </dialog>

</div>

};

export default SaveAssetModal;
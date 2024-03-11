import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { postPoseAsset, postStyleAsset } from '../util/http.js';

const SaveAssetModal = function Modal({ open, handleClose, images, originalImg}) {
  const dialog = useRef();
  const location = useLocation();

  useEffect(()=>{
    if(open) dialog.current.showModal();
    else dialog.current.close();

  },[open]);

  async function handleSubmit(event){
    event.preventDefault();

    let result;
    if(location.pathname.includes('styleTransfer')){
      const fd = new FormData(event.target);
      fd.append('originalImage',originalImg);
      fd.append('webtoonName',location.pathname.split("/")[1]);

      const imageFiles = images.map(item=>{
        return item.file;
      });
      fd.append('outputImages',imageFiles);

      console.log(fd.get('outputImages'));
      console.log(fd.get('webtoonName'));

      result = await postStyleAsset(fd);
    }else{
      const fd = new FormData(event.target);
      fd.append('originalCharacterImg',originalImg[0]);
      fd.append('originalPoseImg',originalImg[1]);
      fd.append('webtoonName',location.pathname.split("/")[1]);

      fd.append('characterImg',images[0].file);
      fd.append('poseImg',images[1].file);
      
      result = await postPoseAsset(fd);
    }
    
  
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
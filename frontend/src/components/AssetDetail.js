import {useState, Suspense, useEffect} from 'react';
import {Await, defer, useLoaderData, useSearchParams} from 'react-router-dom';
import {getPoseAlbum, getStyleAlbum} from '../util/http.js';

export default function AssetDetail(){
    const [activeImage, setActiveImage] = useState();
    const {mode, asset} = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const isScene = searchParams.get('mode')==='Scenes';

    const fetchData = () => {
        return new Promise((resolve, reject) => {
            resolve(asset);
        });
      };

    useEffect(()=>{
        fetchData()
        .then((asset) => {
            if(isScene) setActiveImage(asset.backgroundImageUrls[0]);
            else setActiveImage(asset.characterImgUrl);
        })

    },[]);
      


    return <div className="flex flex-row h-full w-full rounded-lg bg-[#1c1a2e]">

        <Suspense fallback={<h3 className="text-md pb-1 my-auto" >loading...</h3>}>
                        <Await resolve={asset} >
                                {(loadedAsset) =>  loadedAsset && <div className="flex flex-row">

                                    <div className="flex flex-col h-full w-full rounded-l-xl p-2 justify-between">
                                   <span className=" h-[90%] w-full flex rounded-lg p-3 bg-violet-300 bg-opacity-60 justify-center items-center object-contain mx-auto" >
                                       <img className="h-full w-full object-contain mx-auto" src={activeImage}/>
                                   </span>
                                   {!isScene &&  
                                   <ul className="h-[14%] gap-3 mt-3 flex flex-row rounded-lg p-3 pr-5 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
                                        
                                   <li className="relative inline-block" >
                                      <img className={`h-14 w-14 rounded-xl ${activeImage===loadedAsset.characterImgUrl && " border-4 border-yellow-500"}`} src={loadedAsset.characterImgUrl} onClick={ (()=>setActiveImage(loadedAsset.characterImgUrl))}/>
                                  </li>
                                  <li className="relative inline-block" >
                                      <img className={`h-14 w-14 rounded-xl ${activeImage===loadedAsset.poseImgUrl && " border-4 border-yellow-500"}`} src={loadedAsset.poseImgUrl} onClick={ (()=>setActiveImage(loadedAsset.poseImgUrl))}/>
                                  </li>
                              </ul>
                                        }

                                    {isScene &&
                                    <ul className="h-[14%] gap-3 mt-3 flex flex-row rounded-lg p-3 pr-5 bg-violet-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
                                       { loadedAsset.backgroundImageUrls.map((item,index) => {
                                        console.log(item);
                                        return <li key={index} className="relative inline-block" >
                                        <img className={`h-14 w-14 rounded-xl ${activeImage===item && " border-4 border-yellow-500"}`} src={item} onClick={ (()=>setActiveImage(item))}/>
                                    </li>

                                    })}
                                </ul>
                                    

                                    }
                                   
                               </div>
                           
                               <div className="h-full w-full rounded-r-xl flex flex-col p-5 mx-auto">
                               <h2 className="text-gray-200">DETAILS</h2>
                               <div className="h-full w-full rounded-r-xl flex flex-col mx-auto gap-3 overflow-auto">
                                   <div className="flex flex-row w-full mx-auto bg-violet-300 bg-opacity-30 rounded-lg itemes-center justify-center">
                                       <h3 className="flex-1 text-center font-bold bg-violet-300 bg-opacity-40 rounded-l-lg py-3">Asset Name</h3>
                                       <p className="flex-1 text-center py-3 text-gray-300">{loadedAsset.assetName}</p>
                                   </div>
                                   <div className="flex flex-row w-full mx-auto bg-violet-300 bg-opacity-30 rounded-lg itemes-center justify-center">
                                       <h3 className="flex-1 text-center font-bold bg-violet-300 bg-opacity-40 rounded-l-lg py-3">Description</h3>
                                       <p className="flex-1 text-center py-3 text-gray-300">{loadedAsset.description}</p>
                                   </div>
                                   <div className="flex flex-row w-full mx-auto bg-violet-300 bg-opacity-30 rounded-lg itemes-center justify-center">
                                       <h3 className="flex-1 text-center font-bold bg-violet-300 bg-opacity-40 rounded-l-lg py-3">Created At</h3>
                                       <p className="flex-1 text-center py-3 text-gray-300">{loadedAsset.createdAt}</p>
                                   </div>
                                   {isScene && <div className="flex flex-col w-full mx-auto bg-violet-300 bg-opacity-30 rounded-lg itemes-center justify-center gap-2">
                                       <h3 className="flex-1 text-center font-bold bg-violet-300 bg-opacity-40 rounded-l-lg py-3">Input Image</h3>
                                       <img className="rounded-md" src={loadedAsset.originalImageUrl} />
                                   </div>}
                                   {!isScene && <>
                                   <div className="flex flex-col w-full mx-auto bg-violet-300 bg-opacity-30 rounded-lg itemes-center justify-center gap-2">
                                       <h3 className="flex-1 text-center font-bold bg-violet-300 bg-opacity-40 rounded-l-lg py-3">Input Character Image</h3>
                                       <img className="rounded-md" src={loadedAsset.originalCharacterImgUrl} />
                                   </div>
                                   <div className="flex flex-col w-full mx-auto bg-violet-300 bg-opacity-30 rounded-lg itemes-center justify-center gap-2">
                                       <h3 className="flex-1 text-center font-bold bg-violet-300 bg-opacity-40 rounded-l-lg py-3">Input Pose Image</h3>
                                       <img className="rounded-md" src={loadedAsset.originalPoseImgUrl} />
                                   </div>
                                   </>}
        
                           
                               </div>
                               </div>
                                </div>
                                }
                </Await>
        </Suspense>
        
        </div>;
}

export function loader({params, request}){
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("mode");

    const data={
        webtoonName: params.webtoonName,
        assetName: params.assetName,
    }

    if(searchTerm=='Scenes') return defer({
        mode:searchTerm,
        asset: getStyleAlbum(data),
      });

    return defer({
        mode:searchTerm,
        asset: getPoseAlbum(data),
      })
}
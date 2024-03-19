import {useState, Suspense, useEffect} from 'react';
import {Await, defer, useLoaderData, useSearchParams} from 'react-router-dom';
import {getPoseAlbum, getStyleAlbum} from '../util/http.js';
import DeleteMenu from './DownloadMenu.js';
import BackButton from './BackButton.js';

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
      


    return <Suspense fallback={<h3 className="text-md pb-1 my-auto" >loading...</h3>}>
                        <Await resolve={asset} >
                                {(loadedAsset) =>  loadedAsset && <div className="flex flex-col h-[89%]">
                                <div className="flex flex-row h-[10%] py-2 ml-10">
                                    <BackButton />
                                </div>
                                <div className="flex flex-row bg-[#1c1a2e] p-4 rounded-xl w-11/12 max-h-[90%] mx-auto mb-3">
                                    <div className="flex flex-col h-full w-[60%] rounded-l-xl p-2">
                                        <span className="flex h-[84%] w-full rounded-lg p-3 bg-violet-300 bg-opacity-60 justify-center items-center object-contain mx-auto" >
                                            <img className="h-full w-full object-contain mx-auto" src={activeImage}/>
                                        </span>
                                        {!isScene &&  
                                        <ul className="h-[14%] gap-3 w-auto flex flex-row rounded-lg p-3 bg-violet-300/20 justify-center items-center object-contain mx-auto mt-auto" >
                                            <img className={`h-full aspect-square rounded-xl ${activeImage===loadedAsset.characterImgUrl && " border-4 border-yellow-500"}`} src={loadedAsset.characterImgUrl} onClick={ (()=>setActiveImage(loadedAsset.characterImgUrl))}/>
                                            <img className={`h-full aspect-square rounded-xl ${activeImage===loadedAsset.poseImgUrl && " border-4 border-yellow-500"}`} src={loadedAsset.poseImgUrl} onClick={ (()=>setActiveImage(loadedAsset.poseImgUrl))}/>
                                        </ul>
                                        }
                                        {isScene &&
                                        <ul className="h-[14%] w-auto gap-3 flex flex-row rounded-lg p-3 bg-violet-300/20 justify-center items-center object-contain mx-auto mt-auto overflow-y-auto no-scrollbar" >
                                            { loadedAsset.backgroundImageUrls.map((item,index) => {
                                                return <img key={index} className={`h-full aspect-square rounded-xl ${activeImage===item && " border-4 border-yellow-500"}`} src={item} onClick={ (()=>setActiveImage(item))}/>
                                            })}
                                        </ul>
                                        }
                                    </div>
                                
                                    <div className="h-full w-[40%] rounded-r-xl flex flex-col px-2 mx-auto">
                                        <div className="flex h-[8%] aspect-square mr-auto hover:bg-violet-300/60 rounded-full overflow-hidden justify-center"><DeleteMenu activeImage={activeImage} loadedAsset={loadedAsset}/></div>
                                        <h2 className="text-gray-200 text-center">DETAILS</h2>
                                        <div className="h-[80%] w-full rounded-r-xl flex flex-col mx-auto gap-3 overflow-auto">
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
                                                <p className="flex-1 text-center py-3 text-gray-300">{loadedAsset.createdAt.replace("T", " ")}</p>
                                            </div>
                                            {loadedAsset.originalImageUrl && <div className="flex flex-col w-full mx-auto bg-violet-300 bg-opacity-30 rounded-lg itemes-center justify-center gap-2">
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


                        </div>
                                }
                </Await>
        </Suspense>
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
import {Await, defer, useSearchParams, useLoaderData, redirect, Link} from 'react-router-dom';
import {Suspense, useEffect} from 'react';
import Asset from '../components/Asset.js';
import { getStyleAssets, getPoseAssets } from '../util/http';
import { getAuthToken } from '../util/auth.js';
import emptyImg from '../assets/empty-box.png';
import generalLoading from '../assets/generalLoading.gif';

export default function AssetList(){
    const {assets} = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const active = searchParams.get('mode')==='Scenes' ? 'Scenes' : 'Characters';
    const inactive = active==='Scenes' ? 'Characters' : 'Scenes';

    useEffect(() => {
        if (!searchParams.get('mode')) {
          searchParams.set("mode", "Characters");
          setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

    return <>
        <div className="flex justify-center items-center w-full m-auto py-1">
            <Link to={`?mode=${inactive}`} className={ `flex flex-row bg-gray-300 rounded-full w-1/4`}>
                {active==='Scenes' && <p className="text-center m-auto text-gray-500 font-bold">{inactive}</p>}
                <Link to={`?mode=${active}`} className={`bg-yellow-500 text-[#342d60] font-bold rounded-full h-full w-1/2 py-2`}>
                    <p className="text-center m-auto">{active}</p>
                </Link>
                {active!=='Scenes' && <p className="text-center m-auto text-gray-500 font-bold">{inactive}</p>}
            </Link>
        </div>

        <div className="p-4 bg-white bg-opacity-30 m-auto rounded-xl w-11/12 h-5/6 mt-0 overflow-auto flex flex-wrap justify-start gap-5 shadow-lg">
            <Suspense fallback={<img className="h-[8%] w-auto m-auto" src={generalLoading}/>}>
                <Await resolve={assets} className="bg-white bg-opacity-30 m-auto rounded-xl w-11/12 h-5/6 mt-0 overflow-auto flex justify-center shadow-lg">
                        {(loadedAssets) =>  loadedAssets.length>0 ? loadedAssets.map((asset,index)=><Asset key={index} name={asset.assetName} imageUrl={active==='Scenes' ? asset.backgroundImgUrl : asset.characterImgUrl} />)
                                            : <div className="flex flex-col w-full h-full justify-center items-center overflow-hidden">
                                                <img src={emptyImg} className="h-1/4 aspect-square mb-10" />
                                                <h3 className="text-[#19162a] font-bold text-xl">아직 생성된 에셋이 없습니다.</h3>
                                                </div>}
                    </Await>
            </Suspense>
        </div> 

    </>
    
}

export function loader({params, request}){
    const token = getAuthToken();
    if(!token || token=='EXPIRED') return redirect('/auth');

    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("mode");

    const data={
        webtoonName: params.webtoonName,
    }

    if(searchTerm=='Scenes') return defer({
        mode: searchTerm,
        assets: getStyleAssets(data),
      });

    return defer({
        mode: searchTerm,
        assets: getPoseAssets(data),
      })
}
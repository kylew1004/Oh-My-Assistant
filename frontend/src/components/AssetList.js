import {Await, defer, useSearchParams, useLoaderData, redirect} from 'react-router-dom';
import {Suspense, useEffect} from 'react';
import Asset from '../components/Asset.js';
import { getStyleAssets, getPoseAssets } from '../util/http';
import { getAuthToken } from '../util/auth.js';

export default function AssetList(){
    const {assets} = useLoaderData();

    return <Suspense fallback={<h3 className="text-md pb-1 my-auto" >loading...</h3>}>
               <Await resolve={assets} className="bg-white bg-opacity-30 m-auto rounded-xl w-11/12 h-5/6 mt-0 overflow-auto flex justify-center shadow-lg">
                    {(loadedAssets) =>  loadedAssets && loadedAssets.map((asset,index)=><Asset key={index} name={asset.assetName} imageUrl={asset.characterImgUrl} />)}
                </Await>
        </Suspense>
    {/* </div>  */}
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
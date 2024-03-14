import {Await, defer, useSearchParams, useLoaderData, redirect} from 'react-router-dom';
import {Suspense, useEffect} from 'react';
import Asset from '../components/Asset.js';
import { getStyleAssets, getPoseAssets } from '../util/http';
import { getAuthToken } from '../util/auth.js';

export default function AssetList(){
    const {assets} = useLoaderData();
    console.log(assets);

    return <div className="p-5 flex flex-row justify-start gap-5 flex-wrap mx-auto">
         <Suspense fallback={<h3 className="text-md pb-1 my-auto" >loading...</h3>}>
               <Await resolve={assets} >
                    {(loadedAssets) =>  loadedAssets && loadedAssets.map((asset,index)=><Asset key={index} name={asset.assetName} imageUrl={asset.characterImgUrl} />)}
                </Await>
        </Suspense>
    </div> 
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
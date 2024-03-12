import {Await, defer, useSearchParams, useLoaderData} from 'react-router-dom';
import {Suspense, useEffect} from 'react';
import Asset from '../components/Asset.js';
import { getStyleAssets, getPoseAssets } from '../util/http';

export default function AssetList(){
    const {assets} = useLoaderData();

    return <div className="gap-5 p-5 flex flex-row flex-wrap overflow-auto ">
         <Suspense fallback={<h3 className="text-md pb-1 my-auto" >loading...</h3>}>
        <Await resolve={assets}>
            {(loadedAssets) => loadedAssets.map((asset,index)=><Asset key={index} name={asset.assetName} imageUrl={asset.characterImgUrl} />)}
        </Await>
    </Suspense>
    </div> 
}

export function loader({params, request}){
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("mode");

    const data={
        webtoonName: params.webtoonName,
    }

    if(searchTerm=='Scenes') return defer({
        assets: getStyleAssets(data),
      });

    return defer({
        assets: getPoseAssets(data),
      })
}
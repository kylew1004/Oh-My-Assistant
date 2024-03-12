import {Await, defer, useSearchParams, useLoaderData} from 'react-router-dom';
import {Suspense, useEffect} from 'react';
import Asset from '../components/Asset.js';
import { getStyleAssets, getPoseAssets } from '../util/http';

export default function AssetList(){
    const {mode, assets} = useLoaderData();

    return <Suspense fallback={<h3 className="text-md pb-1 my-auto" >loading...</h3>}>
        <Await resolve={assets}>
            {(loadedAssets) => loadedAssets.map(asset=><Asset name={asset.assetName} imageUrl={asset.characterImgUrl} />)}
        </Await>
    </Suspense>
}

export function loader({params, request}){
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("mode");

    const data={
        webtoonName: params.webtoonName,
    }

    if(searchTerm=='Scenes') return defer({
        mode:searchTerm,
        assets: getStyleAssets(data),
      });

    return defer({
        mode:searchTerm,
        assets: getPoseAssets(data),
      })
}
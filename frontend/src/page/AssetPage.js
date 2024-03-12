import { Link, useSearchParams, defer, useLoaderData, Await } from 'react-router-dom';
import {useEffect, Suspense} from 'react';
import { getStyleAssets, getPoseAssets } from '../util/http';

export default function Assets(){
    const [searchParams, setSearchParams] = useSearchParams();
    const {scenes, characters} = useLoaderData();

    useEffect(() => {
        if (!searchParams.get('mode')) {
          searchParams.set("mode", "Scenes");
          setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

    const active = searchParams.get('mode')==='Scenes' ? 'Scenes' : 'Characters';
    const inactive = active==='Scenes' ? 'Characters' : 'Scenes';


    return <div className="flex flex-col  w-full h-full">

            <div className="relative flex justify-center items-center w-full m-auto py-3">
                <Link to={`?mode=${inactive}`} className={ `button h-12 w-[160px] absolute left-1/2 transform -translate-x${active==="Characters"?"":"-"}-3/4 bg-gray-300 text-gray-500 rounded-full`}>
                    <p className="font-bold text-center pt-3">{inactive}</p>
                </Link>
                <Link to={`?mode=${active}`} className={`button h-12 w-[160px] absolute left-1/2 transform -translate-x-${active==="Characters"?"-":""}3/4 bg-yellow-500 text-black rounded-full`}>
                <p className="font-bold text-center pt-3">{active}</p>
                </Link>
                {/* <button className="button h-14 w-1/6 absolute left-1/2 transform -translate-x--3/4 bg-gray-300 text-gray-500 rounded-full">
                    Scenes
                </button>
                <button className="button h-14 w-1/6 absolute left-1/2 transform -translate-x-3/4 bg-yellow-500 text-black rounded-full">
                    Characters
                </button> */}
            </div>



            <div className="bg-white bg-opacity-30 m-auto rounded-xl justify-center items-center w-11/12 h-5/6 mt-0">
                <Suspense fallback={<h3 className="text-md pb-1 my-auto" >loading...</h3>}>
                        <Await resolve={active=="Scenes" ? scenes : characters}>
                            {(loadedAssets) => loadedAssets.map(asset=> <div className="flex flex-col pl-3 p-1">
                                <Link to={`/`} className="text-white text-md pb-1  w-full text-left hover:bg-gray-950" >{asset}</Link>
                            </div>)}
                        </Await>
                </Suspense>

                
            </div>

    
</div>
}

export function loader({params}){
    const data={
        webtoonName: params.webtoonName,
    }

    return defer({
        scenes: getStyleAssets(data),
        characters: getPoseAssets(data),
      })
}
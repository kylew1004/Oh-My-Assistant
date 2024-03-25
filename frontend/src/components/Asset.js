import { Link, useLocation, useParams, useSearchParams} from 'react-router-dom';
import DeleteMenu from './DeleteMenu.js';

export default function Asset({name, imageUrl}){
    const location = useLocation();
    const {webtoonName} = useParams();
    const searchParams = location.search;
    const [searchParam, setSearchParam] = useSearchParams();
    const isScenes = searchParam.get('mode')==='Scenes';

    return <Link to={`${location.pathname}/${name}${searchParams}`} className={`flex flex-col text-white text-md text-left rounded-2xl w-[23%] h-56`} 
            style={{backgroundImage: `url('${imageUrl}')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'  }} >
            
            {/* <div className="flex flex-row mt-auto w-auto h-1/5">
                <div className="flex bg-[#3f396b] rounded-full mb-2 ml-2">
                    <p className="p-1.5 px-4">{name}</p>
                </div>

                <div className="flex bg-[#3f396b] w-[18%] rounded-full mb-2 px-2 ml-auto mr-2 justify-center overflow-hidden">
                    <DeleteMenu subject={{assetName:name, webtoonName: webtoonName, isScenes: isScenes}}/>
                </div>
            </div> */}
            <div className="mt-auto flex flex-row w-auto h-1/4 bg-[#3f396b] rounded-b-2xl">
                <p className="p-1.5 px-4 ml-1 my-auto">{name}</p>

                <div className="flex w-[16%] h-[80%] rounded-full px-2 ml-auto mr-2 my-auto justify-center overflow-hidden">
                    <DeleteMenu subject={{assetName:name, webtoonName: webtoonName, isScenes: isScenes}}/>
                </div>
            </div>

            
        </Link>
}


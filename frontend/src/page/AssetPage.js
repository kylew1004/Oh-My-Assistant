import { Link, useSearchParams, useLocation, Outlet } from 'react-router-dom';
import {useEffect} from 'react';

export default function Assets(){
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const passLength = location.pathname.split('/').length;

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
                <Link to={`?mode=${inactive}`} hidden={passLength===4} className={ `flex flex-row bg-gray-300 rounded-full w-1/4`}>
                    {active==='Scenes' && <p className="text-center m-auto">{inactive}</p>}
                    <Link to={`?mode=${active}`} hidden={passLength===4} className={`bg-yellow-500 rounded-full h-full w-1/2 py-2`}>
                        <p className="font-bold text-center m-auto">{active}</p>
                    </Link>
                    {active!=='Scenes' && <p className="text-center m-auto">{inactive}</p>}
                </Link>
            </div>



            <div className="p-4 bg-white bg-opacity-30 m-auto rounded-xl w-11/12 h-5/6 mt-0 overflow-auto flex flex-wrap justify-start gap-5 shadow-lg">
                <Outlet />
            </div>

    
</div>
}
import { Link, useLocation} from 'react-router-dom';

export default function Asset({name, imageUrl}){
    const location = useLocation();
    const searchParams = location.search;

    return <Link to={`${location.pathname}/${name}${searchParams}`} className={`flex flex-col text-white text-md pb-1 text-left h-64 w-60 rounded-2xl`} 
            style={{backgroundImage: `url('${imageUrl}')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'  }} >
            
            <div className="mt-auto">
                <div className="flex bg-[#3f396b] rounded-full w-1/2 mb-2 ml-2">
                    <p className="m-auto p-1.5">{name}</p>
                </div>
{/* 
                downlaod Button */}

            </div>

            
        </Link>
}
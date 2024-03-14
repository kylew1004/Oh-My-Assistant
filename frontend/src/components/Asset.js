import { Link, useLocation} from 'react-router-dom';

export default function Asset({name, imageUrl}){
    const location = useLocation();
    const searchParams = location.search;

    return <Link to={`${location.pathname}/${name}${searchParams}`} className={`flex flex-col text-white text-md pb-1 text-left h-56 rounded-2xl w-[23%]`} 
            style={{backgroundImage: `url('${imageUrl}')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'  }} >
            
            <div className="flex mt-auto w-auto">
                <div className="flex bg-[#3f396b] rounded-full mb-2 ml-2">
                    <p className="p-1.5 px-4">{name}</p>
                </div>
{/* 
                downlaod Button */}

            </div>

            
        </Link>
}
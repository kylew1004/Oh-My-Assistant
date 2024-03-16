import { Link, useLocation} from 'react-router-dom';
import menuIcon from '../assets/dot-menu-more-svgrepo-com.svg';

export default function Asset({name, imageUrl}){
    const location = useLocation();
    const searchParams = location.search;

    return <Link to={`${location.pathname}/${name}${searchParams}`} className={`flex flex-col text-white text-md pb-1 text-left h-56 rounded-2xl w-[23%]`} 
            style={{backgroundImage: `url('${imageUrl}')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'  }} >
            
            <div className="flex flex-row mt-auto w-auto h-1/5">
                <div className="flex bg-[#3f396b] rounded-full mb-2 ml-2">
                    <p className="p-1.5 px-4">{name}</p>
                </div>
                <button onClick={(e)=>{e.preventDefault()}} className="flex bg-[#3f396b] rounded-full mb-2 px-2 ml-auto mr-2">
                    <img className="h-[60%] m-auto" src={menuIcon}/>
                </button>
{/* 
                downlaod Button */}

            </div>

            
        </Link>
}
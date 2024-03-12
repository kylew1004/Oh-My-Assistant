import { Link, useLocation} from 'react-router-dom';

export default function Asset({name, imageUrl}){
    const location = useLocation();
    const searchParams = location.search;

    return <Link to={`${location.pathname}/${name}${searchParams}`} className={`flex flex-col text-white text-md pb-1 text-left h-52 w-44 bg-cover hover:bg-gray-950`} 
            style={{backgroundImage: `url('${imageUrl}')`, backgroundSize: 'contain' }} >

            <p>{name}</p>
            
        </Link>
}
import errorImg from '../assets/error.png';

export default function Error({message}) {
    return <>
        <img className="p-5 pb-5 w-1/4" src={errorImg}/>
        <h2 className="text-red-800"> ERROR </h2>
        <p className="text-xl text-red-900">{message}</p>
    </>
}
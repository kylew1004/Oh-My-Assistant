import errorImg from '../assets/error.png';

export default function Error({message}) {
    return <span className="h-4/6 flex flex-col border rounded-lg p-3 bg-red-300 bg-opacity-20 justify-center items-center object-contain mx-auto" >
            <img className="p-5 pb-8 w-1/5" src={errorImg}/>
            <h2 className="text-red-800"> ERROR </h2>
            <p className="text-xl text-red-900">{message}</p>
        </span>
}
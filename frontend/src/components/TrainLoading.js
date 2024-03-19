import trainLoadingSvg from '../assets/trainLoading.svg';

export default function TrainLoading(){

    return <div className="flex flex-col m-auto max-h-[90%] justify-center">
            <img src={trainLoadingSvg} className="h-1/3 mb-5" />
            <h2 className="text-yellow-500">Training in progress...</h2>
            <p className="text-gray-300 text-center">(Estimated time : 5 minutes)</p>
            <p className="text-gray-300 text-center">다른 페이지로 이동하면 안됩니다.</p>
    </div>

}
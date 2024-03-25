import {useState} from 'react';
import HelpModal from './HelpModal';

export default function Help(){
    const [isModal, setIsModal] = useState(false);

    function handleCloseModal(){
        setIsModal(false);
    }

    return <>
        {isModal && <HelpModal handleCloseModal={handleCloseModal} open={isModal} />}
        <button onClick={()=>setIsModal(true)} className="my-auto border-2 border-yellow-700/60 rounded-full px-1.5 text-yellow-700/60 text-sm">?</button>
    </>
}
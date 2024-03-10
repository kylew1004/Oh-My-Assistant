import { NavLink } from 'react-router-dom';

const activeStyle = "flex flex-col mx-4 text-gray-600 text-md h-full"
const inactiveStyle = "flex flex-col pl-3 text-black font-bold text-md"

export default function Panel(){
    return <div className="flex flex-row bg-gray-100 h-[105px] w-full">
    <div className="flex flex-col pl-3">
        <h1 className="text-gray-800 text-2xl my-auto ml-5 font-bold mb-0" >목욕의 신</h1>
        <div className="flex flex-row mt-auto">
            <NavLink to="/assets" className={({ isActive }) => isActive ? inactiveStyle : activeStyle }>
                {({ isActive }) => (
                    isActive ? <div><p>Assets</p><hr className="bg-yellow-500 h-1.5 bottom-0 mt-1 justify-end" /></div> 
                    : <p>Assets</p>
                )}
            </NavLink>
            <NavLink to="/createNew" className={({ isActive }) => isActive ? inactiveStyle : activeStyle }>
                {({ isActive }) => (
                    isActive ? <div><p>Create new</p><hr className="bg-yellow-500 h-1.5 bottom-0 mt-1 justify-end" /></div> 
                    : <p>Create new</p>
                )}
            </NavLink>
        </div>
    </div>

    <NavLink to="/train" className="ml-auto my-auto mr-12 rounded-full text-white h-[45px] px-8
    bg-gradient-to-b from-[#E9522E] via-pink-600 to-[#D58ABD] font-bold">
        <p className="text-center mt-3">
         Initialize Style Reference
        </p>
    </NavLink>
</div>
}
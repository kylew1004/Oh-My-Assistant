import { createContext, useState } from "react";

const NotiContext = createContext({
  noti: [],
});

export const NotiProvider = ({ children }) => {
    const [noti, setNoti] = useState([]);

    const addNoti = (noti)=>{
      setNoti((prev)=>{
        const copyPrev=[...prev];
        copyPrev.push(noti);
        return copyPrev;
      })
    }

    const removeNoti = ()=>{
      setNoti((prev)=>{
        const copyPrev=[...prev];
        if(copyPrev.length>0) return copyPrev.slice(1);
        return copyPrev;
      });
    }

    return (
    <NotiContext.Provider value={{noti, addNoti, removeNoti}}> 
      {children}
    </NotiContext.Provider>
  );
};

export default NotiContext;
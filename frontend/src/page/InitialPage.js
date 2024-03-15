import { useEffect } from 'react';
import { useNavigate, useRouteLoaderData, useActionData } from 'react-router-dom';
import noWebtoonImg from '../assets/no-webtoon.png';

export default function InitialPage(){
    const navigate = useNavigate();
    const {webtoons} = useRouteLoaderData('root');
    


    const fetchData = () => {
        return new Promise((resolve, reject) => {
            resolve(webtoons);
        });
      };


    // useEffect(()=>{
    //   fetchData()
    //   .then((webtoons) => {
    //       console.log(webtoons.webtoonList); // Access the value when the promise resolves
    //       if (webtoons?.webtoonList && webtoons.webtoonList.length > 0) {
    //           navigate(`/${webtoons.webtoonList[webtoons.webtoonList.length-1]}/assets`);
    //       }
    //   })

    // },[]);

    return (
      <div className="flex flex-col h-full bg-white bg-opacity-30 rounded-2xl items-center justify-center gap-5 m-10">
        <img src={noWebtoonImg} className=" h-1/4 w-3/5" />
        <h2 className=" text-[#19162a]">아직 생성된 웹툰이 없습니다.</h2>
        <p className=" text-[#19162a]">사이드 메뉴에서 새 웹툰 추가 후 서비스를 시작해 보세요!</p>
      </div>
    );

}
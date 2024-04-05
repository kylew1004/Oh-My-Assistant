import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWebtoonModal from "../components/AddWebtoonModal";
import noWebtoonImg from "../assets/no-webtoon.png";
import { useQuery } from "@tanstack/react-query";
import { getWebtoons } from "../util/http.js";

export default function InitialPage() {
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);

  const {
    isLoading: isLoadingWebtoons,
    isError: isErrorWebtoons,
    data: webtoonsData,
    isSuccess: isSuccessWebtoons,
  } = useQuery({
    queryKey: ["webtoons"],
    queryFn: getWebtoons,
    options: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  });

  useEffect(() => {
    if (
      webtoonsData &&
      webtoonsData.webtoonList &&
      webtoonsData.webtoonList.length > 0
    )
      navigate(
        `/${
          webtoonsData.webtoonList[webtoonsData.webtoonList.length - 1]
        }/assets`
      );
  }, [webtoonsData]);

  function handleClose() {
    setIsModal(false);
  }

  function handleOpen() {
    setIsModal(true);
  }

  return (
    <>
      <AddWebtoonModal open={isModal} handleClose={handleClose} />
      <div className="flex flex-col h-[90%] w-[90%] bg-white bg-opacity-30 rounded-2xl items-center justify-center m-auto">
        <img src={noWebtoonImg} className=" h-1/4 mb-14" />
        <h2 className=" text-[#19162a]">아직 생성된 웹툰이 없습니다.</h2>
        <p className=" text-[#19162a]">
          사이드 메뉴에서 새 웹툰 추가 후 서비스를 시작해 보세요!
        </p>
        <button
          className="bg-violet-500 rounded-full px-8 py-4 mt-7 font-bold bg-gradient-to-r from-[#a7a1f9] to-[#c6aaf9]"
          onClick={handleOpen}
        >
          Add new webtoon
        </button>
      </div>
    </>
  );
}

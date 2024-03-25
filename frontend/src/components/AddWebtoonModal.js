import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postWebtoon } from "../util/http.js";
import ErrorMessage from "./ErrorMessage.js";

const AddWebtoonModal = function Modal({ open, handleClose }) {
  const dialog = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) dialog.current.showModal();
    else {
      dialog.current.close();
      setError(null);
      setName("");
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      webtoonName: name.trim(),
    };
    const result = await postWebtoon(data);

    if (!result.error) {
      handleClose();
      navigate(`/${data.webtoonName}/assets`);
    } else {
      setError(result.error);
    }
  }

  return (
    <div onClick={handleClose}>
      <dialog className="modal" ref={dialog}>
        <form
          onClick={(e) => e.stopPropagation()}
          className="px-7 py-3 flex flex-col bg-gray-200"
        >
          <button
            type="button"
            onClick={handleClose}
            className="ml-auto text-3xl text-gray-500"
          >
            x
          </button>
          <h2 className="font-bold ">Add New Webtoon</h2>
          <hr className="h-[2px] bg-black"></hr>
          <div className="control control-row w-full my-5 flex flex-col">
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <label className="font-bold mb-3">Name</label>
            <input
              className="h-16 w-full rounded-lg bg-gray-300 text-gray-700 text-lg p-4 focus:outline-none focus:border-yellow-100 focus:ring-4 focus:ring-yellow-500 placeholder-gray-400"
              id="name"
              type="text"
              name="name"
              placeholder="Enter Webtoon name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="button mx-auto h-12 my-6 w-full  bg-yellow-500 rounded-full text-black font-bold"
          >
            Create Webtoon
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default AddWebtoonModal;

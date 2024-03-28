import { useEffect, useContext } from "react";
import Alert from "@mui/material/Alert";
import NotiContext from "../store/noti_context.js";

export default function Notification({ item }) {
  const { removeNoti } = useContext(NotiContext);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      //unmount logic
      removeNoti();
    }, 3 * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="m-4">
      <Alert severity={item.state}>{item.message}</Alert>
    </div>
  );
}

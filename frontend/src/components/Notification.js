import Alert from "@mui/material/Alert";

export default function Notification() {
  return (
    <div className="absolute  z-20 top-0 right-0 m-4">
      <Alert severity="success">Train completed successfully.</Alert>
    </div>
  );
}

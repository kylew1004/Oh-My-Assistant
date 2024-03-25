export default function ErrorMessage({children}){
    return <div className="flex w-full p-2 bg-red-400/30 rounded-md my-2">
    <p className="text-red-700 mx-auto">{children}</p>
  </div>
}
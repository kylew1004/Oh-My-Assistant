export default function DownloadBtn ({imageUrl, isFetching}) {
    function handleDownload () {
        if(imageUrl){
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'output.jpg';
            link.click();
        }else{
            alert('There is no file to download!');
        }
    }

    return <button className="absolute bottom-8 right-8 disabled:text-gray-700 disabled:cursor-not-allowed" onClick={handleDownload} disabled={isFetching}>Download</button>
}
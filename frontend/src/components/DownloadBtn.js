export default function DownloadBtn ({imageUrl}) {
    function handleDownload () {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'output.jpg';
        link.click();
    }

    return <button className="absolute bottom-8 right-8" onClick={handleDownload}>Download</button>
}
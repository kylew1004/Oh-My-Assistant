export async function fetchOutput() {

    // const response = await fetch('url',{
    //     method: 'POST',
    //     body: {},
    // });
    // const resData = await response.json();

    // if(!response.ok) {
    //     throw new Error('Failed to load image');
        
    // }
   
    // //이 부분 상의
    // return resData.imgUrl;

    await new Promise(resolve => setTimeout(resolve, 3000));
    // throw new Error('Failed to load image');
    return 'https://global.discourse-cdn.com/business7/uploads/glideapps/original/2X/4/4936e0f28f79c8a2aa95582741091356d0ed61d8.jpeg'

}

export async function postInput(image) {
    // const formData = new FormData();
    // formData.append('image', image);

    // const response = await fetch('url',{
    //     method: 'POST',
    //     body: formData,
    //     headers: {'Content-Type': 'multipart/form-data'}
    // });

    // const resData = await response.json();

    // if(!response.ok){
    //     throw new Error('Failed to send image');
    // }

    // return resData.message;

    return 'ok';
}
const ALLOW_EXTENSION = ['jpg','jpeg','png'];

export function validateExt(imgFile){
    const extension=imgFile.name.split('.').pop();
    return ALLOW_EXTENSION.includes(extension.toLowerCase());
}


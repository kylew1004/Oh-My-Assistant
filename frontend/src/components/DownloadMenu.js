import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import downloadIcon from '../assets/download.svg';
import {useState} from 'react';
import {deleteWebtoon, deletePoseAsset, deleteBackgroundAsset } from '../util/http.js';
import {redirect, useNavigate} from 'react-router-dom';
import JSZip from 'jszip';

export default function DeleteMenu({activeImage, loadedAsset}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate()

    const handleClick = (event) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    };

    async function handleClose(event){
      event.preventDefault();
      setAnchorEl(null);
    };

    function handleDownload (imgObject) {
      if(imgObject){
          if(typeof imgObject ==='string'){
              const link = document.createElement('a');
              link.href = imgObject;
              link.download = 'output.jpg';
              link.click();
          }else{
              const zip = new JSZip();
              const folderName = 'output'; // Name of the folder in the zip file

              if(imgObject.characterImgUrl){
                  fetch(imgObject.characterImgUrl,{method:'GET',mode:'no-cors'})
                      .then(response => response.blob())
                      .then(blob => zip.folder(folderName).file('output_image', blob))
                      .then(() => {
                          fetch(imgObject.poseImgUrl,{method:'GET',mode:'no-cors'})
                          .then(response => response.blob())
                          .then(blob => zip.folder(folderName).file('pose_image', blob))  
                      })
                      .then(()=>{
                          // Generate the zip file and download it
                          zip.generateAsync({ type: 'blob' })
                              .then(content => {
                                  const link = document.createElement('a');
                                  link.href = URL.createObjectURL(content);
                                  link.download = 'output.zip';
                                  link.click();
                              });
                      });

              }

              // Iterate through each image URL and add it to the zip folder
              // imageUrls.forEach((imageUrl, index) => {
              //     const filename = `image_${index + 1}.jpg`; // Name of the image file
              //     fetch(imageUrl)
              //         .then(response => response.blob())
              //         .then(blob => zip.folder(folderName).file(filename, blob))
              //         .then(() => {
              //             // Check if all images have been added to the zip folder
              //             if (index === imageUrls.length - 1) {
              //                 // Generate the zip file and download it
              //                 zip.generateAsync({ type: 'blob' })
              //                     .then(content => {
              //                         const link = document.createElement('a');
              //                         link.href = URL.createObjectURL(content);
              //                         link.download = 'images.zip';
              //                         link.click();
              //                     });
              //             }
              //         });
              // });

          }
      }else{
          alert('There is no image selected!');
      }
  }

    async function handleDownloadClick(event,imageObject){
      await handleClose(event);
      handleDownload(imageObject);      
    };
  
    return (
      <>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          className="flex w-auto p-0"
        >
         <img className="h-[80%] m-auto" src={downloadIcon}/>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={(event)=>handleDownloadClick(event,activeImage)}><p>Download current image</p></MenuItem>
          <MenuItem onClick={(event)=>handleDownloadClick(event,loadedAsset)}><p>Download all</p></MenuItem>
        </Menu>
      </>
    );
  }
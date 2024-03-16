import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import menuIcon from '../assets/dot-menu-more-svgrepo-com.svg';
import {useState} from 'react';
import {deleteWebtoon} from '../util/http.js';
import {redirect, useNavigate} from 'react-router-dom';

export default function DeleteMenu({subject}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate()

    const handleClick = (event) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    };

    async function handleDeleteWebtoon(webtoon){
        const result = await deleteWebtoon({
            webtoonName: webtoon,
        });

        if(result==='tokenError') return redirect('/auth');
        navigate('.', { replace: true });
    }

    async function handleDelete(event){
      await handleClose(event);

      if(subject.webtoonName){
        await handleDeleteWebtoon(subject.webtoonName);
      }
    };

    async function handleClose(event){
        event.preventDefault();
        setAnchorEl(null);
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
         <img className="h-full m-auto" src={menuIcon}/>
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
          <MenuItem onClick={handleDelete}><p className="text-red-700">Delete</p></MenuItem>
        </Menu>
      </>
    );
  }
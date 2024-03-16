import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import menuIcon from '../assets/dot-menu-more-svgrepo-com.svg';
import {useState} from 'react';

export default function DeleteMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
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
          <MenuItem onClick={handleClose}><p className="text-red-700">Delete</p></MenuItem>
        </Menu>
      </>
    );
  }
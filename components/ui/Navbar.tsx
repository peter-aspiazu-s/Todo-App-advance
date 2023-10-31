import { useContext } from 'react';
import NextLink from 'next/link';

import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

import { UIContext } from '../../context/ui';

export const Navbar = () => {

  const { openSideMenu } = useContext( UIContext );


  return (
      <AppBar position='sticky'>
          <Toolbar>
              {/* <IconButton 
                size='large'
                edge="start"
                onClick={ openSideMenu }
              >
                  <MenuOutlinedIcon />
              </IconButton> */}

              <NextLink href="/" passHref>
                <Link underline='none' color="white">
                   <Typography variant='h6'>OpenJira</Typography>
                </Link>
              </NextLink>
          </Toolbar>
      </AppBar>
  )
};

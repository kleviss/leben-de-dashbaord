import * as React from 'react';

import Drawer, { drawerClasses } from '@mui/material/Drawer';

import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CardAlert from './CardAlert';
import Divider from '@mui/material/Divider';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function SideMenuMobile({ open, toggleDrawer }) {
  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          [`& .${drawerClasses.paper}`]: {
            backgroundImage: 'none',
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Typography
          variant='h6'
          sx={{
            p: 2,
            color: 'text.secondary',
            fontSize: '16px',
            maxWidth: '20dvw',
            position: 'absolute',
            top: 270,
            left: 30,
          }}
          // center text
          align='center'
        >
          Mobile menu under development... but you can find everything in the sidemenu for now 😊
          <Typography
            variant='h6'
            sx={{
              fontSize: '12px',
              mt: 2,
              border: '1px solid gray',
              borderRadius: 1,
              maxWidth: '12dvw',
              display: 'inline-block',
              px: 2,
              py: 1,
              backgroundColor: '#f0f0f0',
            }}
          >
            PRESS [ESC] TO CLOSE or click outside
          </Typography>
        </Typography>
        {/* <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 2,
            backdropFilter: 'blur(4px)',
          }}
          open={open}
        >
          <Typography variant='h6' sx={{ p: 2 }}>
            Mobile menu under development... but you can find everything in the sidemenu for now 😊
          </Typography>
        </Backdrop> */}
        <Stack
          sx={{
            maxWidth: '70dvw',
            height: '100%',
            filter: open ? 'blur(4px)' : 'none',
          }}
        >
          <Stack direction='row' sx={{ p: 2, pb: 0, gap: 1 }}>
            <Stack direction='row' sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}>
              <Avatar
                sizes='small'
                alt='Riley Carter'
                src='/static/images/avatar/7.jpg'
                sx={{ width: 24, height: 24 }}
              />
              <Typography component='p' variant='h6'>
                Riley Carter
              </Typography>
            </Stack>
            <MenuButton showBadge>
              <NotificationsRoundedIcon />
            </MenuButton>
          </Stack>
          <Divider />
          <Stack sx={{ flexGrow: 1 }}>
            <MenuContent />
            <Divider />
          </Stack>
          <CardAlert />
          <Stack sx={{ p: 2 }}>
            <Button variant='outlined' fullWidth startIcon={<LogoutRoundedIcon />}>
              Logout
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;

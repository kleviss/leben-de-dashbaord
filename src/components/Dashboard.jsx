import * as React from 'react';

import {
  chartsCustomizations,
  dataGridCustomizations,
  treeViewCustomizations,
} from '../theme/customizations/index.js';

import AppNavbar from './AppNavbar.jsx';
import AppTheme from '../shared-theme/AppTheme.js';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';
import SideMenu from './SideMenu.jsx';
import { styled } from '@mui/material/styles';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...treeViewCustomizations,
};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${240}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    ...(!open && {
      marginLeft: `${65}px`,
      width: `calc(100% - ${65}px)`,
    }),
  })
);

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <AppTheme themeComponents={xThemeComponents}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppNavbar open={open} handleDrawerOpen={handleDrawerToggle} />
        <SideMenu open={open} handleDrawerToggle={handleDrawerToggle} />
        <Main open={open}>
          <Outlet />
        </Main>
      </Box>
    </AppTheme>
  );
}

import * as React from 'react';

import {
  chartsCustomizations,
  dataGridCustomizations,
  treeViewCustomizations,
} from '../theme/customizations/index.js';

import AppNavbar from './AppNavbar.jsx';
import AppTheme from '../shared-theme/AppTheme.js';
import Box from '@mui/material/Box';
import CategoriesManagement from './CategoriesManagement.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import Overview from './Overview.jsx';
import QuestionsManagement from './QuestionsManagement.jsx';
import SideMenu from './SideMenu.jsx';
import { styled } from '@mui/material/styles';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  // ...datePickersCustomizations,
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
  const [currentView, setCurrentView] = React.useState('overview');

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <AppTheme themeComponents={xThemeComponents}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppNavbar
          // @ts-ignore
          open={open}
          handleDrawerOpen={handleDrawerToggle}
        />
        <SideMenu
          open={open}
          handleDrawerToggle={handleDrawerToggle}
          setCurrentView={setCurrentView}
        />
        <Main
          // @ts-ignore
          open={open}
        >
          {currentView === 'overview' && <Overview />}
          {currentView === 'categories' && <CategoriesManagement />}
          {currentView === 'questions' && <QuestionsManagement />}
        </Main>
      </Box>
    </AppTheme>
  );
}

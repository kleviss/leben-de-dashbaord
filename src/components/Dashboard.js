import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppNavbar from './AppNavbar.js';
import SideMenu from './SideMenu.js';
import Overview from './Overview.js';
import CategoriesManagement from './CategoriesManagement';
import QuestionsManagement from './QuestionsManagement';
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  // datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';

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
        <AppNavbar open={open} handleDrawerOpen={handleDrawerToggle} />
        <SideMenu
          open={open}
          handleDrawerToggle={handleDrawerToggle}
          setCurrentView={setCurrentView}
        />
        <Main open={open}>
          {currentView === 'overview' && <Overview />}
          {currentView === 'categories' && <CategoriesManagement />}
          {currentView === 'questions' && <QuestionsManagement />}
        </Main>
      </Box>
    </AppTheme>
  );
}

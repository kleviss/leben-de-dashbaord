import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import image from '../assets/lebede.png';
import smallImage from '../assets/lebede-small.png';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import Typography from '@mui/material/Typography';
const drawerWidth = 240;
const collapsedDrawerWidth = 65;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: collapsedDrawerWidth,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? drawerWidth : collapsedDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

export default function SideMenu({ open, handleDrawerToggle, setCurrentView }) {
  const theme = useTheme();
  const logo = open ? image : smallImage;

  return (
    <StyledDrawer variant='permanent' open={open}>
      <DrawerHeader>
        <div
          style={{
            padding: '20px',
            flexGrow: 1,
            display: 'flex',
            justifyContent: open ? 'flex-start' : 'center',
          }}
        >
          <img src={logo} alt='logo' width={open ? 110 : 30} height={open ? 25 : 30} />
        </div>
        <IconButton
          onClick={handleDrawerToggle}
          size={open ? 'medium' : 'small'}
          sx={{ ml: open ? '-10px' : 'auto' }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {[
          { text: 'Overview', icon: <DashboardIcon />, view: 'overview' },
          { text: 'Categories', icon: <CategoryIcon />, view: 'categories' },
          { text: 'Questions', icon: <QuestionAnswerIcon />, view: 'questions' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => setCurrentView(item.view)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  ml: !open ? 1 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <div
          style={{
            padding: open ? '0px' : '10px',
            paddingLeft: open ? '0px' : '50px',
            marginTop: open ? '12px' : '0px',
            display: 'flex',
            justifyContent: open ? 'flex-start' : 'center',
          }}
        >
          <ColorModeIconDropdown />
          <Typography
            variant='subtitle2'
            sx={{ opacity: open ? 1 : 0, alignSelf: 'center', ml: 1 }}
          >
            Theme
          </Typography>
        </div>
      </List>
    </StyledDrawer>
  );
}

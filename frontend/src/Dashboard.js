import React, { useEffect, useRef } from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import GitHubIcon from '@material-ui/icons/GitHub';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Table from './Table';
import Filters from './Filters';
import { func } from 'prop-types';

function Source() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://github.com/n3wscott/sockeye-react">
        <GitHubIcon/>
      </Link>
    </Typography>
  );
}

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(0),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  sockeyeLogo: {
    height: 60,
    paddingRight: 80,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function Dashboard(props) {
  const events = props.items;

  const endRef = useRef(null)

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [scrollLock, setScrollLock] = React.useState(true);

  const [filter, setFilter] = React.useState([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleScrollLock = () => {
    setScrollLock(!scrollLock);
    if (scrollLock) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  };

  const handleWheel = (e) => {
    if (scrollLock) {
      setScrollLock(false);
    }
  };

  // After render.
  useEffect(() => {
    if (scrollLock) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  });

  let ScrollLockIcon = LockIcon;
  if (!scrollLock) {
    ScrollLockIcon = LockOpenIcon;
  }

  return (
    <div className={classes.root} onWheel={handleWheel}>
      <CssBaseline />
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleScrollLock}>
        <ScrollLockIcon />
      </Fab>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Sockeye
          </Typography>
          <IconButton color="inherit">
            <ClearAllIcon />
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={events.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <img className={classes.sockeyeLogo} alt={""} src="http://sockeye.default.20.190.7.108.xip.io/static/assets/sockeye-logo.png" />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <Filters onChange={(event, newFilter) => {
          console.log(newFilter)
          setFilter(newFilter);
        }}/>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Paper>
            <Table items={events} filter={filter}/>
          </Paper>
          
          <div ref={endRef} />

          <Box pt={4}>
            <Source />
          </Box>
        </Container>
      </main>
    </div>
  );
}

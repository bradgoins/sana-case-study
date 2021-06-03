import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
} from "@material-ui/core";
import { Person, ExitToApp, Build } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
}));

function TopBar(props) {    
  const history = useHistory();
  const classes = useStyles();

  const [drawer, setDrawer] = React.useState({
    left: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer({ ...drawer, left: open });
  };

  const logout = () => {
    if (props.userUpdated) {
      props.userUpdated({});
    }

    history.push('/login');
  };

  const navigateToProfile = () => {
    history.push("/profile");
  }

  const navigateToTool = () => {
    history.push("/");
  };

  setTimeout( () => {
    if (!props.user.token) {
        history.push("/login");
    }
  })

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {props.user.token ? `Welcome ${props.user.name}` : ""}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawer.left} onClose={toggleDrawer(false)}>
        <div className={classes.list}>
          <List>
            <ListItem button key="Tool" onClick={navigateToTool}>
              <ListItemIcon>
                <Build />
              </ListItemIcon>
              <ListItemText primary="Tool" />
            </ListItem>
            <ListItem button key="Profile" onClick={navigateToProfile}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <Divider />
            <ListItem button key="Logout" onClick={logout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default TopBar;

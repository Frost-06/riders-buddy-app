import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import clsx from "clsx";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { history } from "../App";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Popover from "@material-ui/core/Popover";
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonBase,
  Icon,
  ListItemAvatar,
} from "@material-ui/core";
import UserContext from "../context/UserContext";
import logout from "../utils/logout";
import NotificationContext from "../context/NotificationContext";
import CartContext from "../context/CartContext";
import OrderContext from "../context/OrderContext";
import BottomNavContext from "../context/BottomNavContext";

export default function Layout(props) {
  const { userContext, setUserContext } = useContext(UserContext);
  const { notificationContext, setNotificationContext } =
    useContext(NotificationContext);
  const [pathname, setPathname] = useState("/");
  const { cartContext, setCartContext } = useContext(CartContext);
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { bottomNavContext } = useContext(BottomNavContext);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const attemptLogout = useCallback(() => {
    logout(() => {
      setUserContext({});
      setNotificationContext({
        ...notificationContext,
        isFetched: false,
      });
      setCartContext({
        ...cartContext,
        isFetched: false,
      });
      setOrderContext({
        ...orderContext,
        isFetched: false,
      });
      window.location.reload();
    }, userContext);
  }, [userContext, notificationContext, cartContext, orderContext]);
  useEffect(() => {
    theme.palette.type = "dark";
  }, []);
  useEffect(() => {
    setPathname(window.location.pathname);
  }, [window.location.pathname]);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Box flexGrow={1}>
            <img
              src="/static/images/logo/horizontal-white.png"
              height={40}
              width="auto"
              alt="Riders Buddy"
            />
          </Box>
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <IconButton
                  style={{ color: "#fff" }}
                  {...bindTrigger(popupState)}
                >
                  <Icon>expand_more</Icon>
                </IconButton>

                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <List component={Box}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src="/" alt={userContext.user_fname} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          userContext.user_fname + " " + userContext.user_lname
                        }
                        secondary={userContext.user_email}
                      />
                    </ListItem>
                    <ListItem onClick={attemptLogout} component={ButtonBase}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </List>
                </Popover>
              </div>
            )}
          </PopupState>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {props.drawerRoutes?.map((route, index) => {
            return (
              <ListItem
                button
                onClick={() => {
                  setPathname(route.url);
                  history.push(route.url);
                }}
                key={index}
                selected={route.url === pathname}
              >
                <ListItemIcon style={{ marginLeft: 8 }}>
                  <Icon>{route.icon}</Icon>
                  {bottomNavContext.notifications[route.value] &&
                  bottomNavContext.notifications[route.value] > 0 ? (
                    <Badge
                      badgeContent={bottomNavContext.notifications[route.value]}
                      color="error"
                    />
                  ) : null}
                </ListItemIcon>
                <ListItemText primary={route.label} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <main className={classes.content}>
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          overflow="auto"
        >
          <div className={classes.toolbar} />
          {props.children}
        </Box>
      </main>
    </div>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
  },
}));

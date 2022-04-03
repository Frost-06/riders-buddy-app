import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { history } from "../../App";
import CartContext from "../../context/CartContext";
import NotificationContext from "../../context/NotificationContext";
import OrderContext from "../../context/OrderContext";
import UserContext from "../../context/UserContext";
import logout from "../../utils/logout";
import Address from "../Address";

export default function SecondHeader(props) {
  const ucontext = useContext(UserContext);
  const { userContext } = ucontext;
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const profile = useContext(UserContext);
  const { setNotificationContext, notificationContext } =
    useContext(NotificationContext);
  const { setOrderContext, orderContext } = useContext(OrderContext);
  const { setCartContext, cartContext } = useContext(CartContext);
  const { user_fname, user_lname, user_email, user_avatar } =
    profile.userContext;
  const menu = useMemo(
    () => [
      {
        callback: () =>
          logout(() => {
            profile.setUserContext({});
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
          }, profile.userContext),
        title: "Logout",
      },
    ],
    []
  );

  const ListMenu = useCallback(
    (m, index) => (
      <ListItem
        button
        style={{ padding: 24 }}
        key={index}
        onClick={() => {
          m.callback && m.callback();
          m.url && props.history.push(m.url);
        }}
      >
        <ListItemIcon>
          <img src={"/assets/log-out.svg"} alt="prof" />
        </ListItemIcon>
        <Typography style={{ fontWeight: "bold" }}>Log-out</Typography>
        <ListItemText style={{ fontWeight: "bold" }}></ListItemText>
      </ListItem>
    ),
    []
  );

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        width:
          anchor === "top" || anchor === "bottom"
            ? "auto"
            : 400 || isMd
            ? 360
            : "",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Container
        style={{ marginTop: 40, width: "360px", overflow: "hidden !important" }}
      >
        <Box style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <img
            src={"/assets/user-icon.svg"}
            style={{ width: "25%" }}
            alt="prof"
          />
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" style={{ fontWeight: "700" }}>
              {userContext?.user_fname} {userContext?.user_lname}
            </Typography>
            <Link
              variant="caption"
              style={{ fontWeight: "700 !important", color: "#1AA3E9" }}
            >
              View account
            </Link>
          </Box>
        </Box>
        {/* Navigation */}
        <Box>
          <List style={{ display: "flex", flexDirection: "column" }}>
            <ListItem
              button
              href="/orders"
              style={{ padding: 24 }}
              onClick={() => history.push("/orders")}
            >
              <ListItemIcon>
                <img src={"/assets/my-orders.svg"} alt="prof" />
              </ListItemIcon>
              <Typography style={{ fontWeight: "bold" }}>My Orders</Typography>
            </ListItem>

            <ListItem button style={{ padding: 24 }}>
              <ListItemIcon>
                <img src={"/assets/my-favourites.svg"} alt="prof" />
              </ListItemIcon>
              <Typography style={{ fontWeight: "bold" }}>
                My Favourites
              </Typography>
            </ListItem>

            <ListItem button style={{ padding: 24 }}>
              <ListItemIcon>
                <img src={"/assets/my-vouchers.svg"} alt="prof" />
              </ListItemIcon>
              <Typography style={{ fontWeight: "bold" }}>Vouchers</Typography>
            </ListItem>
            {menu.map((m, i) => ListMenu(m, i))}
          </List>
          <Box>
            <Divider style={{ marginTop: "32px" }} />
          </Box>
          <List>
            {["About us", "Seller Center", "Help Center"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );

  return (
    <>
      <SwipeableDrawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}
      >
        {list("left")}
      </SwipeableDrawer>
      <motion.header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          margin: isMd ? "" : "0 -251px",
          display: "flex",
        }}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <AppBar
          position="static"
          color="transparent"
          style={{ minWidth: isMd ? 360 : 1400, display: "flex" }}
        >
          <Box>
            <Toolbar
              style={{
                margin: "0 auto",
                justifyContent: "sapce-between",
              }}
            >
              {isMd ? (
                ""
              ) : (
                <IconButton
                  size="large"
                  color="primary"
                  sx={{ mr: 2 }}
                  onClick={toggleDrawer("left", true)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="6"
                      width="18"
                      height="2"
                      rx="1"
                      fill="#1AA3E9"
                    />
                    <rect
                      x="3"
                      y="16"
                      width="18"
                      height="2"
                      rx="1"
                      fill="#1AA3E9"
                    />
                    <rect
                      x="3"
                      y="11"
                      width="14"
                      height="2"
                      rx="1"
                      fill="#76C8F2"
                    />
                  </svg>
                </IconButton>
              )}
              <Box style={{ flexGrow: 1 }}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: isMd ? "column" : "",
                    alignItems: isMd ? "center" : "",
                  }}
                >
                  <Link href="/">
                    <img
                      src="/assets/riders-buddy-horizontal-logo.svg"
                      width={isMd ? 200 : 220}
                      alt=""
                      style={{ marginRight: "40px" }}
                    />
                  </Link>
                  <Address />
                </Box>
              </Box>
              {isMd ? (
                ""
              ) : (
                <>
                  <a
                    href="/notifications"
                    style={{ marginRight: 40, width: "-25%" }}
                  >
                    <img
                      src="/assets/notifications.svg"
                      height="30"
                      alt="notification-icon"
                    />
                  </a>
                  <a href="/cart" style={{ marginRight: 24, width: "-25%" }}>
                    <img src="/assets/cart.svg" height="35" alt="cart-icon" />
                  </a>
                </>
              )}
            </Toolbar>
          </Box>
        </AppBar>
      </motion.header>
    </>
  );
}

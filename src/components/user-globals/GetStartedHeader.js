import {
  AppBar,
  Badge,
  Box,
  Button,
  ButtonBase,
  Container,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Tab,
  Tabs,
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

import { WebCart } from "../../screens/services/Cart";
import logout from "../../utils/logout";
import Address from "../Address";
import PropTypes from "prop-types";
import AnimateOnTap from "../AnimateOnTap";
import SwipeableViews from "react-swipeable-views";
import Notifications, {
  WebNotifications,
} from "../../screens/home/Notifications";
import BottomNavContext from "../../context/BottomNavContext";
import { Block } from "../../screens/home";
import { Price } from "../Product";
import CurrencyFormat from "react-currency-format";
import SavingButton from "../SavingButton";

export default function SecondHeader(props) {
  const { bottomNavContext } = useContext(BottomNavContext);
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
            window.location.reload();
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

  const [notifState, setNotifState] = React.useState({
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

  const notifToggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setNotifState({ ...notifState, [anchor]: open });
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
              <Typography style={{ fontWeight: "bold" }}>
                My Activities
              </Typography>
            </ListItem>

            {menu.map((m, i) => ListMenu(m, i))}
          </List>
          <Box>
            <Divider style={{ marginTop: "32px" }} />
          </Box>
          <List>
            {["Help Center"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );

  const [tabValue, setTabValue] = useState(0);

  const cartList = (anchor) => (
    <Box
      style={{
        width: 464,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* <WebNotifications /> */}
      <Container
        style={{
          height: 96,
          backgroundColor: "#1AA3E9",
          display: "flex",
          alignItems: "center",
        }}
      >
        <AnimateOnTap>
          <ButtonBase onClick={toggleDrawer(anchor, false)}></ButtonBase>
        </AnimateOnTap>
        <Typography
          variant="h4"
          style={{ margin: "auto", fontWeight: 700, color: "#fff" }}
        >
          Cart
        </Typography>
      </Container>
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Box m={1} style={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            fullWidth
            onChange={(e, val) => setTabValue(val)}
            sx={{
              width: "100%",
            }}
          >
            <Tab label={<AnimateOnTap>Products</AnimateOnTap>} />
            <Tab label={<AnimateOnTap>Services</AnimateOnTap>} />
          </Tabs>
        </Box>
      </Box>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => setTabValue(index)}
      >
        <Container>
          <Block title="Your Orders" p={0}>
            <WebCart type="simple" />
          </Block>
        </Container>
        <Container>
          <Block title="Your Bookings" p={0}>
            <WebCart type="external" />
          </Block>
        </Container>
      </SwipeableViews>
      <Container>
        <Block
          title={
            <React.Fragment>
              Total&nbsp;
              <span style={{ color: "#000" }}>
                {cartContext.products.length} Item(s)
              </span>
            </React.Fragment>
          }
          p={0}
        >
          <Price>
            <CurrencyFormat
              value={cartContext.total}
              displayType={"text"}
              thousandSeparator={true}
            />
          </Price>
          <br />
          <br />
          <SavingButton
            className="themed-button"
            // startIcon={<Icon>https</Icon>}
            onClick={() =>
              history.push({
                pathname: "/checkout",
                state: {
                  service_name: "e-pagkain",
                },
              })
            }
          >
            <Typography>Proceed to Checkout</Typography>
          </SavingButton>
        </Block>
      </Container>
    </Box>
  );

  const notificationList = (anchor) => (
    <Box
      style={{
        width: 464,
      }}
      role="presentation"
      onClick={notifToggleDrawer(anchor, true)}
      onKeyDown={notifToggleDrawer(anchor, false)}
    >
      <Container
        style={{
          height: 96,
          backgroundColor: "#1AA3E9",
          display: "flex",
          alignItems: "center",
        }}
      >
        <AnimateOnTap>
          <ButtonBase onClick={notifToggleDrawer(anchor, false)}></ButtonBase>
        </AnimateOnTap>
        <Typography
          variant="h4"
          style={{ margin: "auto", fontWeight: 700, color: "#fff" }}
        >
          Notifications
        </Typography>
      </Container>
      <WebNotifications />
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

      <SwipeableDrawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        {cartList("right")}
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor={"right"}
        open={notifState["right"]}
        onClose={notifToggleDrawer("right", false)}
        onOpen={notifToggleDrawer("right", true)}
      >
        {notificationList("right")}
      </SwipeableDrawer>
      <motion.header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          margin: isMd ? "" : "",
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
                ></IconButton>
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
                </Box>
              </Box>
              <Box
                style={{
                  display: "inline-flex",
                  justifyContent: "space-between",
                  width: "220px",
                }}
              >
                <AnimateOnTap>
                  <Button
                    variant="outlined"
                    className="themed-button"
                    color="primary"
                    onClick={() => history.push("/register")}
                  >
                    Get Started
                  </Button>
                </AnimateOnTap>
                <AnimateOnTap>
                  <Button
                    variant="contained"
                    className="themed-button inverted"
                    color="primary"
                    onClick={() => history.push("/login")}
                  >
                    Sign in
                  </Button>
                </AnimateOnTap>
              </Box>
            </Toolbar>
          </Box>
        </AppBar>
      </motion.header>
    </>
  );
}

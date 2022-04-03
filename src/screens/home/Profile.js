import {
  Avatar,
  Box,
  ButtonBase,
  Container,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import AnimateOnTap from "../../components/AnimateOnTap";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import CartContext from "../../context/CartContext";
import NotificationContext from "../../context/NotificationContext";
import OrderContext from "../../context/OrderContext";
import UserContext from "../../context/UserContext";
import { slideRight } from "../../misc/transitions";
import logout from "../../utils/logout";

function Profile(props) {
  const theme = useTheme();
  const bcontext = useContext(BottomNavContext);
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
        icon: <span className="icon-cart-alt md"></span>,
        url: "/orders",
        title: "My Orders",
      },
      {
        icon: <span className="icon-location-alt md"></span>,
        url: "/address",
        title: "Addresses",
      },
      {
        icon: <span className="icon-logout-alt md"></span>,
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
        key={index}
        onClick={() => {
          m.callback && m.callback();
          m.url && props.history.push(m.url);
        }}
      >
        <AnimateOnTap
          className="list"
          parentComponent={ButtonBase}
          parentProps={{
            style: {
              width: "100%",
              textAlign: "left",
            },
          }}
        >
          <ListItemIcon>
            {typeof m.icon === "string" ? <Icon>{m.icon}</Icon> : m.icon}
          </ListItemIcon>
          <ListItemText primary={m.title} />
        </AnimateOnTap>
      </ListItem>
    ),
    []
  );
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
  }, []);
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideRight}
      className="profile-screen"
      style={{ padding: theme.spacing(3) }}
    >
      <Container>
        <ScreenHeader
          title={
            <Box className="center-align">
              <Box marginRight={2}>
                <Avatar
                  src={user_avatar}
                  alt={user_fname}
                  style={{ width: 50, height: 50 }}
                />
              </Box>
              <Box>
                <Typography color="primary" className="name">
                  {user_fname} {user_lname}
                </Typography>
                <Typography className="email">{user_email}</Typography>
              </Box>
            </Box>
          }
        />
        <Box>
          <List className="themed-list">
            {menu.map((m, i) => ListMenu(m, i))}
          </List>
        </Box>
      </Container>
    </motion.div>
  );
}

export default Profile;

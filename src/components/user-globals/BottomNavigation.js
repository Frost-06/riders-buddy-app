import {
  Badge,
  BottomNavigation as BottomNav,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import BottomNavContext from "../../context/BottomNavContext";
import CartContext from "../../context/CartContext";
import UserContext from "../../context/UserContext";
import { slideBottom } from "../../misc/transitions";
import { bottomNavRoutes } from "../../Routes";
function BottomNavigation(props) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const history = useHistory();
  const bcontext = useContext(BottomNavContext);
  const { userContext } = useContext(UserContext);
  const { cartContext } = useContext(CartContext);
  const { bottomNavContext, setBottomNavContext } = bcontext;
  const [selected, setSelected] = useState("");
  const menu = useMemo(
    () =>
      (userContext?.user_type?.name === "driver"
        ? bottomNavRoutes.driver
        : userContext?.user_type?.name === "customer"
        ? bottomNavRoutes.customer
        : []
      ).map((q) =>
        q.value === selected ? { ...q, icon: q.icon.replace("-alt", "") } : q
      ),
    [selected]
  );
  useEffect(() => {
    let found = false;
    menu.forEach((m) => {
      const currentUrl = window.location.pathname;
      if (m.url === currentUrl) {
        setSelected(m.value);
        found = m.value;
      } else if (m.relatedUrls) {
        m.relatedUrls.forEach((mm) => {
          if (mm === currentUrl) {
            setSelected(m.value);
            found = m.value;
          }
        });
      }
    });
    if (!found) setSelected("");
    else setSelected(found);
  }, [window.location.pathname, menu]);

  useEffect(() => {
    if (cartContext.products) {
      setBottomNavContext({
        ...bottomNavContext,
        visible: true,
        notifications: {
          ...bottomNavContext.notifications,
          cart: cartContext.products.length,
        },
      });
    }
  }, [cartContext.products]);
  return bcontext.bottomNavContext?.visible && menu.length ? (
    <motion.div
      initial="initial"
      exit="out"
      animate="in"
      variants={slideBottom}
      className="bottom-navigation"
    >
      {isMd ? (
        <BottomNav value={selected} onChange={(evt, val) => setSelected(val)}>
          {menu.map((m, index) => {
            return (
              <BottomNavigationAction
                onClick={() => {
                  history.push(m.url);
                }}
                icon={<NotificationBadge m={m} />}
                label={m.label}
                value={m.value}
                key={m.value}
              />
            );
          })}
        </BottomNav>
      ) : (
        ""
      )}
    </motion.div>
  ) : null;
}
function NotificationBadge(props) {
  const { m } = props;
  const { bottomNavContext } = useContext(BottomNavContext);
  return true ? (
    <Badge badgeContent={bottomNavContext.notifications[m.value]} color="error">
      <span
        className={m.icon}
        {...(m.iconStyle ? { style: m.iconStyle } : {})}
      />
    </Badge>
  ) : (
    <span className={m.icon} {...(m.iconStyle ? { style: m.iconStyle } : {})} />
  );
}

export default BottomNavigation;

import {
  Avatar,
  Box,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import SwipeableViews from "react-swipeable-views";
import AnimateOnTap from "../../components/AnimateOnTap";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import moment from "moment";
import { history } from "../../App";
import EmptyListMessage from "../../components/EmptyListMessage";
import NotificationContext from "../../context/NotificationContext";
import { slideRight } from "../../misc/transitions";
import { Block } from ".";
import { getOR } from "../services/Checkout";
import UserContext from "../../context/UserContext";

function Notifications(props) {
  const bcontext = useContext(BottomNavContext);
  const { notificationContext, setNotificationContext } =
    useContext(NotificationContext);
  const [tabValue, setTabValue] = useState(0);
  const { loadingScreen, setLoadingScreen } = useContext(LoadingScreenContext);
  const menu = useMemo(
    () => [
      { icon: "icon-coke-burger md", title: "E-Pagkain" },
      { icon: "icon-gift md", title: "E-Pasurprise" },
      { icon: "icon-task md", title: "E-Pasugo" },
      {
        icon: (
          <span className="icon-laundry md">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
            <span className="path6"></span>
          </span>
        ),
        title: "E-Palaba",
      },
      { icon: "icon-basket md", title: "E-Pabili" },
    ],
    []
  );
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({
      ...bottomNavContext,
      visible: true,
    });
    setLoadingScreen({
      ...loadingScreen,
      visible: true,
      variant: "notifications",
    });
    (async () => {
      await notificationContext.fetchNotifications(setNotificationContext);
      setLoadingScreen({ ...loadingScreen, visible: false, variant: null });
    })();
  }, []);
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideRight}
      style={{ height: "100%" }}
    >
      <Box p={3}>
        <ScreenHeader title="Notifications" />
      </Box>
      <Box m={3} marginTop={0} marginBottom={0}>
        <Tabs
          value={tabValue}
          fullWidth
          onChange={(e, val) => setTabValue(val)}
        >
          <Tab label={<AnimateOnTap>All</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Chat</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Unread</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Updates</AnimateOnTap>} />
        </Tabs>
      </Box>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => setTabValue(index)}
        style={{ paddingBottom: 50 }}
      >
        <Box height="100%">
          <Block title="Chat">
            <Notification type="chat" />
          </Block>
          <Block title="Riders Buddy">
            <Notification type="update" />
          </Block>
        </Box>
        <Box height="100%">
          <Block title="Chat">
            <Notification type="chat" />
          </Block>
        </Box>
        <Box height="100%">
          <Block title="Chat">
            <Notification type="chat" status={0} />
          </Block>
        </Box>
        <Box height="100%">
          <Block title="Riders Buddy">
            <Notification type="update" />
          </Block>
        </Box>
      </SwipeableViews>
    </motion.div>
  );
}

function Notification(props) {
  const { notificationContext } = useContext(NotificationContext);
  const notifications = useMemo(
    () =>
      notificationContext?.notifications
        .filter((q) => q.notif_type === props.type)
        .filter((q) =>
          props.status !== undefined
            ? parseInt(q.viewed) === props.status
            : true
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [notificationContext]
  );
  return (
    <Box>
      {!notifications?.length ? (
        <EmptyListMessage>Empty</EmptyListMessage>
      ) : null}
      <List>
        {notifications?.map((notification, index) => (
          <ListItem
            divider
            key={index}
            className={
              "notification " + (notification.viewed ? "read" : "unread")
            }
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <NotificationCard {...notification} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export function NotificationCard(props) {
  const { userContext } = useContext(UserContext);
  const {
    notif_meta,
    notif_action,
    order_id,
    viewed,
    created_at,
    notif_type,
    provider_name,
  } = props;
  const meta = JSON.parse(notif_meta);
  const Renderer = useCallback(() => {
    const render = {
      chat: (
        <AnimateOnTap
          whileTap={{ opacity: 0.5 }}
          style={{ width: "100%", cursor: "pointer" }}
          onClick={() => history.push(JSON.parse(notif_action))}
        >
          <Box justifyContent="flex-start" className="center-all">
            <Box marginRight={1}>
              <Avatar />
            </Box>
            <Box>
              <Typography variant="h6" style={{ fontWeight: 700 }}>
                {provider_name}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {meta.title.substr(0, meta.title.indexOf("#") + 1) +
                  getOR(order_id)}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                style={{ fontWeight: viewed ? "normal" : 700 }}
              >
                {meta.body?.length > 40
                  ? meta.body.substr(0, 40) + "..."
                  : meta.body}
              </Typography>
              <Box className="center-all" justifyContent="flex-start">
                {!viewed && <div className="unread-sign"></div>}
                <Typography style={{ fontSize: "0.8em" }}>
                  {moment(created_at).fromNow()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </AnimateOnTap>
      ),
      update: (
        <Box
          style={{ width: "100%", cursor: "pointer" }}
          onClick={() => {
            if (notif_action) {
              let m = JSON.parse(notif_action);
              if (m?.externalUrl) {
                window.open(m.pathname, "_blank");
              } else {
                delete m.externalUrl;
                if (m.pathname) history.push(JSON.parse(notif_action));
              }
            }
          }}
        >
          <Box justifyContent="flex-start" className="center-all">
            <Box marginRight={1}>
              <Avatar
                variant="square"
                src="/static/images/logo.png"
                style={{ marginRight: 16 }}
                alt="Ridersy Buddy"
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                style={{ fontWeight: 700 }}
                color="primary"
              >
                {meta.title}
              </Typography>
              <Typography
                variant="body2"
                style={{ fontWeight: viewed ? "normal" : 700 }}
              >
                {meta.body}
              </Typography>
              <Box className="center-all" justifyContent="flex-start">
                {!viewed && <div className="unread-sign"></div>}
                <Typography style={{ fontSize: "0.8em" }}>
                  {moment(created_at).fromNow()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ),
    };
    return render[notif_type] || null;
  }, [notif_type, props]);
  return Renderer();
}

export default Notifications;

import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Icon,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import UserContext from "../context/UserContext";
import DialogContext from "../context/DialogContext";
import Chat from "../models/Chat";
import moment from "moment";
import { goBackOrPush } from "../utils/goBackOrPush";
import { history } from "../App";
import PinMap from "./PinMap";
import { motion } from "framer-motion";
import { slideBottom } from "../misc/transitions";
import { Marker, StaticMap } from "react-map-gl";
import fetchData from "../utils/fetchData";
import Api from "../utils/api";
import BottomNavContext from "../context/BottomNavContext";
import NotificationContext from "../context/NotificationContext";

function ChatComponent(props) {
  const { order_id, consumer_user_id, provider_user_id } = props;
  const [participants, setParticipants] = useState(null);
  const { setDialogContext } = useContext(DialogContext);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectingMap, setSelectingMap] = useState(false);
  const chatRef = useRef();
  const chatMsgRef = useRef();
  const { userContext } = useContext(UserContext);
  const [sending, setSending] = useState([]);
  const receiver_id =
    consumer_user_id !== userContext.user_id
      ? consumer_user_id
      : provider_user_id;
  const focusNewMessage = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatRef]);
  const { bottomNavContext, setBottomNavContext } = useContext(
    BottomNavContext
  );
  const { notificationContext, setNotificationContext } = useContext(
    NotificationContext
  );
  const sendMessage = useCallback(async () => {
    if (participants?.length) {
      let sender_id = userContext.user_id;
      let message = {
        sender_id,
        receiver_id,
        chat_meta: JSON.stringify({
          message: chatMsgRef.current.value,
          type: "text",
        }),
      };
      setSending([...sending, message]);
      chatMsgRef.current.value = "";
      chatMsgRef.current.focus();
      await Chat.send(order_id, message);
    }
  }, [participants, userContext, sending]);
  const sendAddress = useCallback(
    async (address) => {
      if (participants?.length) {
        let sender_id = userContext.user_id;
        let message = {
          sender_id,
          receiver_id,
          chat_meta: JSON.stringify({
            address,
            type: "map",
          }),
        };
        setSelectingMap(false);
        chatMsgRef.current.value = "";
        chatMsgRef.current.focus();
        await Chat.send(order_id, message);
      }
    },
    [participants, userContext, sending]
  );
  const chatOptions = useCallback(() => {
    setDialogContext({
      visible: true,
      title: "Attachment",
      message: (
        <React.Fragment>
          <List>
            <ListItem
              component={ButtonBase}
              onClick={() => setSelectingMap(true)}
            >
              Location
            </ListItem>
          </List>
        </React.Fragment>
      ),
    });
  }, []);
  useEffect(() => {
    if (sending || selectingMap) {
      focusNewMessage();
    }
  }, [sending, selectingMap]);
  useEffect(() => {
    Chat.subscribe(order_id);
    (async () => {
      fetchData({
        send: async () =>
          await Api.post("/seen?token=" + Api.getToken(), {
            body: { order_id },
          }),
        after: (data) => {
          if (data?.notification && data.total) {
            let nextNotifications = { ...bottomNavContext.notifications };
            if (nextNotifications["notifications"]) {
              nextNotifications["notifications"] -= data.total;
            } else {
              nextNotifications["notifications"] = 0;
            }
            setBottomNavContext({
              ...bottomNavContext,
              visible: true,
              notifications: nextNotifications,
            });
            let nextNotifi = [...notificationContext.notifications];
            let index = nextNotifi.findIndex(
              (q) => q.order_id === data.notification.order_id
            );
            if (index >= 0) {
              nextNotifi[index] = {
                ...nextNotifi[index],
                ...data.notification,
              };
            }
            setNotificationContext({
              ...notificationContext,
              notifications: nextNotifi.map((q) =>
                parseInt(q.order_id) === parseInt(data.notification.order_id)
                  ? { ...q, viewed: 1 }
                  : q
              ),
            });
          }
        },
      });
      let chat = await Chat.get(order_id);
      const { participants, messages } = chat;
      if (messages) setMessages(messages);
      if (participants) {
        const partner = participants.find(
          (q) => q.user_id !== userContext.user_id
        );
        setParticipants(participants);
        if (props.setChatName) {
          props.setChatName({
            name: partner.user_fname,
            contact: partner.phone_number,
          });
        }
      }
      setLoading(false);
      focusNewMessage();
    })();
    return () => {
      Chat.unsubscribe(order_id);
    };
  }, []);
  useEffect(() => {
    Chat.listen((chat_meta) => {
      let nextSending = [...sending];
      let sendingIndex = nextSending.findIndex(
        (q) => q.chat_meta === chat_meta
      );
      if (sendingIndex >= 0) nextSending.splice(sendingIndex, 1);
      setSending(nextSending);
      setMessages([...messages, chat_meta]);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    });
  }, [messages]);

  return (
    <React.Fragment>
      {loading && <LinearProgress />}
      {!selectingMap && (
        <React.Fragment>
          <div className="chat-content" ref={chatRef}>
            {participants &&
              messages.map((message, index) => {
                const meta = JSON.parse(message.chat_meta);
                const user = participants.find(
                  (q) => q.user_id === message.sender_id
                );
                const position =
                  message.sender_id === userContext.user_id ? "right" : "left";
                const p = { meta, message, user, position };
                return <RenderMessage {...p} />;
              })}
            {sending.map((msg, index) => (
              <Preview {...msg} user={userContext} key={index} />
            ))}
          </div>
        </React.Fragment>
      )}
      <div className="chat-controls">
        <IconButton color="primary" onClick={chatOptions}>
          <Icon>add_circle</Icon>
        </IconButton>
        <TextField
          inputRef={chatMsgRef}
          onKeyDown={({ key }) => {
            if (key === "Enter") sendMessage();
          }}
          className="themed-input"
          variant="outlined"
        />
        <IconButton onClick={sendMessage} color="primary">
          <Icon>send</Icon>
        </IconButton>
      </div>

      {selectingMap && chatMsgRef && (
        <motion.div
          variants={slideBottom}
          animate="in"
          initial="initial"
          exit="out"
          style={{ position: "absolute" }}
        >
          <PinMap
            onChange={(address) => {
              sendAddress(address);
            }}
          />
        </motion.div>
      )}
    </React.Fragment>
  );
}

function RenderMessage(props) {
  const { message, user, position, meta } = props;
  const renderer = {
    map: (
      <Box
        key={message.chat_id}
        onClick={(e) => {
          if (e.target.className.indexOf("Mui") >= 0)
            e.currentTarget.toggleAttribute("data-show");
        }}
        className="message-container"
      >
        <Box width="100%" textAlign="center" className="chat-details">
          <Typography>{moment(message.created_at).format("llll")}</Typography>
        </Box>
        <Box display="flex" className={"chat-entry " + position}>
          {position === "left" && <Avatar alt={user?.user_fname[0]} src="/" />}
          <TextMessage
            chat_meta={JSON.stringify({
              message: user?.user_fname + " sent a location",
            })}
            position={position}
          >
            <Box
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${meta.address?.geometry.coordinates[1]},${meta.address?.geometry.coordinates[0]}`,
                  "_blank"
                )
              }
            >
              <StaticMap
                width={260}
                height={150}
                mapStyle="mapbox://styles/azkalonz/ckhpxvrmj072r19pemg86ytbk"
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                latitude={meta.address?.geometry.coordinates[1]}
                longitude={meta.address?.geometry.coordinates[0]}
                zoom={15}
                className={"chat-static-map " + position}
              >
                <Marker
                  latitude={meta.address?.geometry.coordinates[1]}
                  longitude={meta.address?.geometry.coordinates[0]}
                >
                  <div className={"center-pin"}>
                    <span className="icon-location"></span>
                  </div>
                </Marker>
              </StaticMap>
            </Box>
          </TextMessage>
        </Box>
      </Box>
    ),
    text: (
      <Box
        key={message.chat_id}
        onClick={(e) => {
          e.currentTarget.toggleAttribute("data-show");
        }}
        className="message-container"
      >
        <Box width="100%" textAlign="center" className="chat-details">
          <Typography>{moment(message.created_at).format("llll")}</Typography>
        </Box>
        <Box display="flex" className={"chat-entry " + position}>
          {position === "left" && <Avatar alt={user?.user_fname[0]} src="/" />}
          <TextMessage {...message} position={position} />
          {/* {position === "right" && (
              <Avatar alt={user?.user_fname[0]} src="/" />
            )} */}
        </Box>
      </Box>
    ),
  };
  return renderer[meta.type];
}

function Preview(props) {
  const { chat_meta, position = "right", user } = props;
  const meta = JSON.parse(chat_meta);
  return (
    <Box
      className="message-container"
      style={{ transform: "translateY(14px)" }}
    >
      <Box
        display="flex"
        className={"chat-entry " + position}
        alignItems="center"
      >
        <TextMessage {...props} position={position} />
        <div>
          <CircularProgress size={14} />
        </div>
      </Box>
    </Box>
  );
}
function TextMessage(props) {
  const { chat_meta } = props;
  const meta = JSON.parse(chat_meta || {});
  return (
    <React.Fragment>
      <div className={"text-message " + props.position}>
        <Box className="message">
          <Typography>
            <span dangerouslySetInnerHTML={{ __html: meta.message }}></span>
          </Typography>
          {props.children}
        </Box>
        <Typography className="time">
          {moment(props.created_at).format("h:mm A")}
        </Typography>
      </div>
    </React.Fragment>
  );
}
export default ChatComponent;

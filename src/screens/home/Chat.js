import { Box, Button, Icon, IconButton, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import ChatComponent from "../../components/ChatComponent";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import UserContext from "../../context/UserContext";
import { slideBottom } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { getOR } from "../services/Checkout";

function Chat(props) {
  const [order, setOrder] = useState(props.location.state);
  const { order_id } = props.match.params;
  const { setLoadingScreen, loadingScreen } = useContext(LoadingScreenContext);
  const { setBottomNavContext, bottomNavContext } = useContext(
    BottomNavContext
  );
  const { userContext } = useContext(UserContext);
  const { delivery_info } = order || {};
  const { contact } = delivery_info || {};
  const [chatName, setChatName] = useState({ name: "", contact: "" });
  useEffect(() => {
    if (bottomNavContext.visible)
      setBottomNavContext({ ...bottomNavContext, visible: false });
  }, [bottomNavContext]);
  useEffect(() => {
    if (order_id !== undefined && !props.location.state) {
      setLoadingScreen({
        ...loadingScreen,
        visible: true,
        variant: null,
      });
      fetchData({
        send: async () =>
          await Api.get("/order/" + order_id + "?token=" + Api.getToken()),
        after: (data) => {
          if (data?.delivery_info) {
            data.delivery_info = JSON.parse(data.delivery_info);
            setOrder(data);
            setLoadingScreen({ ...loadingScreen, visible: false });
          } else {
            window.location = "/";
          }
        },
      });
    }
  }, []);
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideBottom}
      className="chat-container"
      style={props.style}
    >
      <Box p={2} paddingBottom={0}>
        <ScreenHeader
          title={
            <Box>
              <Typography
                color="primary"
                style={{ fontWeight: 700 }}
                variant="h5"
              >
                {chatName?.name}
              </Typography>
              <Typography>{chatName?.contact}</Typography>
            </Box>
          }
          actions={
            <Box>
              <IconButton
                onClick={() =>
                  (window.location = `sms:+${contact?.contact}?body=${encodeURI(
                    `Hi, ${contact.name}`
                  )}. I'm on the way to deliver your Food. Thank you. ${
                    userContext.user_fname
                  } ${userContext.user_lname} from Palihug.co`)
                }
              >
                <Icon>chat</Icon>
              </IconButton>
              <IconButton onClick={() => (window.location = "tel:2125551212")}>
                <Icon>phone</Icon>
              </IconButton>
            </Box>
          }
        />
      </Box>
      <Box
        width="100%"
        className="center-all"
        justifyContent="space-between"
        p={3}
        paddingBottom={0}
        paddingTop={0}
        style={{ borderTop: "1px solid rgba(0, 0, 0, 0.246)" }}
      >
        <Typography color="primary" variant="h6" style={{ fontWeight: 700 }}>
          {"Order #" + getOR(order_id)}
        </Typography>
        <Button onClick={() => props.history.push("/orders/" + order_id)}>
          View Order
        </Button>
      </Box>
      {order && (
        <ChatComponent {...order} {...props} setChatName={setChatName} />
      )}
    </motion.div>
  );
}

export default Chat;

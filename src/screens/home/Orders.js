import {
  Box,
  ButtonBase,
  Container,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import EmptyListMessage from "../../components/EmptyListMessage";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import DialogContext from "../../context/DialogContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import OrderContext from "../../context/OrderContext";
import { slideLeft } from "../../misc/transitions";
import { getOR } from "../services/Checkout";
const qs = require("query-string");

function Orders(props) {
  const query = qs.parse(window.location.search);
  const bcontext = useContext(BottomNavContext);
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const [tabValue, setTabValue] = useState(0);
  const [serviceId, setServiceId] = useState(0);
  const { loadingScreen, setLoadingScreen } = useContext(LoadingScreenContext);
  const menu = useMemo(
    () => [
      { icon: "icon-coke-burger md", title: "E-Pagkain" },
      { icon: "icon-basket md", title: "E-Pabili" },
      { icon: "icon-task md", title: "E-Pasugo" },
      { icon: "icon-gift md", title: "E-Pasurprise" },
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
      variant: "orders",
    });
    (async () => {
      await orderContext.fetchOrders(setOrderContext, "customer");
      setLoadingScreen({ ...loadingScreen, visible: false, variant: null });
    })();
  }, []);
  useEffect(() => {
    let q = parseInt(query.service);
    if (!isNaN(q)) {
      setServiceId(q);
    }
  }, [query.service]);
  useEffect(() => {
    let q = parseInt(query.tab);
    if (!isNaN(q)) {
      setTabValue(q);
    }
  }, [query.tab]);
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideLeft}
      style={{ height: "100%" }}
    >
      <Box p={3}>
        <ScreenHeader title="Orders" />
      </Box>
      {/* <Tabs
        value={serviceId}
        fullWidth
        onChange={(e, val) =>
          props.history.replace({
            pathname: window.location.pathname,
            search: `?tab=${tabValue}&service=${val}`,
          })
        }
        className="icon-tabs"
      >
        {menu.map((m, index) => (
          <Tab
            key={index}
            label={
              <AnimateOnTap>
                {typeof m.icon === "string" ? (
                  <span className={m.icon}></span>
                ) : (
                  m.icon
                )}
                <span style={{ marginLeft: 7 }}>{m.title}</span>
              </AnimateOnTap>
            }
          />
        ))}
      </Tabs> */}
      <Box m={3} marginTop={0} marginBottom={0}>
        <Tabs
          value={tabValue}
          fullWidth
          onChange={(e, val) =>
            props.history.replace({
              pathname: window.location.pathname,
              search: `?tab=${val}&service=${serviceId}`,
            })
          }
        >
          <Tab label={<AnimateOnTap>All</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Pending</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Processing</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>To Receive</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Done</AnimateOnTap>} />
          <Tab label={<AnimateOnTap>Cancelled</AnimateOnTap>} />
        </Tabs>
      </Box>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => {
          props.history.replace({
            pathname: window.location.pathname,
            search: `?tab=${index}&service=${serviceId}`,
          });
        }}
        style={{ paddingBottom: 50 }}
      >
        <Box height="100%">
          <Order serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="pending" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="processing" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="receiving" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="received" serviceId={serviceId} />
        </Box>
        <Box height="100%">
          <Order status="cancelled" serviceId={serviceId} />
        </Box>
      </SwipeableViews>
    </motion.div>
  );
}

export function Order(props) {
  const { orderContext } = useContext(OrderContext);
  const orders = useMemo(
    () =>
      orderContext?.orders
        ?.filter((order) =>
          props.status ? order.status === props.status : true
        )
        .filter((order) => order.service_id === props.serviceId + 1)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
    [orderContext, props.serviceId]
  );
  return (
    <Box>
      {!orders.length ? <EmptyListMessage>Empty</EmptyListMessage> : null}
      <List>
        {orders.map((order, index) => (
          <AnimateOnTap button key={index}>
            <ListItem divider className={"order-item " + order.status}>
              {props.OrderCard ? (
                <props.OrderCard {...order} />
              ) : (
                <OrderCard {...order} />
              )}
            </ListItem>
          </AnimateOnTap>
        ))}
      </List>
    </Box>
  );
}

function OrderCard(props) {
  const {
    status_text,
    order_date,
    order_id,
    total,
    est_total,
    status,
    delivery_fee,
  } = props;
  const { dialogContext, setDialogContext } = useContext(DialogContext);
  return (
    <Box
      width="100%"
      className="column-flex-100"
      onClick={() => {
        setDialogContext({
          visible: true,
          title: moment(order_date).format("llll"),
          message: (
            <React.Fragment>
              <List>
                <ListItem
                  component={ButtonBase}
                  onClick={() => {
                    setDialogContext({ ...dialogContext, visible: false });
                    history.push("/orders/" + order_id);
                  }}
                >
                  View Transaction
                </ListItem>
                <ListItem
                  component={ButtonBase}
                  onClick={() => {
                    setDialogContext({ ...dialogContext, visible: false });
                    if (status !== "pending") history.push("/chat/" + order_id);
                    else history.push("/orders/" + order_id + "?tab=3");
                  }}
                >
                  Chat
                </ListItem>
              </List>
            </React.Fragment>
          ),
        });
      }}
    >
      <Box>
        <Typography>{moment(order_date).format("llll")}</Typography>
        <Typography color="textSecondary" variant="body2">
          Order no. {getOR(order_id)}
        </Typography>
      </Box>
      <Box>
        <Typography color="primary" variant="h6" style={{ fontWeight: 700 }}>
          P {(parseFloat(total) + parseFloat(delivery_fee)).toFixed(2)}
          {est_total && (
            <React.Fragment> (~ {est_total.toFixed(2)})</React.Fragment>
          )}
        </Typography>
        <Typography color="primary" variant="body2">
          {status_text}
        </Typography>
      </Box>
    </Box>
  );
}

export default Orders;

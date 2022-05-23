import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Icon,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Marker, StaticMap } from "react-map-gl";
import SwipeableViews from "react-swipeable-views";
import { Block } from ".";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import EmptyListMessage from "../../components/EmptyListMessage";
import { Price, ProductCard } from "../../components/Product";
import Receipt from "../../components/Receipt";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import DialogContext from "../../context/DialogContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import OrderContext from "../../context/OrderContext";
import UserContext from "../../context/UserContext";
import config from "../../misc/config";
import { slideBottom } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { goBackOrPush } from "../../utils/goBackOrPush";
import { isAllowed, isEither } from "../../utils/isAllowed";
import { CartColumn } from "../services/Cart";
import { getOR } from "../services/Checkout";
import moment from "moment";
const qs = require("query-string");

function OrderDetails(props) {
  const query = qs.parse(window.location.search);
  const [order, setOrder] = useState();
  const [tabValue, setTabValue] = useState(0);
  const { order_id } = props.match.params;
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  const { setDialogContext } = useContext(DialogContext);
  const { setOrderContext, orderContext } = useContext(OrderContext);
  const { userContext } = useContext(UserContext);
  const acceptOrder = useCallback(
    (meta, title) => {
      setDialogContext({
        visible: true,
        title,
        message: (
          <Box width="100%" className="center-all">
            {/* <LinearProgress style={{ width: "100%" }} /> */}
          </Box>
        ),
        actions: [
          {
            name: "Continue",
            callback: ({ closeDialog, setLoading }) => {
              fetchData({
                before: () => setLoading(true),
                send: async () =>
                  await Api.post("/order?token=" + Api.getToken(), {
                    body: {
                      order_id,
                      ...meta,
                    },
                  }),
                after: (data) => {
                  if (data) {
                    closeDialog();
                    setLoading(false);
                    if (data.error) {
                      setDialogContext({
                        visible: true,
                        title: "Error",
                        message: (
                          <Box width="100%" className="center-all">
                            <Typography>{data.message}</Typography>
                          </Box>
                        ),
                        actions: [
                          {
                            name: "OK",
                            callback: ({ closeDialog, setLoading }) => {
                              closeDialog();
                              if (data.message !== "Invalid Amount") {
                                orderContext.removeOrder(
                                  order,
                                  setOrderContext
                                );
                                goBackOrPush("/orders");
                              }
                            },
                            props: {
                              variant: "contained",
                              color: "primary",
                            },
                          },
                        ],
                      });
                    }
                    if (!data.error) {
                      orderContext.updateOrder(data, setOrderContext);
                      setDialogContext({ visible: false });
                      data.delivery_info = JSON.parse(data.delivery_info);
                      setOrder(data);
                      if (data.status === "received")
                        props.history.push("/chat/" + data.order_id);
                      else if (data.status === "processing")
                        props.history.replace(
                          "/orders/" + data.order_id + "?tab=1"
                        );
                      else
                        props.history.replace(
                          "/orders/" + data.order_id + "?tab=0"
                        );
                    }
                  }
                },
              });
            },
            props: {
              variant: "contained",
              color: "primary",
            },
          },
          {
            name: "Cancel",
            callback: ({ closeDialog }) => closeDialog(),
          },
        ],
      });
    },
    [order]
  );
  const showDriverOptions = useCallback(() => {
    setDialogContext({
      title: "Action",
      visible: true,
      message: (
        <React.Fragment>
          <List>
            {order.status === "pending" && (
              <React.Fragment>
                <ListItem
                  component={ButtonBase}
                  onClick={() =>
                    acceptOrder(
                      {
                        status: "processing",
                      },
                      "Are you sure to accept?"
                    )
                  }
                >
                  Accept
                </ListItem>
                <ListItem
                  component={ButtonBase}
                  onClick={() =>
                    acceptOrder(
                      {
                        status: "cancelled",
                      },
                      "Are you sure to cancel?"
                    )
                  }
                >
                  Cancel
                </ListItem>
              </React.Fragment>
            )}
            {order.status === "receiving" && (
              <React.Fragment>
                <TextField
                  inputProps={{
                    id: "amount_paid",
                  }}
                  type="number"
                  label="Amount Paid"
                  placeholder="0"
                />
                <ListItem
                  component={ButtonBase}
                  onClick={() =>
                    acceptOrder(
                      {
                        status: "received",
                        amount_paid:
                          parseFloat(
                            document.querySelector("#amount_paid").value
                          ) || null,
                      },
                      "Complete this transaction?"
                    )
                  }
                >
                  Finish Transactions
                </ListItem>
              </React.Fragment>
            )}
            {order.status === "processing" && (
              <React.Fragment>
                <ListItem
                  component={ButtonBase}
                  onClick={() =>
                    acceptOrder(
                      {
                        status: "receiving",
                      },
                      "Deliver this order?"
                    )
                  }
                >
                  Deliver Order
                </ListItem>
              </React.Fragment>
            )}
          </List>
        </React.Fragment>
      ),
    });
  }, [order]);
  const openChat = useCallback(() => {
    props.history.push("/chat/" + order.order_id);
    setDialogContext({ visible: false });
  }, [order]);
  useEffect(() => {
    if (!isNaN(parseInt(query.tab))) setTabValue(parseInt(query.tab));
  }, [query.tab]);
  useEffect(() => {
    setLoadingScreen({ visible: true });
    fetchData({
      send: async () =>
        await Api.get("/order/" + order_id + "?token=" + Api.getToken()),
      after: (data) => {
        if (data && !data.error) {
          data.delivery_info = JSON.parse(data.delivery_info);
          setOrder(data);
        } else if (data?.error) {
          window.location = "/";
        }
        setLoadingScreen({ visible: false });
      },
    });
  }, []);
  return order ? (
    <motion.div
      variants={slideBottom}
      initial="initial"
      animate="in"
      exit="out"
    >
      <Box p={3} bgcolor={config.palette.primary.pale}>
        <ScreenHeader title={"#" + getOR(order.order_id)}>
          {isAllowed(userContext, ["driver", "merchant", "admin"]) && (
            <IconButton
              style={{ position: "absolute", right: 0 }}
              onClick={showDriverOptions}
            >
              <Icon>more_vert</Icon>
            </IconButton>
          )}
        </ScreenHeader>
        <Tabs
          value={tabValue}
          onChange={(e, val) =>
            props.history.replace({
              pathname: props.location.pathname,
              search: "tab=" + val,
            })
          }
        >
          <Tab label="Info" />
          <Tab label="Products/Services" />
          <Tab label="Note" />
          <Tab label="Chat" />
          <Tab label="Receipt" disabled={order.status !== "received"} />
        </Tabs>
        <Block
          p={0}
          title={
            <React.Fragment>
              Total&nbsp;
              <span style={{ color: "#000" }}>
                {order.products.length} Item(s)
              </span>
            </React.Fragment>
          }
          style={{ marginTop: 16 }}
        >
          <Price>
            <CurrencyFormat
              value={(
                parseFloat(order.total) + parseFloat(order.delivery_fee)
              ).toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
            />
            {order.est_total && (
              <React.Fragment>
                &nbsp;(~
                <CurrencyFormat
                  value={order.est_total.toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
                )
              </React.Fragment>
            )}
          </Price>
        </Block>
      </Box>
      <SwipeableViews
        onChangeIndex={(val) =>
          props.history.replace({
            pathname: props.location.pathname,
            search: "tab=" + val,
          })
        }
        index={tabValue}
        resistance
      >
        <Box>
          <Block title="Status">
            <Chip
              label={order.status.toUpperCase()}
              color="primary"
              className={"chip " + order.status}
            />
          </Block>
          <Block title="Delivery Info">
            <CartColumn title="Name">
              <Typography style={{ fontWeight: 700 }} color="primary">
                {order.delivery_info.contact.name}
              </Typography>
            </CartColumn>
            <CartColumn title="Phone Number">
              <Typography style={{ fontWeight: 700 }} color="primary">
                {order.delivery_info.contact.contact}
              </Typography>
            </CartColumn>
            <CartColumn title="Address">
              <Typography style={{ fontWeight: 700 }} color="primary">
                {order.delivery_info.address.place_name}
              </Typography>
            </CartColumn>
            {JSON.stringify(order.products).indexOf(
              '\\"type\\":\\"external\\'
            ) >= 0 && (
              <CartColumn title="Service Reservation Date">
                <Typography style={{ fontWeight: 700 }} color="primary">
                  {moment(order.reservation_date).format("MMMM DD, YYYY")}
                </Typography>
              </CartColumn>
            )}
            <CartColumn title="Delivery Fee">
              <Typography style={{ fontWeight: 700 }} color="primary">
                <CurrencyFormat
                  value={order.delivery_fee.toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix="PHP "
                />
              </Typography>
            </CartColumn>
            <Box
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${order.delivery_info.address.geometry.coordinates[1]},${order.delivery_info.address.geometry.coordinates[0]}`,
                  "_blank"
                );
              }}
            >
              <StaticMap
                width="100%"
                height={150}
                mapStyle="mapbox://styles/azkalonz/ckhpxvrmj072r19pemg86ytbk"
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                latitude={order.delivery_info.address.geometry.coordinates[1]}
                longitude={order.delivery_info.address.geometry.coordinates[0]}
                zoom={15}
                className="checkout-static-map"
              >
                <Marker
                  latitude={order.delivery_info.address.geometry.coordinates[1]}
                  longitude={
                    order.delivery_info.address.geometry.coordinates[0]
                  }
                >
                  <div className={"center-pin"}>
                    <span className="icon-location"></span>
                  </div>
                </Marker>
              </StaticMap>
            </Box>
          </Block>
        </Box>
        {isAllowed(userContext, ["customer"]) ? (
          <Box p={3}>
            <Products order={order} />
          </Box>
        ) : (
          <ProductsByVendor order={order} />
        )}
        <Box p={3}>
          {order.note ? (
            <CartColumn title="Customer's Note">
              <Paper elevation={1} style={{ padding: 14 }}>
                <Typography>{order.note}</Typography>
              </Paper>
            </CartColumn>
          ) : (
            <EmptyListMessage>Note is empty</EmptyListMessage>
          )}
        </Box>
        <Box p={3}>
          {order.status === "pending" ? (
            <EmptyListMessage>
              To ensure that they can focus on their preparations, chat can only
              be started by merchants. It will be available once the order is
              accepted.
              <br />
              {isAllowed(userContext, ["driver"]) && (
                <SavingButton
                  onClick={() =>
                    acceptOrder(
                      {
                        status: "processing",
                      },
                      "Accept this order?"
                    )
                  }
                  className="themed-button"
                >
                  Accept Order
                </SavingButton>
              )}
            </EmptyListMessage>
          ) : isEither(userContext.user_id, [
              order.provider_user_id,
              order.consumer_user_id,
            ]) ? (
            <Button className="themed-button" onClick={() => openChat()}>
              Open Chat
            </Button>
          ) : (
            <EmptyListMessage>
              Only the customer and the provider can use this feature.
            </EmptyListMessage>
          )}
        </Box>
        <Box>{order?.status === "received" && <Receipt order={order} />}</Box>
      </SwipeableViews>
    </motion.div>
  ) : null;
}
function ProductsByVendor(props) {
  const { order } = props;
  const [vendors, setVendors] = useState({});
  const [tabValue, setTabValue] = useState(0);
  useEffect(() => {
    let v = {};
    if (order?.products?.length) {
      order.products.map((item) => {
        const p = JSON.parse(item.product_meta);
        v[p.store.vendor_display_name] = p.store;
        v[p.store.vendor_display_name].orders = [];
      });
      order.products.map((item) => {
        const p = JSON.parse(item.product_meta);
        const storeName = p.store.vendor_display_name;
        v[storeName].orders.push({ product: p, ...item });
      });
    }
    setVendors(v);
  }, []);
  return (
    <React.Fragment>
      <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
        {Object.keys(vendors).map((vendor, index) => (
          <Tab
            label={
              <Box className="center-all">
                {vendor}
                <IconButton
                  onClick={() => {
                    history.push(
                      `/merchant/${vendors[vendor].vendor_id}/details`
                    );
                  }}
                >
                  <Icon>open_in_new</Icon>
                </IconButton>
              </Box>
            }
            key={vendor.vendor_id}
          />
        ))}
      </Tabs>
      <SwipeableViews
        index={tabValue}
        onChangeIndex={(val) => setTabValue(val)}
        resistance
      >
        {Object.keys(vendors).map((vendor, index) => (
          <Box key={vendor.vendor_id} p={3}>
            {vendors[vendor].orders?.map((order) => {
              const p = order.product;

              return (
                <ProductCard product={p} key={p.id} variant="small">
                  <Typography>Quantity {order.order_qty}</Typography>
                  <Typography>Total {order.order_total}</Typography>
                </ProductCard>
              );
            })}
          </Box>
        ))}
      </SwipeableViews>
    </React.Fragment>
  );
}
function Products(props) {
  const { userContext } = useContext(UserContext);
  const { dialogContext, setDialogContext } = useContext(DialogContext);
  return props.order?.products.map((item) => {
    const p = JSON.parse(item.product_meta);
    return (
      <AnimateOnTap
        onClick={() =>
          isAllowed(userContext, ["customer"]) &&
          setDialogContext({
            visible: true,
            title: "Action",
            message: (
              <React.Fragment>
                <List>
                  {/* <ListItem
                    component={ButtonBase}
                    onClick={() => {
                      setDialogContext({
                        ...dialogContext,
                        visible: false,
                      });
                      history.push({
                        pathname: "/add-to-cart",
                        state: p,
                      });
                    }}
                  >
                    Buy Again
                  </ListItem> */}
                  <ListItem
                    component={ButtonBase}
                    onClick={() => {
                      setDialogContext({
                        ...dialogContext,
                        visible: false,
                      });
                      history.push("/merchant/" + p.store.vendor_id);
                    }}
                  >
                    Visit Store
                  </ListItem>
                </List>
              </React.Fragment>
            ),
          })
        }
      >
        <ProductCard product={p} key={p.id} variant="small">
          <Typography>Quantity {item.order_qty}</Typography>
          <Typography>Total {item.order_total}</Typography>
        </ProductCard>
      </AnimateOnTap>
    );
  });
}
export default OrderDetails;

import { Box, Icon, TextField, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Marker, StaticMap } from "react-map-gl";
import PinMap from "../../components/PinMap";
import { Price, WithDeliveryPrice } from "../../components/Product";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import CartContext from "../../context/CartContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import OrderContext from "../../context/OrderContext";
import UserContext from "../../context/UserContext";
import { fadeInOut, slideBottom, slideRight } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { Block } from "../home";
import { CartColumn, OrdersBlock } from "./Cart";

export const getOR = (number) => {
  let l = "0000000";
  number = number + "";
  return l.slice(0, l.length - number.length) + number;
};

function Checkout(props) {
  const [address, setAddress] = useState(null);
  const { userContext } = useContext(UserContext);
  const { cartContext, setCartContext } = useContext(CartContext);
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const { loadingScreen, setLoadingScreen } = useContext(LoadingScreenContext);
  const [selecting, setSelecting] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState(null);
  const [estTotal, setEstTotal] = useState(null);
  const { service_name } = props.location.state || {};
  const [finalTotal, setFinalTotal] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address,
    contact: userContext.default_address
      ? {
          name: userContext.default_address.name,
          contact: userContext.default_address.contact,
        }
      : {},
  });
  const submitOrder = useCallback(
    ({ params = {}, hooks = {} }) => {
      fetchData({
        before: () => setSaving(true),
        send: async () =>
          await Api.post("/checkout?token=" + Api.getToken(), {
            body: {
              payment_id: 1,
              consumer_user_id: userContext.user_id,
              delivery_info: JSON.stringify(deliveryInfo),
              note,
              est_total: estTotal,
              delivery_fee: cartContext.deliveryFee,
              ...params,
            },
          }),
        after: (order) => {
          setSaving(false);
          if (order?.order_id) {
            if (hooks?.afterCheckout) {
              hooks.afterCheckout(order);
            }
          }
        },
      });
    },
    [deliveryInfo, cartContext, userContext, note, estTotal]
  );
  const Renderer = useCallback(() => {
    const Template = (props) => (
      <React.Fragment>
        {props.children}
        <Block title="Payment" p={0}>
          <CartColumn title="Method">
            <Typography style={{ fontWeight: 700 }} color="primary">
              Cash on delivery
            </Typography>
          </CartColumn>
          <CartColumn title="Delivery Fee">
            <Typography style={{ fontWeight: 700 }} color="primary">
              <CurrencyFormat
                value={cartContext?.deliveryFee?.toFixed(2) || 0}
                displayType={"text"}
                thousandSeparator={true}
                prefix="PHP "
              />
            </Typography>
          </CartColumn>
        </Block>

        <Block
          title={
            <React.Fragment>
              Total&nbsp;
              <span style={{ color: "#000" }}>
                {props.checkoutParams.params.products?.length || 0} Item(s)
              </span>
            </React.Fragment>
          }
          p={0}
        >
          <Price>
            <WithDeliveryPrice
              deliveryInfo={deliveryInfo}
              finalTotal={finalTotal}
              setFinalTotal={(t) => setFinalTotal(t)}
              service_name={service_name}
            >
              <CurrencyFormat
                value={props.checkoutParams.params.total}
                displayType={"text"}
                thousandSeparator={true}
              />
            </WithDeliveryPrice>
            {!isNaN(estTotal || NaN) && (
              <React.Fragment>
                &nbsp;(~
                <CurrencyFormat
                  value={estTotal.toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
                )
              </React.Fragment>
            )}
          </Price>
          <br />
          <br />
          <SavingButton
            className="themed-button"
            startIcon={<Icon>https</Icon>}
            saving={saving}
            disabled={finalTotal === null}
            onClick={() => submitOrder(props.checkoutParams)}
          >
            <Typography>Submit Order</Typography>
          </SavingButton>
        </Block>
      </React.Fragment>
    );
    const GenericTemplate = ({ checkoutParams, title }) => (
      <Template checkoutParams={checkoutParams}>
        <Block p={0} title={title}>
          <Typography color="textSecondary">
            You opted for {title}. Please be attentive when your booking is
            accepted. Check your notifications from time to time.
          </Typography>
        </Block>
        <br />
      </Template>
    );
    const render = {
      "e-pagkain": (
        <Template
          checkoutParams={{
            params: {
              service_id: 1,
              total: cartContext.total,
              products: cartContext.products.map((q) => ({
                prod_id: q.product.id,
                order_qty: q.quantity,
                order_total: eval(q.product.price * q.quantity),
                merchant_id: q.product.store.vendor_id,
                product_meta: JSON.stringify(q.product),
              })),
            },
            hooks: {
              afterCheckout: (order) =>
                fetchData({
                  send: async () => Api.delete("/cart?token=" + Api.getToken()),
                  after: () => {
                    cartContext.emptyCart(setCartContext);
                    setOrderContext({
                      ...orderContext,
                      orders: [order, ...orderContext.orders],
                    });
                    props.history.replace("/orders/" + order.order_id);
                  },
                }),
            },
          }}
        >
          <OrdersBlock />
        </Template>
      ),
      "e-pabili": (
        <GenericTemplate
          title="E-Pabili Service"
          checkoutParams={{
            params: { service_id: 2, products: [], total: 0 },
            hooks: {
              afterCheckout: (order) => {
                setOrderContext({
                  ...orderContext,
                  orders: [order, ...orderContext.orders],
                });
                props.history.replace("/orders/" + order.order_id);
              },
            },
          }}
        />
      ),
      "e-pasuyo": (
        <GenericTemplate
          title="E-Pasuyo Service"
          checkoutParams={{
            params: { service_id: 3, products: [], total: 0 },
            hooks: {
              afterCheckout: (order) => {
                setOrderContext({
                  ...orderContext,
                  orders: [order, ...orderContext.orders],
                });
                props.history.replace("/orders/" + order.order_id);
              },
            },
          }}
        />
      ),
      "e-pasurprise": (
        <GenericTemplate
          title="E-Pasurprise Service"
          checkoutParams={{
            params: { service_id: 4, products: [], total: 0 },
            hooks: {
              afterCheckout: (order) => {
                setOrderContext({
                  ...orderContext,
                  orders: [order, ...orderContext.orders],
                });
                props.history.replace("/orders/" + order.order_id);
              },
            },
          }}
        />
      ),
      "e-palaba": (
        <GenericTemplate
          title="E-Palaba Service"
          checkoutParams={{
            params: { service_id: 5, products: [], total: 0 },
            hooks: {
              afterCheckout: (order) => {
                setOrderContext({
                  ...orderContext,
                  orders: [order, ...orderContext.orders],
                });
                props.history.replace("/orders/" + order.order_id);
              },
            },
          }}
        />
      ),
    };
    return render[service_name] || render["e-pagkain"];
  }, [
    service_name,
    address,
    deliveryInfo,
    note,
    saving,
    estTotal,
    finalTotal,
    cartContext,
  ]);
  useEffect(() => {
    if (userContext.default_address) {
      setDeliveryInfo({
        address: !Object.keys(userContext?.default_address || {}).length
          ? deliveryInfo.address
          : (() => {
              const { street, barangay, city, house_number, zip } =
                userContext.default_address;
              return `${
                street ? street + ", " : ""
              }${barangay}, ${city}, ${zip}`;
            })(),
        contact: {
          name: userContext.default_address.name,
          contact: userContext.default_address.contact,
        },
      });
    }
  }, [userContext.default_address]);
  useEffect(() => {
    setDeliveryInfo({ ...deliveryInfo, address });
  }, [address]);
  useEffect(() => {
    if (!cartContext.isFetched) {
      setLoadingScreen({
        ...loadingScreen,
        visible: true,
        variant: null,
      });
      (async () => {
        await cartContext.fetchCart(setCartContext);
        setLoadingScreen({ ...loadingScreen, visible: false, variant: null });
      })();
    }
  }, [cartContext]);
  return (
    <motion.div variants={fadeInOut} initial="initial" exit="out" animate="in">
      {selecting && (
        <motion.div
          variants={slideBottom}
          initial="initial"
          exit="out"
          animate="in"
        >
          <PinMap
            onChange={(address) => {
              setSelecting(false);
              setFinalTotal(null);
              setAddress(address);
            }}
            address={address}
          />
        </motion.div>
      )}

      {!selecting && (
        <Box height="100vh" overflow="auto" paddingBottom={10}>
          <Box p={3}>
            <motion.div
              variants={slideRight}
              initial="initial"
              exit="out"
              animate="in"
            >
              <ScreenHeader
                title="Checkout"
                pushTo={() => {
                  setSelecting(true);
                }}
              />
              <Block title="Delivery Info" p={0}>
                <TextField
                  defaultValue={deliveryInfo.contact.name}
                  variant="outlined"
                  label="Name"
                  className="themed-input"
                  fullWidth
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      contact: {
                        ...deliveryInfo.contact,
                        name: e.target.value,
                      },
                    })
                  }
                />
                <TextField
                  defaultValue={deliveryInfo.contact.contact}
                  variant="outlined"
                  className="themed-input"
                  label="Contact Number"
                  fullWidth
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      contact: {
                        ...deliveryInfo.contact,
                        contact: e.target.value,
                      },
                    })
                  }
                />
                <br />
                <br />
                <CartColumn title="Address">
                  <Typography style={{ fontWeight: 700 }} color="primary">
                    {address.place_name}
                  </Typography>
                </CartColumn>
                <div onClick={() => setSelecting(true)}>
                  <StaticMap
                    width="100%"
                    height={150}
                    mapStyle="mapbox://styles/azkalonz/ckhpxvrmj072r19pemg86ytbk"
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    latitude={address.geometry.coordinates[1]}
                    longitude={address.geometry.coordinates[0]}
                    zoom={15}
                    className="checkout-static-map"
                  >
                    <Marker
                      latitude={address.geometry.coordinates[1]}
                      longitude={address.geometry.coordinates[0]}
                    >
                      <div className={"center-pin"}>
                        <span className="icon-location"></span>
                      </div>
                    </Marker>
                  </StaticMap>
                </div>
              </Block>
              <Block title="Note" p={0}>
                <TextField
                  inputProps={{ maxLength: 200 }}
                  variant="outlined"
                  label="Your Message"
                  multiline
                  helperText="Maximum of 200 Characters"
                  fullWidth
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
                {service_name !== "e-pagkain" && (
                  <TextField
                    variant="outlined"
                    label="Est. Total"
                    type="number"
                    fullWidth
                    placeholder={0}
                    className="themed-input"
                    helperText="Enter the estimated cost."
                    onChange={(e) => setEstTotal(parseFloat(e.target.value))}
                  />
                )}
              </Block>
              {Renderer()}
            </motion.div>
          </Box>
        </Box>
      )}
    </motion.div>
  );
}

export default Checkout;

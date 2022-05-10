import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Icon,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import CurrencyFormat from "react-currency-format";
import Api, { MapBoxApi } from "../utils/api";
import fetchData from "../utils/fetchData";
import CartContext from "../context/CartContext";
import DialogContext from "../context/DialogContext";
import { DOMAIN } from "../utils/api";

export function ProductCard(props) {
  const { product } = props;

  return product ? (
    <Paper style={{ marginBottom: 24, position: "relative" }}>
      {props.header}
      {product.sale_price && (
        <SalePrice2
          style={{
            transform: props.variant === "small" ? "scale(1)" : "scale(1.7)",
            transformOrigin: "right",
          }}
        >
          {parseInt(
            ((parseFloat(product.regular_price) -
              parseFloat(product.sale_price)) /
              parseFloat(product.regular_price)) *
              100
          )}
          % OFF
        </SalePrice2>
      )}
      <Box p={2}>
        <Box className={"product " + props.variant || "big"}>
          <img src={product.images[0].src} width="100%" alt={product.name} />
          <br />
          <Box>
            <Typography
              color="#14142B"
              variant="h5"
              style={{ fontWeight: 700 }}
            >
              {product.name}
            </Typography>

            {props.variant === "small" ? (
              <React.Fragment>
                <CurrencyFormat
                  prefix="PHP "
                  value={product.price}
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(val) => (
                    <Typography style={{ fontWeight: "bold" }}>
                      {val}
                    </Typography>
                  )}
                />
                {props.children}
              </React.Fragment>
            ) : (
              <Price
                sale={product.sale_price}
                regularPrice={product.regular_price}
              >
                {product.price}
              </Price>
            )}
          </Box>
        </Box>
        {props.variant !== "small" && props.children}
      </Box>
    </Paper>
  ) : null;
}

export function MerchantCard(props) {
  const { merchant } = props;
  const { merch_banner, merch_name } = merchant;
  return merchant ? (
    <Box style={{ marginBottom: 24, position: "relative" }}>
      {props.header}
      <Box>
        <Box className={"product-archive"}>
          <img
            src={DOMAIN + "/storage/merchants/" + merch_banner}
            width="100%"
            alt={merch_name}
          />
          <br />
          <Box>
            <Typography
              color="primary"
              variant="h5"
              style={{
                fontWeight: 700,
                width: "100%",
                textAlign: "left",
                textJustify: "inter-word",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {merch_name}
            </Typography>
            {props.children}
          </Box>
        </Box>
        {props.variant !== "small" && props.children}
      </Box>
    </Box>
  ) : null;
}

export function Price(props) {
  return (
    <Box className="price">
      <Typography variant="h6" style={{ fontSize: "1em", fontWeight: 700 }}>
        PHP{" "}
        {props.sale ? (
          <a style={{ textDecoration: "line-through", opacity: 0.72 }}>
            {props.regularPrice}
          </a>
        ) : null}{" "}
        {props.children}
      </Typography>
    </Box>
  );
}

export function WithDeliveryPrice(props) {
  const { deliveryInfo, finalTotal, setFinalTotal, service_name } = props;
  const [loading, setLoading] = useState(true);
  const { cartContext, setCartContext } = useContext(CartContext);
  const getFee = useCallback(() => {
    (async () => {
      await fetchData({
        before: () => {
          setLoading(true);
          setFinalTotal(null);
        },
        send: async () => await Api.get("/fee?token=" + Api.getToken()),
        after: (data) => {
          calculateFee(data);
          // console.log(...data);
        },
      });
    })();
  }, [deliveryInfo, setFinalTotal]);
  const calculateFee = useCallback(
    ({ fee, per_km }) => {
      (async () => {
        let total = 0;
        let customerCoordinates = deliveryInfo?.address?.center;
        let res;
        if (customerCoordinates) {
          res = await MapBoxApi.getDirections([
            ...cartContext.getMerchantCoordinates(),
            customerCoordinates,
          ]);
        }

        //comment the e-pagkain to get delivery fee
        // if (service_name === "e-pagkain" || service_name === null) {
        if (service_name === "e-pagkain" || service_name === null) {
          let routes = res?.routes;
          if (Object.keys(routes || {}).length) {
            const { distance, duration } = routes[0];

            //no decimal value
            let deliveryFee = Math.round(fee + per_km * (distance * 0.001));
            let total = (cartContext.total + deliveryFee).toFixed(2);
            setFinalTotal({ deliveryFee, total });
            setCartContext({ ...cartContext, deliveryFee });
          }
        } else {
          setFinalTotal({ deliveryFee: fee, total: 0 });
          setCartContext({ ...cartContext, deliveryFee: fee });
        }
        setLoading(false);
      })();
    },
    [service_name, cartContext, deliveryInfo]
  );
  useEffect(() => {
    if (deliveryInfo !== null) {
      if (finalTotal === null) {
        getFee();
      } else {
        setLoading(false);
      }
    }
  }, [deliveryInfo, finalTotal]);
  return (
    <React.Fragment>
      {loading && <CircularProgress color="#fff" size={14} />}
      {!loading &&
        Children.map(props.children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              ...props,
              ...(finalTotal !== null ? { value: finalTotal.total } : {}),
            });
          }
          return child;
        })}
    </React.Fragment>
  );
}

export function SalePrice(props) {
  return (
    <Box className="sale-price" style={props.style}>
      <Typography style={{ fontWeight: 700 }}>{props.children}</Typography>
    </Box>
  );
}

export function SalePrice2(props) {
  return (
    <Box className="sale-price-2" style={props.style}>
      <Typography style={{ fontWeight: 700 }}>{props.children}</Typography>
    </Box>
  );
}

export function MechanicIncluded(props) {
  return (
    <Box className="mechanic-included" style={props.style}>
      <Typography style={{ fontWeight: 700 }}>{props.children}</Typography>
    </Box>
  );
}

export function InputQuantity(props) {
  const [quantity, setQuantity] = useState(1);
  const removeQty = useCallback(() => {
    if (quantity > 1) {
      props.onChange(quantity - 1);
      setQuantity(quantity - 1);
    }
  }, [quantity]);
  const addQty = useCallback(() => {
    props.onChange(quantity + 1);
    setQuantity(quantity + 1);
  }, [quantity]);

  return (
    <React.Fragment>
      <ButtonGroup disabled={!!props.disabled}>
        <Button onClick={() => removeQty()}>
          <Icon>remove</Icon>
        </Button>
        <TextField type="number" value={quantity} />
        <Button onClick={() => addQty()}>
          <Icon>add</Icon>
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
}

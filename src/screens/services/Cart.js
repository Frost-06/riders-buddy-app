import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Icon,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import CurrencyFormat from "react-currency-format";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import EmptyListMessage from "../../components/EmptyListMessage";
import { InputQuantity, Price, ProductCard } from "../../components/Product";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import SecondHeader from "../../components/user-globals/SecondHeader";
import BottomNavContext from "../../context/BottomNavContext";
import CartContext from "../../context/CartContext";
import DialogContext from "../../context/DialogContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import UserContext from "../../context/UserContext";
import { StarIcon } from "../../misc/CustomIcons";
import { slideRight } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { goBackOrPush } from "../../utils/goBackOrPush";
import { Block } from "../home";
import Footer from "../home/Footer";

function Cart(props) {
  const bcontext = useContext(BottomNavContext);
  const { cartContext, setCartContext } = useContext(CartContext);
  const { loadingScreen, setLoadingScreen } = useContext(LoadingScreenContext);

  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
    setLoadingScreen({
      ...loadingScreen,
      visible: true,
      variant: null,
    });
    (async () => {
      await cartContext.fetchCart(setCartContext);
      setLoadingScreen({ ...loadingScreen, visible: false, variant: null });
    })();
  }, []);
  const [tabValue, setTabValue] = useState(0);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader title="Cart" />
        {cartContext.products.length ? (
          <React.Fragment>
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

            <SwipeableViews
              resistance
              index={tabValue}
              onChangeIndex={(index) => setTabValue(index)}
            >
              <Box>
                <Block title="Your Orders" p={0}>
                  <WebCart type="simple" />
                </Block>
              </Box>
              <Box>
                <Block title="Your Bookings" p={0}>
                  <WebCart type="external" />
                </Block>
              </Box>
            </SwipeableViews>
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
                  props.history.push({
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
          </React.Fragment>
        ) : (
          <EmptyListMessage>Cart is empty</EmptyListMessage>
        )}
      </Box>
    </motion.div>
  );
}

export function WebCart({ type }) {
  const { cartContext, setCartContext } = useContext(CartContext);
  const { loadingScreen, setLoadingScreen } = useContext(LoadingScreenContext);

  useEffect(() => {
    (async () => {
      await cartContext.fetchCart(setCartContext);
      setLoadingScreen({ ...loadingScreen, visible: false, variant: null });
    })();
  }, []);
  return (
    <Box>
      {cartContext.products.length ? (
        <React.Fragment>
          <OrdersBlock type={type} />
        </React.Fragment>
      ) : (
        <EmptyListMessage>Cart is empty</EmptyListMessage>
      )}
    </Box>
  );
}

export function OrdersBlock(props) {
  const { cartContext } = useContext(CartContext);
  const { setDialogContext } = useContext(DialogContext);
  const { userContext } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  console.log(cartContext.products);
  return (
    <Block title="" p={0}>
      {cartContext.products
        .filter(
          (q) =>
            JSON.stringify(q).toLowerCase().indexOf(`"type":"${props.type}"`) >=
            0
        )
        .map((item) => (
          <ProductCard
            product={item.product}
            key={item.product.id}
            variant="small"
            header={
              <Box position="absolute" top={10} right={0}>
                <IconButton
                  onClick={() =>
                    setDialogContext({
                      visible: true,
                      title: "Remove to Cart",
                      message: (
                        <Box>
                          <Typography>
                            Do you want to remove this item to your cart?
                          </Typography>
                          <ProductCard
                            product={item.product}
                            key={item.product.id}
                            variant="small"
                          >
                            <Typography>Quantity {item.quantity}</Typography>
                          </ProductCard>
                        </Box>
                      ),
                      actions: [
                        {
                          name: "YES",
                          callback: ({ closeDialog, setLoading }) => {
                            setLoading(true);
                            cartContext.removeFromCart(
                              item,
                              userContext,
                              () => {
                                closeDialog();
                                setLoading(false);
                                enqueueSnackbar("Removed", {
                                  variant: "success",
                                });
                              }
                            );
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
                    })
                  }
                >
                  <Icon>close</Icon>
                </IconButton>
              </Box>
            }
          >
            <Typography>Quantity {item.quantity}</Typography>
          </ProductCard>
        ))}
    </Block>
  );
}

export function AddToCart(props) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const bcontext = useContext(BottomNavContext);
  const { userContext } = useContext(UserContext);
  const [product, setProduct] = useState(
    props.location?.state || props.product || {}
  );
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const { cartContext } = useContext(CartContext);
  const { enqueueSnackbar } = useSnackbar();
  const [ratings, setRatings] = useState(true);
  const rateRef = useRef();
  const rateMessage = useRef();

  const rateProduct = useCallback(() => {
    fetchData({
      send: async () =>
        await Api.post("/rate/merchant", {
          body: {
            user_id: userContext.user_id,
            ratee_id: product.id,
            rate_number: rateRef.current,
            rate_message: rateMessage.current,
            is_product: 1,
          },
        }),
      after: (data) => {},
    });
  }, [product]);

  const closeOrGoback = useCallback(() => {
    if (props.onClose) {
      props.onClose();
    } else {
      goBackOrPush("/");
    }
  }, [props.onClose]);
  const addToCart = useCallback(
    ({ product, quantity }) => {
      setSaving(true);
      const {
        merchant,
        id,
        store,
        categories,
        images,
        price,
        sale_price,
        name,
        regular_price,
        type,
      } = product;
      const order = { quantity };
      order.product = {
        id,
        store,
        categories,
        images,
        price,
        regular_price,
        sale_price,
        name,
        merchant,
        type,
      };
      cartContext.addToCart(order, userContext, () => {
        setSaving(false);
        closeOrGoback();
        enqueueSnackbar(
          <React.Fragment>
            <Typography>Added to cart</Typography>
            <Button
              onClick={() =>
                props.history
                  ? props.history.replace("/cart")
                  : (window.location = "/cart")
              }
              style={{
                color: "#fff",
                fontWeight: "800",
                textDecoration: "underline",
              }}
            >
              View Cart
            </Button>
          </React.Fragment>,
          {
            variant: "info",
          }
        );
      });
    },
    [props.history]
  );
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: false });
  }, []);

  useEffect(() => {
    fetchData({
      send: async () =>
        await Api.get(
          "/ratings?user_id=" +
            userContext.user_id +
            "&product_id=" +
            product.id
        ),
      after: (ratings) => {
        setRatings(ratings);
      },
    });
  }, [product]);
<<<<<<< HEAD
  const [tabValue, setTabValue] = useState(0);
=======
>>>>>>> a7ecbcf9b69d192f7b09530a945f85c6ff6bad93

  return product.id ? (
    <motion.div animate="in" exit="out" initial="initial" variants={slideRight}>
      <Box p={3}>
        <ScreenHeader
          title={!product.edit ? "" : "Edit Order"}
          disabled={saving}
          pushTo={() => closeOrGoback()}
        />
        <Container>
          <ProductCard product={product}>
            <CartRow title="Quantity">
              <InputQuantity
                onChange={(qty) => setQuantity(qty)}
                disabled={saving}
              />
            </CartRow>
            <CartRow title="Total">
              <Typography
                variant="h5"
                color="primary"
                style={{ fontWeight: 700 }}
              >
                <CurrencyFormat
                  value={quantity * product.price}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix="PHP "
                />
              </Typography>
            </CartRow>
          </ProductCard>
          <br />
          <SavingButton
            saving={saving}
            className="themed-button"
            onClick={() => addToCart({ product, quantity })}
            disabled={saving}
          >
            Add To Cart
          </SavingButton>
          <br />
          <br />
          {/* <Button
            className="themed-button inverted"
            onClick={() => closeOrGoback()}
            disabled={saving}
          >
            Cancel
          </Button> */}
<<<<<<< HEAD

          <Box>
            <Box m={1} style={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                fullWidth
                onChange={(e, val) => setTabValue(val)}
                sx={{
                  width: "100%",
                }}
              >
                <Tab label={<AnimateOnTap>Description</AnimateOnTap>} />
                <Tab label={<AnimateOnTap>Ratings and Reviews</AnimateOnTap>} />
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
            <Box>
              {!ratings?.rated && (
                <CartColumn title="Add Review" style={{ display: "flex" }}>
                  <Rating
                    name="size-medium"
                    onChange={(e) => {
                      rateRef.current = e.target.value;
                    }}
                  />
                  <TextField
                    variant="outlined"
                    label="Comment"
                    onChange={(e) => {
                      rateMessage.current = e.target.value;
                    }}
                  />
                  <Button onClick={rateProduct}>Submit</Button>
                </CartColumn>
              )}
            </Box>
            {ratings?.ratings?.map((rating) => (
              <>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: 16,
                  }}
                >
                  <Avatar
                    src={rating.user_fname}
                    alt={rating.user_fname}
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: "#1aa3e9",
                    }}
                  />{" "}
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      paddingLeft: 25,
                    }}
                  >
                    {" "}
                    <Typography variant="h5" style={{ fontWeight: "700" }}>
                      {rating.user_fname} {rating.user_lname}
                    </Typography>
                    <Rating
                      name="half-rating-read"
                      defaultValue={rating.rate_number}
                      readOnly
                      size="small"
                      emptyIcon={
                        <StarIcon
                          fontSize="inherit"
                          style={{ color: "#D9DBE9" }}
                        />
                      }
                      icon={<StarIcon fontSize="inherit" />}
                      style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                    {rating.rate_message}
                  </Box>
                </Box>
                <Divider style={{ marginBottom: 16 }} />
              </>
            ))}
          </SwipeableViews>
=======
          {!ratings?.rated && (
            <CartColumn title="Rate">
              <Rating
                name="half-rating-read"
                precision={0.5}
                onChange={(e) => {
                  rateRef.current = e.target.value;
                }}
              />
              <TextField
                label="Comment"
                onChange={(e) => {
                  rateMessage.current = e.target.value;
                }}
              />
              <Button onClick={rateProduct}>Submit</Button>
            </CartColumn>
          )}
          {ratings?.ratings?.map((rating) => (
            <>
              {rating.rate_number}
              <br />
              <b>{rating.user_fname}</b>
              <br />
              <b>{rating.rate_message}</b>
              <br />
            </>
          ))}
>>>>>>> a7ecbcf9b69d192f7b09530a945f85c6ff6bad93
        </Container>
        <Box
          style={{
            margin: "0 auto",
            minHeight: "100vh",
            width: isMd ? "" : "1400px",
          }}
        >
          <Footer />
        </Box>
      </Box>
    </motion.div>
  ) : null;
}

export function CartRow(props) {
  return (
    <Box marginTop={3} className="center-all" justifyContent="space-between">
      <Typography style={{ marginRight: 10 }}>{props.title}</Typography>
      {props.children}
    </Box>
  );
}
export function CartColumn(props) {
  return (
    <Box marginBottom={3}>
      <Typography style={{ marginRight: 10 }}>{props.title}</Typography>
      {props.children}
    </Box>
  );
}
export default Cart;

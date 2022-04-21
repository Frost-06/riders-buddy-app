import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SwipeableViews from "react-swipeable-views";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import CartIcon from "../../components/CartIcon";
import EmptyListMessage from "../../components/EmptyListMessage";
import { SalePrice } from "../../components/Product";
import BottomNavContext from "../../context/BottomNavContext";
import CartContext from "../../context/CartContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import {
  fadeInOut,
  fadeInOutFunc,
  slideBottom,
  slideRightFunc,
} from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { goBackOrPush } from "../../utils/goBackOrPush";
import { AddToCart } from "./Cart";

const SelectedProduct = React.createContext();

function Merchant(props) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <SelectedProduct.Provider value={{ selectedProduct, setSelectedProduct }}>
      <Dialog
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        fullScreen
        style={{
          padding: 0,
        }}
      >
        <DialogContent>
          <AddToCart
            product={selectedProduct}
            {...props}
            onClose={() => setSelectedProduct(null)}
          />
        </DialogContent>
      </Dialog>
      <MerchantView {...props}>
        <CartIcon />
      </MerchantView>
    </SelectedProduct.Provider>
  );
}

function MerchantView(props) {
  const ref = useRef();
  const { merchant_id } = props.match.params;
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  const bcontext = useContext(BottomNavContext);
  const [merchant, setMerchant] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState();
  const [contentYState, setContentY] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const contentY = useMotionValue(0);
  const imgOpacity = useTransform(contentY, [-175, 0], [0.2, 0.7]);
  const logoOpacity = useTransform(contentY, [-175, 0], [1, 0]);
  const nameOpacity = useTransform(contentY, [-175, 0], [0, 1]);
  const imgScale = useTransform(contentY, [-175, 0], [1, 1.5]);
  const iconColor = useTransform(contentY, [-175, 0], ["#757575", "#ffffff"]);
  const borderRadius = useTransform(contentY, [-175, 0], [0, 30]);
  const search = useCallback(
    (element) => {
      if (!element) {
        setContentY(-175);
        setIsSearching(!isSearching);
        contentY.set(-175);
        return;
      } else if (element.value) {
        (async () => {
          setLoading(true);
          let result = await new Promise(function (resolve, reject) {
            window.searching = setInterval(() => {
              if (window.products?.length) {
                let result = window.products.filter(
                  (q) =>
                    JSON.stringify(q)
                      .toLowerCase()
                      .indexOf(element.value.toLowerCase()) >= 0
                );
                resolve(
                  result.map((q) => ({
                    ...q,
                    categories: [{ id: 1, name: "Search Results" }],
                  }))
                );
              }
            }, 1000);
          });
          window.clearInterval(window.searching);
          setSearchResult(result);
          setLoading(false);
        })();
      }
    },
    [isSearching, window.products]
  );
  useEffect(() => {
    window.products = [];
    bcontext.setBottomNavContext({
      ...bcontext.bottomNavContext,
      visible: false,
    });
  }, []);
  useEffect(() => {
    if (merchant_id) {
      fetchData({
        send: async () => await Api.get("/merchants/" + merchant_id + "/data"),
        after: (data) => {
          if (data) {
            const { categories, products, merchant } = data;
            setMerchant(merchant);
            setProducts(products);
            window.products = products;
            setCategories(categories);
          }
        },
      });
    }
  }, [merchant_id]);
  contentY.onChange((t) => {
    setContentY(t);
  });
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={fadeInOutFunc({
        out: {
          transition: {
            delay: 0.2,
          },
        },
      })}
      style={{ height: "100%", overflow: "hidden" }}
    >
      {isSearching && (
        <Box className="search-input">
          <IconButton onClick={() => setIsSearching(false)}>
            <Icon>close</Icon>
          </IconButton>
          <TextField
            id="search-val"
            className="themed-input"
            variant="outlined"
            type="text"
            fullWidth
            placeholder="Product Name"
            onKeyDown={(e) => {
              if (e.key === "Enter")
                search(document.querySelector("#search-val"));
            }}
          />
          <Button
            className="themed-button"
            onClick={() => search(document.querySelector("#search-val"))}
          >
            <Icon>search</Icon>
          </Button>
        </Box>
      )}
      <AnimateOnTap className="fixed left">
        <IconButton
          className="back-button"
          onClick={() => {
            goBackOrPush(props.path || "/");
          }}
        >
          <motion.span
            style={{ color: iconColor }}
            className="material-icons MuiIcon-root MuiIcon-fontSizeLarge"
          >
            <Icon fontSize="large">navigate_before</Icon>
          </motion.span>
        </IconButton>
      </AnimateOnTap>
      <AnimateOnTap className="fixed right">
        <IconButton
          className="back-button"
          onClick={() => {
            search();
          }}
        >
          <motion.span
            style={{ color: iconColor, scale: 0.8 }}
            className="material-icons MuiIcon-root MuiIcon-fontSizeLarge"
          >
            <Icon fontSize="large">search</Icon>
          </motion.span>
        </IconButton>
      </AnimateOnTap>
      <Box style={{ height: "100%" }} ref={ref}>
        <Box style={{ height: "100%" }}>
          <Box
            className={
              "merchant-banner" +
              (merchant.vendor?.vendor_banner ? "" : " no-image")
            }
          >
            {merchant.vendor?.vendor_banner && (
              <motion.img
                src={merchant.vendor.vendor_banner}
                alt={merchant.vendor?.vendor_shop_name}
                width="100%"
                style={{ opacity: imgOpacity, scale: imgScale }}
              />
            )}
          </Box>
          <motion.div
            animate="in"
            exit="out"
            initial="initial"
            variants={slideBottom}
            transition={{ delay: 0.2 }}
            style={{ height: "100%" }}
          >
            <motion.div
              className="merchant-content-header"
              style={{ borderRadius }}
              drag="y"
              dragConstraints={{
                top: -175,
                bottom: 0,
              }}
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 1000, bounceDamping: 20 }}
              y={contentY}
            >
              <Icon
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                }}
              >
                minimize
              </Icon>
              <motion.div
                className="center-all"
                style={{
                  opacity: nameOpacity,
                  padding: 24,
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  variant="h6"
                >
                  {merchant.vendor?.vendor_shop_name}
                </Typography>
                {!merchant.vendor?.errors &&
                  !merchant.vendor?.vendor_shop_name && (
                    <Skeleton animation="wave" width="100%" height={55} />
                  )}
                <IconButton
                  onClick={() =>
                    history.push({
                      pathname: "/merchant/" + merchant_id + "/details",
                      state: { merchant },
                    })
                  }
                  color="primary"
                >
                  <Icon>info</Icon>
                </IconButton>
              </motion.div>
              {!isSearching && (
                <motion.img
                  src={"/static/images/logo/horizontal.png"}
                  alt={merchant.vendor?.vendor_shop_name}
                  className="merchant-logo"
                  style={{ opacity: logoOpacity }}
                />
              )}
            </motion.div>

            {isSearching ? (
              <Products
                categories={[{ name: "Search Result", id: 1 }]}
                products={searchResult}
                y={contentYState}
                loading={loading}
                searching={true}
              />
            ) : (
              <Products
                categories={categories}
                products={products}
                y={contentYState}
                loading={loading}
              />
            )}
          </motion.div>
        </Box>
      </Box>
      {props.children}
    </motion.div>
  );
}

function Products(props) {
  const { categories, products } = props;
  const [tabValue, setTabValue] = useState(0);
  const { cartContext, setCartContext } = useContext(CartContext);
  const { bottomNavContext } = useContext(BottomNavContext);
  const { setSelectedProduct } = useContext(SelectedProduct);

  useEffect(
    () => setTabValue(props.searching ? 0 : tabValue),
    [props.searching]
  );
  const ListProducts = useCallback(
    (category) => {
      const p = products?.filter((q) => {
        const forThisCategory = q.categories?.find((qq) => {
          return qq.id === category.id;
        });
        return !!forThisCategory;
      });
      return (
        <React.Fragment>
          {p?.map((product, index) => {
            const image = product?.images[0] ? product.images[0].src : "";
            return (
              <Box
                width="100%"
                key={index}
                display="flex"
                justifyContent="flex-start"
                component={ButtonBase}
                onClick={() => setSelectedProduct(product)}
              >
                <Box
                  minWidth={100}
                  minHeight={100}
                  width={100}
                  borderRadius={20}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  m={2}
                  position="relative"
                >
                  <img src={image} alt={product.name} width="100%" />
                  {product.sale_price && (
                    <SalePrice>
                      {parseInt(
                        (parseFloat(product.sale_price) /
                          parseFloat(product.regular_price)) *
                          100
                      )}
                      % OFF
                    </SalePrice>
                  )}
                </Box>
                <Box textAlign="left">
                  <Typography style={{ fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography color="primary" style={{ fontWeight: 600 }}>
                    PHP {product.price}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </React.Fragment>
      );
    },
    [products, cartContext.products]
  );
  return (
    <Box
      className="column-flex-100"
      style={{ transform: `translateY(${props.y}px)` }}
      // eslint-disable-next-line react/jsx-no-duplicate-props
      className="merchant-content-view"
    >
      {categories && products?.length === 0 && !props.searching ? (
        <EmptyListMessage>No available products</EmptyListMessage>
      ) : null}
      {(!categories || props.loading) && (
        <React.Fragment>
          <Box className="center-all">
            {new Array(3).fill(1).map((q, i) => (
              <Box
                key={i}
                p={2}
                width="33%"
                height={30}
                paddingRight={i === 2 ? 2 : 0}
              >
                <Skeleton animation="wave" width="inherit%" height="inherit" />
              </Box>
            ))}
          </Box>
          <Box marginTop={4}>
            {new Array(10).fill(1).map((q, i) => (
              <Box
                key={i}
                p={2}
                marginBottom={1}
                paddingTop={0}
                width="100%"
                className="center-all"
                style={{ opacity: 1 - i / 3 }}
              >
                <Box display="flex" width="100%">
                  <Skeleton
                    animation="wave"
                    width={100}
                    style={{ minWidth: 100, marginRight: 10 }}
                    height={100}
                  />
                  <Box width="100%">
                    <Skeleton animation="wave" width="100%" height={20} />
                    <br />
                    <Skeleton animation="wave" width="100%" height={40} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </React.Fragment>
      )}
      <Tabs
        // centered
        value={tabValue}
        fullWidth
        onChange={(e, val) => setTabValue(val)}
      >
        {categories?.map((category, index) => (
          <Tab
            key={index}
            label={<AnimateOnTap>{category.name}</AnimateOnTap>}
          ></Tab>
        ))}
      </Tabs>
      <SwipeableViews
        resistance
        index={tabValue}
        onChangeIndex={(index) => {
          setTabValue(index);
        }}
        style={{
          height: "100%",
          paddingBottom: bottomNavContext.visible ? 60 : 0,
        }}
        className="swipeable-products"
        onSwitching={(t) => {
          if (!(t % 1))
            document.querySelector(".swipeable-products").scrollTop = 0;
        }}
      >
        {categories?.map((category, index) => ListProducts(category))}
      </SwipeableViews>
    </Box>
  );
}

export default Merchant;

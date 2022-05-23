import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardHeader,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  styled,
  Typography,
  CardContent,
  Grid,
  CardActions,
} from "@material-ui/core";
import { Rating, Skeleton } from "@material-ui/lab";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { history } from "../App";
import BottomNavContext from "../context/BottomNavContext";
import { AddToCart } from "../screens/services/Cart";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";
import AnimateOnTap from "./AnimateOnTap";
import { MechanicIncluded, Price, SalePrice } from "./Product";
import { motion } from "framer-motion";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { StarIcon } from "../misc/CustomIcons";

function ProductArchive(props) {
  var randomNumber = 20;

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastPage, setLastPage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { bottomNavContext, setBottomNavContext } =
    useContext(BottomNavContext);
  const unSelectProduct = useCallback(() => {
    setBottomNavContext({ ...bottomNavContext, visible: true });
    setSelectedProduct(null);
  }, [bottomNavContext, setSelectedProduct]);
  const getProducts = useCallback(() => {
    fetchData({
      before: async () => setLoading(true),
      send: async () =>
        await Api.post("/products", {
          body: {
            per_page: 5,
            page,
            ...(props.params ? props.params : {}),
          },
        }),
      after: (data) => {
        if (data?.length) setProducts([...products, ...data]);
        else setLastPage(true);
        setLoading(false);
        setPage(page + 1);
      },
    });
  }, [page]);
  useEffect(() => {
    getProducts();
  }, []);

  const StyledRating = styled(Rating)({
    "& .MuiRating-icon": {
      color: "#A0A3BD",
    },

    "& .MuiRating-iconFilled": {
      color: "#E61B00",
    },
    "& .MuiRating-iconHover": {
      color: "#E61B00",
    },
  });
  // const items = products.sort(() => Math.random() - Math.random()).slice(0, 5);
  const items = products.sort();
  return (
    <React.Fragment>
      <Dialog
        open={selectedProduct !== null}
        onClose={() => unSelectProduct()}
        fullScreen
        style={{
          padding: 0,
        }}
      >
        <DialogContent>
          <AddToCart
            product={selectedProduct}
            {...props}
            onClose={() => unSelectProduct()}
          />
        </DialogContent>
      </Dialog>

      <Box className="product-archive">
        {items &&
          items.map((item, i) => (
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{
                scale: 1.1,
              }}
              transition={{
                ease: "easeIn",
                duration: 0.1,
              }}
            >
              <Box
                key={i}
                className="product"
                component={ButtonBase}
                onClick={() => setSelectedProduct(item)}
              >
                {/* {item.ratings.average} ({item.ratings.rating_count}) */}
                <div className="image">
                  <img src={item.images[0]?.src} alt={item.name} />
                </div>
                <Typography
                  style={{
                    width: "100%",
                    textAlign: "left",
                    textJustify: "inter-word",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: "700",
                  }}
                  variant="subtitle1"
                >
                  {item.name}
                </Typography>
                <Box
                  variant="body2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    alignContent: "center",
                  }}
                >
                  <Rating
                    name="half-rating-read"
                    defaultValue={item.ratings.average}
                    precision={0.5}
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
                  &nbsp;&nbsp;
                  <Typography variant="caption" style={{ color: "#6E7191" }}>
                    ({item.ratings.rating_count}) reviews
                  </Typography>
                </Box>
                <Typography style={{ marginTop: 6 }}>Starting at:</Typography>
                <Typography
                  variant="h5"
                  color="primary"
                  style={{ fontWeight: "800", marginTop: -10 }}
                >
                  PHP {item.price}
                </Typography>
                <Typography style={{ color: "#fff", fontSize: "1px" }}>
                  {item.stock_status}
                  {item.stock_quantity}
                </Typography>
                {item.type === "external" && <MechanicIncluded />}

                {item.sale_price && (
                  <SalePrice>
                    {parseInt(
                      ((parseFloat(item.regular_price) -
                        parseFloat(item.sale_price)) /
                        parseFloat(item.regular_price)) *
                        100
                    )}
                    % OFF
                  </SalePrice>
                )}
              </Box>
            </motion.div>
          ))}
        {loading &&
          new Array(5)
            .fill(1)
            .map((q, i) => (
              <Skeleton
                className="product"
                height={330}
                key={i}
                style={{ marginBottom: 24 }}
              />
            ))}
      </Box>
      {!loading && !lastPage && (
        <AnimateOnTap>
          <Button
            className="themed-button inverted"
            onClick={() => getProducts()}
          >
            Load More
          </Button>
        </AnimateOnTap>
      )}
    </React.Fragment>
  );
}

export default ProductArchive;

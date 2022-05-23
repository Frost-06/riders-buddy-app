import {
  Icon,
  Box,
  Button,
  ButtonBase,
  Paper,
  TextField,
  Typography,
  Container,
} from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import { motion } from "framer-motion";
import HorizontalScroll from "../../components/HorizontalScroll";
import ProductArchive from "../../components/ProductArchive";
import { DOMAIN } from "../../utils/api";
import { Block } from "../home";
import { Rating, Skeleton } from "@material-ui/lab";
import { StarIcon } from "../../misc/CustomIcons";
import fetchData from "../../utils/fetchData";
import UserContext from "../../context/UserContext";
import Api, { MapBoxApi } from "../../utils/api";

function Epagakain(props) {
  const { merchants } = props.service;
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState();

  useEffect(() => {
    fetchData({
      before: async () => setLoading(true),
      send: async () => await Api.get("/stores"),
      after: (data) => {
        setStores(data);
        setLoading(false);
      },
    });
  }, []);

  return (
    <Box width="100%" height="100%">
      {!props.hidden?.blocks["restaurants"] && (
        <Block
          p={0}
          title="Browse Shops"
          titleStyle={{
            paddingLeft: 24,
            paddingBottom: 0,
            paddingTop: 25,
          }}
        >
          <HorizontalScroll>
            {stores &&
              stores.map((store, i) => (
                <Box key={i} className="merchant-card">
                  <AnimateOnTap key={i} whileTap={{ opacity: 0.8 }}>
                    <MerchantCard merchant={store} />
                  </AnimateOnTap>
                </Box>
              ))}
          </HorizontalScroll>
          <HorizontalScroll>
            {loading &&
              new Array(5).fill(1).map((q, i) => (
                <Box style={{ display: "inline-flex", flexGap: 1 }}>
                  <Skeleton
                    className="merchant-card"
                    width={248}
                    height={284}
                    key={i}
                    style={{ marginRight: 24, borderRadius: 16 }}
                  />
                </Box>
              ))}
          </HorizontalScroll>
        </Block>
      )}
      {!props.hidden?.blocks["products"] && (
        <Block
          title="Product and Services"
          style={{ paddingBottom: "13px !important" }}
        >
          <ProductArchive
            params={props.blocks?.params["products"] || {}}
            history={props.history}
          />
        </Block>
      )}
    </Box>
  );
}
function MerchantCard(props) {
  const [distance, setDistance] = useState();
  var randomNumber = 20;
  const { userContext } = useContext(UserContext);
  const address = (() => {
    const { street, barangay, city, zip } = userContext.default_address;
    return `${street ? street + ", " : ""}${barangay}, ${city}, ${zip}`;
  })();

  useEffect(() => {
    MapBoxApi.getDistance(
      address,
      props.merchant.merch.merch_long + "," + props.merchant.merch.merch_lat
    ).then((data) => {
      const { routes } = data || {};
      if (routes?.length) {
        setDistance(Math.round(routes[0].distance * 0.001, 2) + "KM");
      }
    });
  }, []);

  return (
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
      <Box style={{ paddingRight: 16 }}>
        {/* {stores &&
          stores.map((store) => ( */}
        <Box
          key={props.merchant.vendor_id}
          className="merchant"
          component={ButtonBase}
          onClick={() => history.push("/merchant/" + props.merchant.vendor_id)}
        >
          <Typography
            variant="body2"
            style={{
              background:
                "linear-gradient(281.86deg, #76C8F2 11.84%, #1AA3E9 63.88%)",
              padding: 6,
              border: "1px solid #1AA3E9",
              color: "#fff",
              borderRadius: 8,
              marginTop: 24,
              fontWeight: "800",
            }}
          >
            {distance}
          </Typography>
          <div className="image">
            <img
              src={props.merchant.vendor_shop_logo}
              alt={props.merchant.vendor_display_name}
            />
          </div>
          <Typography
            style={{
              width: "100%",
              textAlign: "left",
              textJustify: "inter-word",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "700",
            }}
            variant="subtitle1"
          >
            {props.merchant.vendor_shop_name}
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
              defaultValue={props.merchant.ratings.average}
              precision={0.5}
              readOnly
              size="small"
              emptyIcon={
                <StarIcon fontSize="inherit" style={{ color: "#D9DBE9" }} />
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
              ({props.merchant.ratings.rating_count})
            </Typography>
          </Box>
        </Box>
        {/* ))} */}
      </Box>
    </motion.div>
  );
}

export default Epagakain;

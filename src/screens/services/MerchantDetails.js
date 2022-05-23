import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@material-ui/core";
import { Rating, Skeleton } from "@material-ui/lab";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Marker, StaticMap } from "react-map-gl";
import ScreenHeader from "../../components/ScreenHeader";
import { slideRight } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { Block } from "../home";
import { CartColumn } from "./Cart";
import InnerHTML from "dangerously-set-html-content";
import UserContext from "../../context/UserContext";
import { StarIcon } from "../../misc/CustomIcons";

function MerchantDetails(props) {
  const { userContext } = useContext(UserContext);
  const { merchant_id } = props.match.params;
  const [ratings, setRatings] = useState(true);
  const rateRef = useRef();
  const rateMessage = useRef();
  const [merchant, setMerchant] = useState(
    props.location.state?.merchant || {}
  );
  const vendor = useMemo(() => merchant?.vendor, [merchant]);

  const rateMerchant = useCallback(() => {
    fetchData({
      send: async () =>
        await Api.post("/rate/merchant", {
          body: {
            user_id: userContext.user_id,
            ratee_id: merchant.merch_id,
            rate_number: rateRef.current,
            rate_message: rateMessage.current,
          },
        }),
      after: (data) => {
        // if (data) {
        //   const { merchant } = data;
        //   setMerchant(merchant);
        // }
      },
    });
  }, [merchant]);
  useEffect(() => {
    if (!Object.keys(props.location.state?.merchant || {}).length) {
      if (merchant_id) {
        fetchData({
          send: async () =>
            await Api.get("/merchants/" + merchant_id + "/data"),
          after: (data) => {
            if (data) {
              const { merchant } = data;
              fetchData({
                send: async () =>
                  await Api.get(
                    "/ratings?user_id=" +
                      userContext.user_id +
                      "&merchant_id=" +
                      merchant.merch_id
                  ),
                after: (ratings) => {
                  setMerchant(merchant);
                  setRatings(ratings);
                },
              });
            }
          },
        });
      }
    }
  }, []);
  return (
    <motion.div variants={slideRight} initial="initial" animate="in" exit="out">
      <Box
        p={3}
        style={{
          background: `url(${vendor?.vendor_banner})`,
        }}
        className="merchant-details-banner"
      >
        {!Object.keys(merchant).length ? (
          <Skeleton
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 20,
              pointerEvents: "none",
            }}
            animation="wave"
          />
        ) : null}
        <ScreenHeader title={vendor?.vendor_shop_name} replace={true} />
        <Block p={0} title="">
          <Box className="center-all" justifyContent="flex-start">
            <Avatar
              src={vendor?.vendor_shop_logo}
              alt={vendor?.vendor_display_name}
              style={{ width: 110, height: 110, marginRight: 14 }}
              variant="square"
            />
          </Box>
        </Block>
      </Box>
      <Block
        title="Information"
        style={{
          fontFamily: "Sans-serif",
        }}
      >
        <CartColumn title="Description">
          <span
            dangerouslySetInnerHTML={{
              __html: vendor?.vendor_description,
            }}
          ></span>
        </CartColumn>
        <CartColumn title="Location">
          {Object.keys(merchant).length &&
          !isNaN(parseFloat(merchant.merch_lat)) &&
          !isNaN(parseFloat(merchant.merch_long)) ? (
            <Box
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${merchant.merch_lat},${merchant.merch_long}`,
                  "_blank"
                );
              }}
            >
              <StaticMap
                width="100%"
                height={150}
                mapStyle="mapbox://styles/azkalonz/ckhpxvrmj072r19pemg86ytbk"
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                latitude={parseFloat(merchant?.merch_lat - 0.0004)}
                longitude={parseFloat(merchant?.merch_long - 0.002)}
                zoom={15}
                className="checkout-static-map"
              >
                <Marker
                  latitude={parseFloat(merchant?.merch_lat)}
                  longitude={parseFloat(merchant?.merch_long)}
                >
                  <div
                    className={"center-pin"}
                    style={{ position: "relative" }}
                  >
                    <Avatar
                      src={vendor?.vendor_shop_logo}
                      alt={vendor?.vendor_display_name}
                      style={{
                        width: 20,
                        height: 20,
                        position: "absolute",
                        left: -20,
                        top: -2,
                      }}
                    />
                    <span className="icon-location"></span>
                  </div>
                </Marker>
              </StaticMap>
            </Box>
          ) : null}
        </CartColumn>
        <Box style={{ padding: 24 }}>
          Average Rating
          <Typography variant="h2">
            {!parseInt(ratings?.average) && "No Rating Yet"}
          </Typography>
          <Rating
            name="half-rating-read"
            defaultValue={ratings?.average}
            readOnly
            size="large"
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
          <Box>
            {!ratings?.rated && (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: 250,
                  justifyContent: "space-between",
                }}
              >
                <Typography>Add Review</Typography>
                <Rating
                  name="size-medium"
                  onChange={(e) => {
                    rateRef.current = e.target.value;
                  }}
                />
                <TextField
                  variant="outlined"
                  label="Your review"
                  onChange={(e) => {
                    rateMessage.current = e.target.value;
                  }}
                  multiline
                  rows={4}
                  style={{ height: "100px !important" }}
                />
                <Button
                  variant="contained"
                  className="themed-button inverted"
                  onClick={rateMerchant}
                >
                  Submit
                </Button>
              </Box>
            )}
          </Box>
          {ratings?.ratings?.map((rating) => (
            <Box style={{ marginTop: 16 }}>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 16,
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
              <Divider style={{ marginTop: 16, marginBottom: 16 }} />
            </Box>
          ))}
        </Box>
      </Block>
    </motion.div>
  );
}

export default MerchantDetails;

import { Avatar, Box } from "@material-ui/core";
import { Rating, Skeleton } from "@material-ui/lab";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { Marker, StaticMap } from "react-map-gl";
import ScreenHeader from "../../components/ScreenHeader";
import { slideRight } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { Block } from "../home";
import { CartColumn } from "./Cart";

function MerchantDetails(props) {
  const { merchant_id } = props.match.params;
  const [merchant, setMerchant] = useState(
    props.location.state?.merchant || {}
  );
  const vendor = useMemo(() => merchant?.vendor, [merchant]);
  useEffect(() => {
    if (!Object.keys(props.location.state?.merchant || {}).length) {
      if (merchant_id) {
        fetchData({
          send: async () =>
            await Api.get("/merchants/" + merchant_id + "/data"),
          after: (data) => {
            if (data) {
              const { merchant } = data;
              setMerchant(merchant);
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
        <ScreenHeader title={vendor?.vendor_display_name} replace={true} />
        <Block p={0} title="">
          <Box className="center-all" justifyContent="flex-start">
            <Avatar
              src={vendor?.vendor_shop_logo}
              alt={vendor?.vendor_display_name}
              style={{ width: 110, height: 110, marginRight: 14 }}
              variant="square"
            />
            <Rating
              name="half-rating-read"
              defaultValue={4.5}
              precision={0.5}
              readOnly
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
            dangerouslySetInnerHTML={{ __html: vendor?.vendor_description }}
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
      </Block>
    </motion.div>
  );
}

export default MerchantDetails;

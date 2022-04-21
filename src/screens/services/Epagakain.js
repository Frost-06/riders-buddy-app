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
import React from "react";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import { motion } from "framer-motion";
import HorizontalScroll from "../../components/HorizontalScroll";
import ProductArchive from "../../components/ProductArchive";
import { DOMAIN } from "../../utils/api";
import { Block } from "../home";
import { Rating } from "@material-ui/lab";
import { StarIcon } from "../../misc/CustomIcons";

function Epagakain(props) {
  const { merchants } = props.service;
  return (
    <Box width="100%" height="100%">
      {!props.hidden?.blocks["restaurants"] && (
        <Block
          p={0}
          title="Popular Shops"
          titleStyle={{
            paddingLeft: 24,
            paddingBottom: 0,
            paddingTop: 25,
          }}
        >
          <HorizontalScroll>
            {merchants?.map((m, i) => (
              <Box key={i} m={1} className="merchant-card">
                <AnimateOnTap whileTap={{ opacity: 0.8 }}>
                  <MerchantCard merchant={m} />
                </AnimateOnTap>
              </Box>
            ))}
          </HorizontalScroll>
        </Block>
      )}
      {!props.hidden?.blocks["products"] && (
        <Block title="Product and Services">
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
  const { merch_banner, merch_name, merch_wp_id } = props.merchant;
  var randomNumber = 20;
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
      <Box
        className="merchant"
        component={ButtonBase}
        onClick={() => history.push("/merchant/" + merch_wp_id)}
      >
        <div className="image">
          <img
            src={DOMAIN + "/storage/merchants/" + merch_banner}
            alt={merch_name}
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
          {merch_name}
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
            defaultValue={parseFloat(50 / 25)}
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
            {randomNumber + 11}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

export default Epagakain;

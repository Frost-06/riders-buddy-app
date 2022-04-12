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
import HorizontalScroll from "../../components/HorizontalScroll";
import ProductArchive from "../../components/ProductArchive";
import { DOMAIN } from "../../utils/api";
import { Block } from "../home";

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
              <Box key={i} width={150} height={200} m={1} marginBottom="18px">
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
  return (
    <Box
      className="inherit-all"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width={150}
      height={200}
      overflow="hidden"
      borderRadius={20}
      component={Paper}
      onClick={() => history.push("/merchant/" + merch_wp_id)}
    >
      <Box
        component={ButtonBase}
        display="flex"
        className="inherit-all"
        justifyContent="center"
        overflow="hidden"
      >
        <img
          src={DOMAIN + "/storage/merchants/" + merch_banner}
          alt={merch_name}
          height="100%"
          width="auto"
        />
      </Box>
      <Box p={2}>
        <Typography
          color="primary"
          style={{
            fontWeight: 700,
            fontSize: "1em",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {merch_name}
        </Typography>
      </Box>
    </Box>
  );
}

export default Epagakain;

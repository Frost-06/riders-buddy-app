import {
  Box,
  Button,
  ButtonBase,
  Icon,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { history } from "../../App";
import AnimateOnTap from "../../components/AnimateOnTap";
import HorizontalScroll from "../../components/HorizontalScroll";
import ScreenHeader from "../../components/ScreenHeader";
import { DOMAIN } from "../../utils/api";

function Epabili(props) {
  const { merchants } = props.service;
  useEffect(() => {
    history.push({
      pathname: "/checkout",
      state: {
        service_name: "e-pabili",
        merchant: props.merchant,
      },
    });
  }, []);
  return null;
  // <Box width="100vw" height={200}>
  //   <HorizontalScroll>
  //     {merchants?.map((m, i) => (
  //       <Box key={i} width={150} height={200} m={1}>
  //         <AnimateOnTap whileTap={{ opacity: 0.8 }}>
  //           <MerchantCard merchant={m} />
  //         </AnimateOnTap>
  //       </Box>
  //     ))}
  //   </HorizontalScroll>
  // </Box>
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
      onClick={() =>
        history.push({
          pathname: "/checkout",
          state: {
            service_name: "e-pabili",
            merchant: props.merchant,
          },
        })
      }
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
            fontSize: "1.2em",
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

export default Epabili;

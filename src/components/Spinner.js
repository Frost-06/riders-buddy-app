import { Box, CircularProgress, Divider } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { motion } from "framer-motion";
import React, { useMemo } from "react";

function Spinner(props) {
  const templates = useMemo(
    () => ({
      home: HomeSpinner,
      notifications: ChatSpinner,
      orders: CustomerOrderSpinner,
    }),
    []
  );
  const SpinnerTemplate = useMemo(() => {
    if (props.variant) {
      if (templates[props.variant]) {
        return templates[props.variant];
      }
    }
    return CircularProgress;
  }, []);
  return (
    <Box className="spinner">
      {props.image ? (
        <motion.div
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
          }}
          style={{ width: 100, pointerEvents: "none", opacity: 0.7 }}
        >
          <img
            src="/static/images/logo/vertical.png"
            width="100%"
            alt="Loading"
          />
        </motion.div>
      ) : (
        <SpinnerTemplate />
      )}
    </Box>
  );
}
function CustomerOrderSpinner(props) {
  return (
    <Box height="100%" width="100%" maxWidth="810px">
      <Box paddingTop={0} marginTop={3}>
        <Box p={3}>
          <Skeleton width={200} height={30} />
          <br />
          <br />
          <Box className="center-all" justifyContent="flex-start">
            <Skeleton width={100} height={30} />
            <Skeleton width={100} height={30} style={{ marginLeft: 20 }} />
            <Skeleton width={100} height={30} style={{ marginLeft: 20 }} />
            <Skeleton width={100} height={30} style={{ marginLeft: 20 }} />
          </Box>
        </Box>
        <Box>
          {new Array(10).fill(1).map((q, i) => (
            <React.Fragment key={i}>
              <Box
                p={3}
                width={"100%"}
                style={{ opacity: 1 - i / 4 }}
                className="center-all"
                justifyContent="flex-start"
              >
                <Box marginLeft={1} width="100%" height="100%">
                  <Skeleton width="100%" height={20} />
                  <br />
                  <Skeleton width="100%" height={50} />
                </Box>
              </Box>
              <Divider style={{ opacity: 1 - i / 4 }} />
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
function ChatSpinner(props) {
  return (
    <Box height="100%" width="100%" maxWidth="810px">
      <Box paddingTop={0} marginTop={3}>
        <Box p={3}>
          <Skeleton width={200} height={30} />
          <br />
          <br />
          <Box className="center-all" justifyContent="flex-start">
            <Skeleton width={100} height={30} />
            <Skeleton width={100} height={30} style={{ marginLeft: 20 }} />
          </Box>
          <br />
          <br />
          <Skeleton width={80} height={30} />
        </Box>
        <Box>
          {new Array(10).fill(1).map((q, i) => (
            <React.Fragment key={i}>
              <Box
                p={3}
                width={"100%"}
                style={{ opacity: 1 - i / 4 }}
                className="center-all"
                justifyContent="flex-start"
              >
                <Skeleton
                  width={50}
                  height={50}
                  style={{ minWidth: 50 }}
                  variant="circle"
                />
                <Box marginLeft={1} width="100%" height="100%">
                  <Skeleton width="100%" height={20} />
                  <br />
                  <Skeleton width="100%" height={50} />
                </Box>
              </Box>
              <Divider style={{ opacity: 1 - i / 4 }} />
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
function HomeSpinner(props) {
  return (
    <Box height="100%" width="100%" maxWidth="810px">
      <Skeleton width="100%" height={170} />
      <br />
      <Box p={3} paddingTop={0}>
        <Skeleton width={120} height={30} />
        <br />
        <Box className="services">
          {new Array(4).fill(1).map((service, index) => (
            <Skeleton
              className="service"
              key={index}
              height={60}
              style={{ marginBottom: 14 }}
            />
          ))}
        </Box>
        <Skeleton width={200} height={30} />
        <br />
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {new Array(10).fill(1).map((q, i) => (
            <Box
              key={i}
              width={150}
              height={200}
              flex="0 0 47%"
              marginBottom={2}
              style={{ opacity: 1 - i / 6 }}
            >
              <Skeleton width="100%" height="100%" />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Spinner;

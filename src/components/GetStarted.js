import { Box, Button, Container, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { fadeInOut } from "../misc/transitions";
import Footer from "../screens/home/Footer";
import AnimateOnTap from "./AnimateOnTap";

function GetStarted(props) {
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={fadeInOut}>
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height="100vh"
        >
          <Box
            textAlign="center"
            height="50%"
            p={3}
            display="flex"
            alignItems="flex-end"
          >
            <img
              src="/static/images/car-phone-bike.svg"
              width="100%"
              alt="Get Started"
            />
          </Box>
          <Box
            height="50%"
            p={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
          >
            <Box textAlign="center">
              <img src="/static/images/logo/horizontal.png" width={100} />
              <Typography>Your everyday companion</Typography>
            </Box>
            <Box width="100%" textAlign="center" paddingBottom={4}>
              <AnimateOnTap>
                <Button
                  variant="contained"
                  className="themed-button inverted"
                  color="primary"
                  onClick={() => props.history.push("/register")}
                >
                  Get Started
                </Button>
              </AnimateOnTap>
              <Typography className="have-account">
                Already have an account? <Link to="/login">Sign in</Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
}

export default GetStarted;

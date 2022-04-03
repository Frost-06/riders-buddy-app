import { Box, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect } from "react";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavContext from "../context/BottomNavContext";
import UserContext from "../context/UserContext";
import { fadeInOut } from "../misc/transitions";

function NotFound(props) {
  const bcontext = useContext(BottomNavContext);
  const { userContext } = useContext(UserContext);
  useEffect(() => {
    bcontext.setBottomNavContext({
      ...bcontext.bottomNavContext,
      visible: true,
    });
  }, []);
  return (
    <motion.div animate="in" exit="out" initial="initial" variants={fadeInOut}>
      <Box p={2} display="flex" height="100vh" flexDirection="column">
        {userContext?.user_status === "Verified" && (
          <ScreenHeader
            title={
              <img
                src="/static/images/logo/horizontal.png"
                width={100}
                alt="404"
              />
            }
          />
        )}
        <Typography color="primary" style={{ fontWeight: 700 }} variant="h4">
          Page Not Found
        </Typography>
        <Typography color="textSecondary">
          The page you're trying to access is not listed in our directory.
        </Typography>
      </Box>
    </motion.div>
  );
}

export default NotFound;

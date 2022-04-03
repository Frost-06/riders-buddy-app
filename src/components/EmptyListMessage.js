import { Box, Typography } from "@material-ui/core";
import React from "react";

function EmptyListMessage(props) {
  return (
    <Box p={2} height="100%" textAlign="center" width="100%">
      <Typography variant="h5" color="textSecondary">
        {props.children}
      </Typography>
    </Box>
  );
}

export default EmptyListMessage;

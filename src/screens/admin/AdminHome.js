import { Box, Button } from "@material-ui/core";
import React, { useState } from "react";
import CreateNotification from "../../components/CreateNotification";
import OrderTracking from "../../components/OrderTracking";

function AdminHome(props) {
  const [open, setOpen] = useState(false);
  return (
    <Box p={3}>
      <Box width="100%">
        <OrderTracking />
      </Box>
    </Box>
  );
}

export default AdminHome;

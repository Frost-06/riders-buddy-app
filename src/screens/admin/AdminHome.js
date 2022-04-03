import { Box, Button } from "@material-ui/core";
import React, { useState } from "react";
import CreateNotification from "../../components/CreateNotification";
import OrderTracking from "../../components/OrderTracking";

function AdminHome(props) {
  const [open, setOpen] = useState(false);
  return (
    <Box p={3}>
      <Box width={300} marginBottom={2}>
        <Button
          variant="contained"
          className="themed-button"
          onClick={() => setOpen(true)}
        >
          Send Notifications
        </Button>
      </Box>
      <CreateNotification controls={{ open, setOpen }} />
      <Box width="100%">
        <OrderTracking />
      </Box>
    </Box>
  );
}

export default AdminHome;

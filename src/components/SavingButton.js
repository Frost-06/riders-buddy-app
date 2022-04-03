import { Box, Button, CircularProgress, useTheme } from "@material-ui/core";
import React from "react";
import AnimateOnTap from "./AnimateOnTap";

function SavingButton(props) {
  const theme = useTheme();
  return (
    <AnimateOnTap>
      <Button {...props} disabled={props.saving || false || props.disabled}>
        {props.saving === true && (
          <Box
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: theme.palette.primary.main,
            }}
          >
            <CircularProgress size={18} style={{ color: "#fff" }} />
          </Box>
        )}
        {props.children}
      </Button>
    </AnimateOnTap>
  );
}

export default SavingButton;

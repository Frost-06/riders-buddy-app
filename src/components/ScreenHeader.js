import { Box, Icon, IconButton, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { goBackOrPush } from "../utils/goBackOrPush";
import AnimateOnTap from "./AnimateOnTap";

function ScreenHeader(props) {
  const history = useHistory();
  return (
    <Box className="center-all" justifyContent="space-between" width="100%">
      <Box className="center-align">
        {!props.noGoBack && (
          <AnimateOnTap>
            <IconButton
              disabled={!!props.disabled}
              className="back-button"
              onClick={() => {
                if (props.pushTo) {
                  if (typeof props.pushTo !== "function") {
                    if (!props.replace) history.push(props.pushTo);
                    else history.replace(props.pushTo);
                  } else props.pushTo();
                } else goBackOrPush(props.path || "/");
              }}
            >
              <Icon fontSize="large">navigate_before</Icon>
            </IconButton>
          </AnimateOnTap>
        )}
        {typeof props.title === "string" ? (
          <Typography color="primary" style={{ fontWeight: 700 }} variant="h5">
            {props.title}
          </Typography>
        ) : (
          props.title
        )}
        {props.children}
      </Box>
      {props.actions}
    </Box>
  );
}

export function MainScreenHeader(props) {
  const history = useHistory();
  return (
    <Box className="center-all" justifyContent="space-between" width="100%">
      <Box className="center-align">
        {!props.noGoBack && (
          <AnimateOnTap>
            <IconButton
              disabled={!!props.disabled}
              className="back-button"
              onClick={() => {
                if (props.pushTo) {
                  if (typeof props.pushTo !== "function") {
                    if (!props.replace) history.push(props.pushTo);
                    else history.replace(props.pushTo);
                  } else props.pushTo();
                } else goBackOrPush(props.path || "/");
              }}
            >
              <Icon fontSize="large">navigate_before</Icon>
            </IconButton>
          </AnimateOnTap>
        )}
        {typeof props.title === "string" ? (
          <Typography color="primary" style={{ fontWeight: 700 }} variant="h3">
            {props.title}
          </Typography>
        ) : (
          props.title
        )}
        {props.children}
      </Box>
      {props.actions}
    </Box>
  );
}

export default ScreenHeader;

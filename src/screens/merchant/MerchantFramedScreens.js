import { Container } from "@material-ui/core";
import React from "react";
import Notifications from "../home/Notifications";
import OrderDetails from "../home/OrderDetails";

export function FramedOrderDetails(props) {
  return (
    <Frame>
      <OrderDetails {...props} />
    </Frame>
  );
}
export function FramedNotifications(props) {
  return (
    <Frame>
      <Notifications {...props} />
    </Frame>
  );
}
function Frame(props) {
  return <Container>{props.children}</Container>;
}

import React from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";

function HorizontalScroll(props) {
  return (
    <ScrollMenu
      wheel={false}
      alignCenter={false}
      data={props.children}
      inertiaScrolling={true}
      inertiaScrollingSlowdown={5}
      style={{ padding: 120 }}
    />
  );
}

export default HorizontalScroll;

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
    />
  );
}

export default HorizontalScroll;

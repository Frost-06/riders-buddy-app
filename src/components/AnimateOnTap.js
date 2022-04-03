import { motion } from "framer-motion";
import React from "react";

function AnimateOnTap(props) {
  return (
    <motion.div
      {...props}
      whileTap={{ scale: 0.9, ...(props.whileTap ? props.whileTap : {}) }}
    >
      {props.parentComponent ? (
        <props.parentComponent {...props.parentProps}>
          {props.children}
        </props.parentComponent>
      ) : (
        props.children
      )}
    </motion.div>
  );
}

export default AnimateOnTap;

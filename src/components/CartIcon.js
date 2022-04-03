import { ButtonBase, Icon, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { history } from "../App";
import BottomNavContext from "../context/BottomNavContext";
import CartContext from "../context/CartContext";
import { slideRightFunc } from "../misc/transitions";
import AnimateOnTap from "./AnimateOnTap";

function CartIcon(props) {
  const { bottomNavContext } = useContext(BottomNavContext);
  const { cartContext } = useContext(CartContext);
  return (
    <AnimateOnTap
      className="floating-cart-icon center-all"
      animate="in"
      exit="out"
      initial="initial"
      style={{
        marginBottom: bottomNavContext.visible ? 60 : 0,
      }}
      variants={slideRightFunc({
        out: {
          x: "100%",
          opacity: 0,
        },
      })}
    >
      <ButtonBase onClick={() => history.push("/cart")}>
        <Icon>shopping_cart</Icon>
      </ButtonBase>
      {cartContext.products.length ? (
        <div className="cart-counter">
          <Typography>
            {cartContext.products.length > 99
              ? 99
              : cartContext.products.length}
          </Typography>
        </div>
      ) : null}
    </AnimateOnTap>
  );
}

export default CartIcon;

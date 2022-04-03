import React from "react";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";

const CartContext = React.createContext();
export const getCartContext = (setCartContext) => ({
  products: [],
  total: 0,
  getTotal: function (orders) {
    let t = 0;
    orders.map((p) => {
      t += parseInt(p.product.price);
    });
    this.total = t;
    return t;
  },
  addToCart: function (order, userContext, callback = () => {}) {
    let products = [...this.products];
    let productIndex = this.products.findIndex(
      (q) => q.product.id === order.product.id
    );
    if (productIndex >= 0) {
      products[productIndex].quantity += order.quantity;
    } else {
      products.push({ ...order, id: this.products.length });
    }
    const updatedContext = {
      ...this,
      products,
      total: (() => {
        let t = 0;
        products.map((p) => {
          t += parseInt(p.product.price) * p.quantity;
        });
        return t;
      })(),
    };
    fetchData({
      send: async () =>
        Api.post("/cart?token=" + Api.getToken(), {
          body: {
            meta: JSON.stringify(updatedContext),
            total_items: updatedContext.products.length,
            total_amount: updatedContext.total,
            user_id: userContext.user_id,
          },
        }),
      after: (data) => {
        callback(data);
        setCartContext(updatedContext);
      },
    });
  },
  emptyCart: function (setCartContext) {
    setCartContext({ ...this, total: 0, products: [] });
  },
  fetchCart: async function (setCartContext) {
    if (!this.isFetched) {
      await fetchData({
        send: async () => Api.get("/cart?token=" + Api.getToken()),
        after: (data) => {
          try {
            // meta is a json string of the cartContext from the Api
            let meta = JSON.parse(data?.meta);
            if (meta) {
              // if there is a meta available, replace the current cartContext and set fetched to true
              setCartContext({ ...this, ...meta, isFetched: true });
            }
          } catch (e) {}
        },
      });
    }
  },
  getMerchantCoordinates: function () {
    let p = this.products.map((q) => q.product);
    return p
      .filter(function (item, pos) {
        return (
          p.findIndex(
            (q) => q.merchant.merch_wp_id === item.merchant.merch_wp_id
          ) === pos
        );
      })
      .map(({ merchant }) => [merchant.merch_long, merchant.merch_lat]);
  },
  removeFromCart: function (order, userContext, callback = () => {}) {
    const orders = [...this.products];
    let orderIndex = this.products.findIndex(({ id }) => {
      return id === order.id;
    });
    if (orderIndex >= 0) {
      orders.splice(orderIndex, 1);
    }
    const updatedContext = {
      ...this,
      products: orders,
      total: this.getTotal(orders),
    };
    fetchData({
      send: async () =>
        Api.post("/cart?token=" + Api.getToken(), {
          body: {
            meta: JSON.stringify(updatedContext),
            total_items: updatedContext.products.length,
            total_amount: updatedContext.total,
            user_id: userContext.user_id,
          },
        }),
      after: (data) => {
        callback(data);
        setCartContext(updatedContext);
      },
    });
  },
});

export default CartContext;

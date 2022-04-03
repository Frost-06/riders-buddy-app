import React from "react";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";

const OrderContext = React.createContext();
export const getOrderContext = (setOrderContext) => ({
  orders: [],
  newOrder: function (order, setOrderContext) {
    setOrderContext({ ...this, orders: [...this.orders, order] });
  },
  updateOrder: function (order, setOrderContext) {
    let orders = [...this.orders];
    let orderIndex = orders.findIndex((q) => q.order_id === order.order_id);
    if (orderIndex >= 0) {
      orders[orderIndex] = order;
    }
    setOrderContext({ ...this, orders });
  },
  removeOrder: function (order, setOrderContext) {
    let orders = [...this.orders];
    let orderIndex = orders.findIndex((q) => q.order_id === order.order_id);
    if (orderIndex >= 0) {
      orders.splice(orderIndex, 1);
    }
    setOrderContext({ ...this, orders });
  },
  fetchOrders: async function (setOrderContext, userType) {
    if (!this.isFetched) {
      await fetchData({
        send: async () =>
          Api.get("/orders/" + userType + "?token=" + Api.getToken()),
        after: (data) => {
          if (data?.length)
            setOrderContext({ ...this, orders: data, isFetched: true });
        },
      });
    }
  },
});

export default OrderContext;

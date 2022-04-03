import React from "react";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";

const NotificationContext = React.createContext();
export const getNotificationContext = (setNotificationContext) => ({
  notifications: [],
  newNotification: function (notification, setNotificationContext) {
    const nextNotifications = [...this.notifications];
    const { provider_user_id, consumer_user_id, order_id } = notification;
    const index = nextNotifications.findIndex(
      (q) =>
        q.provider_user_id === provider_user_id &&
        q.consumer_user_id === consumer_user_id &&
        parseInt(q.order_id) === parseInt(order_id)
    );
    if (index >= 0) nextNotifications[index] = notification;
    else nextNotifications.push(notification);
    setNotificationContext({
      ...this,
      notifications: nextNotifications,
    });
  },
  updateNotification: function (notification, setNotificationContext) {
    let notifications = [...this.notifications];
    let index = notifications.findIndex(
      (q) => q.noti_id === notification.noti_id
    );
    if (index >= 0) {
      notifications[index] = notification;
    }
    setNotificationContext({ ...this, notifications });
  },
  fetchNotifications: async function (
    setNotificationContext,
    userContext = null
  ) {
    if (!userContext) {
      if (!this.isFetched) {
        await fetchData({
          send: async () => Api.get("/notifications?token=" + Api.getToken()),
          after: (data) => {
            if (data?.length)
              setNotificationContext({
                ...this,
                notifications: data,
                isFetched: true,
              });
          },
        });
      }
    } else if (userContext.user_type.name === "driver") {
      if (!this.isFetched) {
        await fetchData({
          send: async () => Api.get("/orders/driver?token=" + Api.getToken()),
          after: (data) => {
            if (data?.length)
              setNotificationContext({
                ...this,
                orders: data,
                isFetched: true,
              });
          },
        });
      }
    }
  },
});

export default NotificationContext;

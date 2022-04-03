import React from "react";

const BottomNavContext = React.createContext();

export const getBottomNavContext = () => ({
  visible: false,
  notifications: {},
  add: function (type, setBottomNavContext) {
    let nextNotifications = { ...this.notifications };
    if (nextNotifications[type]) {
      nextNotifications[type] += 1;
    } else {
      nextNotifications[type] = 1;
    }
    setBottomNavContext({
      ...this,
      visible: true,
      notifications: nextNotifications,
    });
  },
  remove: function (type, total, setBottomNavContext) {
    let nextNotifications = { ...this.notifications };
    if (nextNotifications[type]) {
      nextNotifications[type] -= total;
    } else {
      nextNotifications[type] = 0;
    }
    setBottomNavContext({
      ...this,
      visible: true,
      notifications: nextNotifications,
    });
  },
});

export default BottomNavContext;

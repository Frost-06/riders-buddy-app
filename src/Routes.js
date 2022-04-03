import { Box } from "@material-ui/core";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import VerifyOTP from "./components/VerifyOTP";
import NotFound from "./screens/404";
import AdminHome from "./screens/admin/AdminHome";
import AdminUsers from "./screens/admin/AdminUsers";
import { default as DriverOrders } from "./screens/driver/home/Orders";
import { default as DriverProfile } from "./screens/driver/home/Profile";
import { GetStartedScreen } from "./screens/get-started";
import { Home } from "./screens/home";
import Address from "./screens/home/Address";
import AddressForm from "./screens/home/AddressForm";
import Chat from "./screens/home/Chat";
import Notifications from "./screens/home/Notifications";
import OrderDetails from "./screens/home/OrderDetails";
import Orders from "./screens/home/Orders";
import Profile from "./screens/home/Profile";
import { Login } from "./screens/login";
import {
  FramedNotifications,
  FramedOrderDetails,
} from "./screens/merchant/MerchantFramedScreens";
import MerchantHome from "./screens/merchant/MerchantHome";
import MerchantTransactions from "./screens/merchant/MerchantTransactions";
import Services from "./screens/services";
import Cart, { AddToCart } from "./screens/services/Cart";
import Checkout from "./screens/services/Checkout";
import Merchant from "./screens/services/Merchant";
import MerchantDetails from "./screens/services/MerchantDetails";
function createRoute(path, exact, component, props = {}) {
  return { path, exact, ...(component ? { component } : {}), ...props };
}
function withNavBottom(props, Screen, classes = "", padding = 10) {
  return (
    <Box
      height="100vh"
      overflow="auto"
      paddingBottom={padding}
      className={classes}
    >
      <Screen {...props} />
    </Box>
  );
}
export default [
  createRoute("/get-started", true, GetStartedScreen),
  createRoute("/verify-otp", true, VerifyOTP),
  createRoute("/register", true, RegisterForm),
  createRoute("/login", true, Login),
];
export const notFoundRouteProps = createRoute("*", false, NotFound);
export const AdminRoutes = [
  createRoute("/", true, null, {
    render: (p) => withNavBottom(p, AdminHome, "", 0),
  }),
  createRoute("/orders/:order_id", true, null, {
    render: (p) => withNavBottom(p, FramedOrderDetails, "column-flex-100"),
  }),
  createRoute("/chat", true, Chat),
  createRoute("/chat/:order_id", true, null, {
    render: (p) => {
      return (
        <Chat
          {...p}
          style={{
            height: "100%",
          }}
        />
      );
    },
  }),
  createRoute("/notifications", true, null, {
    render: (p) => withNavBottom(p, FramedNotifications),
  }),
  createRoute("/users", true, null, {
    render: (p) => withNavBottom(p, AdminUsers, "", 0),
  }),
];

export const MerchantRoutes = [
  createRoute("/", true, null, {
    render: (p) => withNavBottom(p, MerchantHome, "", 0),
  }),
  createRoute("/transactions", true, null, {
    render: (p) => withNavBottom(p, MerchantTransactions, "", 0),
  }),
  createRoute("/orders/:order_id", true, null, {
    render: (p) => withNavBottom(p, FramedOrderDetails, "column-flex-100"),
  }),
  createRoute("/chat", true, Chat),
  createRoute("/chat/:order_id", true, null, {
    render: (p) => {
      return (
        <Chat
          {...p}
          style={{
            height: "100%",
          }}
        />
      );
    },
  }),
  createRoute("/notifications", true, null, {
    render: (p) => withNavBottom(p, Notifications),
  }),
];

export const DriverRoutes = [
  createRoute("/chat", true, Chat),
  createRoute("/chat/:order_id", true, Chat),
  createRoute("/", true, null, {
    render: (p) => withNavBottom(p, DriverOrders, "", 0),
  }),
  createRoute("/orders", true, null, {
    render: (p) => withNavBottom(p, DriverOrders, "", 0),
  }),
  createRoute("/merchant/:merchant_id/details", true, null, {
    render: (p) => withNavBottom(p, MerchantDetails),
  }),
  createRoute("/notifications", true, null, {
    render: (p) => withNavBottom(p, Notifications),
  }),
  createRoute("/profile", true, null, {
    render: (p) => withNavBottom(p, DriverProfile),
  }),
  createRoute("/orders/:order_id", true, null, {
    render: (p) => withNavBottom(p, OrderDetails, "column-flex-100"),
  }),
];

export const CustomerRoutes = [
  createRoute("/chat", true, Chat),
  createRoute("/chat/:order_id", true, Chat),
  createRoute("/", true, null, {
    render: (p) => withNavBottom(p, Home),
  }),
  createRoute("/orders", true, null, {
    render: (p) => withNavBottom(p, Orders, "column-flex-100"),
  }),
  createRoute("/orders/:order_id", true, null, {
    render: (p) => withNavBottom(p, OrderDetails, "column-flex-100"),
  }),
  createRoute("/profile", true, null, {
    render: (p) => withNavBottom(p, Profile),
  }),
  createRoute("/profile/info", true, Orders),
  createRoute("/address", true, null, {
    render: (p) => withNavBottom(p, Address, "column-flex-100"),
  }),
  createRoute("/new-address", true, null, {
    render: (p) => withNavBottom(p, AddressForm, "column-flex-100"),
  }),
  createRoute("/service/:service_id", true, null, {
    render: (p) => withNavBottom(p, Services),
  }),
  createRoute("/add-to-cart", true, null, {
    render: (p) => withNavBottom(p, AddToCart),
  }),
  createRoute("/cart", true, null, {
    render: (p) => withNavBottom(p, Cart),
  }),
  createRoute("/checkout", true, Checkout),
  createRoute("/merchant/:merchant_id", true, null, {
    render: (p) => withNavBottom(p, Merchant, "", 0),
  }),
  createRoute("/merchant/:merchant_id/details", true, null, {
    render: (p) => withNavBottom(p, MerchantDetails),
  }),
  createRoute("/notifications", true, null, {
    render: (p) => withNavBottom(p, Notifications),
  }),
];

export const bottomNavRoutes = {
  driver: [
    {
      label: "Home",
      icon: "icon-task-alt md",
      value: "home",
      url: "/",
      relatedUrls: ["/orders"],
    },
    {
      label: "Notifications",
      icon: "icon-bell-alt md",
      value: "notifications",
      url: "/notifications",
    },
    {
      label: "Profile",
      icon: "icon-user-alt md",
      value: "profile",
      url: "/profile",
      relatedUrls: ["/info"],
    },
  ],
  customer: [
    {
      label: "Home",
      icon: "icon-home-alt md",
      value: "home",
      url: "/",
    },
    {
      label: "Orders",
      icon: "icon-task-alt md",
      value: "orders",
      url: "/orders",
    },
    {
      label: "Cart",
      icon: "icon-cart-alt md",
      iconStyle: {
        color: "#b9b8b8",
      },
      value: "cart",
      url: "/cart",
    },
    {
      label: "Notifications",
      icon: "icon-bell-alt md",
      value: "notifications",
      url: "/notifications",
    },
    {
      label: "Profile",
      icon: "icon-user-alt md",
      value: "profile",
      url: "/profile",
      relatedUrls: ["/info"],
    },
  ],
};

export const AdminDrawerRoutes = [
  {
    url: "/",
    label: "Home",
    icon: "home",
    value: "home",
  },
  {
    url: "/users",
    label: "Users",
    icon: "people",
    value: "users",
  },
  {
    url: "/notifications",
    label: "Notifications",
    icon: "notifications",
    value: "notifications",
  },
];
export const MerchantDrawerRoutes = [
  {
    url: "/",
    label: "Home",
    icon: "home",
    value: "home",
  },
  {
    url: "/transactions",
    label: "Transactions",
    icon: "receipt_long",
    value: "transactions",
  },
  {
    url: "/notifications",
    label: "Notifications",
    icon: "notifications",
    value: "notifications",
  },
];

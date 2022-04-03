import React, {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import {
  GrossSales,
  ItemsSold,
  SalesByProduct,
  SalesMonthly,
  TotalOrders,
} from "./SalesConsumer";

export function GrossSalesChart(props) {
  return (
    <SalesProvider type="gross_sales" {...props}>
      <GrossSales />
    </SalesProvider>
  );
}
export function SalesByProductChart(props) {
  return (
    <SalesProvider type="sales_by_product" {...props}>
      <SalesByProduct />
    </SalesProvider>
  );
}
export function ItemsSoldChart(props) {
  return (
    <SalesProvider type="total_items" {...props}>
      <ItemsSold />
    </SalesProvider>
  );
}
export function TotalOrdersChart(props) {
  return (
    <SalesProvider type="total_orders" {...props}>
      <TotalOrders />
    </SalesProvider>
  );
}
export function SalesMonthlyLineChart(props) {
  return (
    <SalesProvider type="gross_sales_monthly" {...props}>
      <SalesMonthly />
    </SalesProvider>
  );
}

export function SalesProvider(props) {
  const [sales, setSales] = useState({});
  const getData = useCallback(
    (callback = () => {}) =>
      fetchData({
        send: async () =>
          await Api.get(
            "/reports/sales?token=" +
              Api.getToken() +
              `&${props.type}=true${props.params ? props.params : ""}`
          ),
        after: (data) => {
          setSales(data);
          callback();
        },
      }),
    [setSales, props.params]
  );
  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      {Children.map(props.children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            data: sales[props.type],
            reload: (callback) => getData(callback),
            ...props,
          });
        }
        return child;
      })}
    </React.Fragment>
  );
}

export function SalesProviderSuper(props) {
  return (
    <React.Fragment>
      {Children.map(props.children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            ...props,
          });
        }
        return child;
      })}
    </React.Fragment>
  );
}

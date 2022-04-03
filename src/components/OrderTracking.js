import MaterialTable from "material-table";
import React, { useCallback, useContext, useEffect, useState } from "react";
import OrderContext from "../context/OrderContext";
import { getOR } from "../screens/services/Checkout";
import moment from "moment";
import { Link } from "@material-ui/core";
import { history } from "../App";
import Api from "../utils/api";
import CurrencyFormat from "react-currency-format";
const qs = require("query-string");
function OrderTracking(props) {
  const query = qs.parse(window.location.search);
  const [loading, setLoading] = useState(true);
  const { orderContext, setOrderContext } = useContext(OrderContext);
  const fetchOrders = useCallback(() => {
    (async () => {
      setLoading(true);
      await orderContext.fetchOrders(setOrderContext, "admin");
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div>
      <MaterialTable
        title="Orders"
        data={orderContext.orders}
        isLoading={loading}
        onRowClick={(e, row) => history.push("/orders/" + row.order_id)}
        options={{
          filtering: true,
          initialPage: query.page || 0,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50, 100],
        }}
        editable={{
          onRowUpdate: (newData) =>
            new Promise(async (resolve, reject) => {
              delete newData.provider_name;
              delete newData.consumer_name;
              await Api.post("/order?token=" + Api.getToken(), {
                body: newData,
              });
              resolve();
            }),
        }}
        onChangePage={(page) => history.replace("?page=" + page)}
        columns={[
          {
            title: "Order Num",
            field: "order_id",
            render: (row) => <b>{"#" + getOR(row.order_id)}</b>,
            editable: "never",
          },
          {
            title: "Date",
            type: "date",
            field: "created_at",
            render: (row) => moment(row.created_at).format("llll"),
            editable: "never",
          },
          {
            title: "Provider",
            field: "provider_name",
            render: (row) =>
              row.provider_name || <i style={{ opacity: 0.5 }}>Pending</i>,
            editable: "never",
          },
          {
            title: "Customer",
            field: "consumer_name",
            editable: "never",
          },
          {
            title: "Note",
            field: "note",
            render: (row) =>
              row.note || <i style={{ opacity: 0.5 }}>Note is empty</i>,
            editable: "onUpdate",
          },
          {
            title: "Total",
            field: "total",
            type: "currency",
            currencySetting: {
              locale: "ph",
              currencyCode: "PHP",
            },
            editable: "onUpdate",
          },
          {
            title: "Delivery Fee",
            field: "delivery_fee",
            type: "currency",
            currencySetting: {
              locale: "ph",
              currencyCode: "PHP",
            },
            editable: "onUpdate",
          },
          {
            title: "Grand Total",
            render: (row) => (
              <CurrencyFormat
                value={(
                  parseFloat(row.total) + parseFloat(row.delivery_fee)
                ).toFixed(2)}
                prefix="PHP "
                displayType={"text"}
                thousandSeparator={true}
              />
            ),
            editable: "never",
          },
          {
            title: "Status",
            field: "status",
            lookup: {
              pending: "Pending",
              processing: "Processing",
              receiving: "Receiving",
              received: "Received",
              cancelled: "Cancelled",
            },
            render: (row) => (
              <b className={row.status}>{row.status.ucfirst()}</b>
            ),
            editable: "onUpdate",
          },
          {
            title: "Delivery Info",
            field: "delivery_info",
            render: (row) => {
              const { address, contact } = JSON.parse(row.delivery_info);
              return (
                <React.Fragment>
                  <b>Address: </b>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${address.geometry.coordinates[1]},${address.geometry.coordinates[0]}`}
                    target="_blank"
                  >
                    {address.place_name}
                  </Link>
                  <br />
                  <b>Name: </b>
                  {contact.name}
                  <br />
                  <b>Contact: </b>
                  {contact.contact}
                </React.Fragment>
              );
            },
            editable: "never",
          },
        ]}
      />
    </div>
  );
}

export default OrderTracking;

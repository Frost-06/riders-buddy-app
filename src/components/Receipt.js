import { Box, Typography } from "@material-ui/core";
import React from "react";
import CurrencyFormat from "react-currency-format";
import moment from "moment";

function Receipt(props) {
  const { order } = props;
  return (
    <Box p={3}>
      <Typography>
        Date issued: <b>{moment(order.order_date).format("llll")}</b>
      </Typography>
      <Typography>
        Date completed: <b>{moment(order.updated_at).format("llll")}</b>
      </Typography>
      <br />
      <table className="receipt">
        <tr>
          <th align="left">
            <Typography>Description</Typography>
          </th>
          <th align="left">
            <Typography>Quantity</Typography>
          </th>
          <th align="left">
            <Typography>Price</Typography>
          </th>
        </tr>
        {order?.products &&
          order.products.map((p, index) => {
            const meta = JSON.parse(p.product_meta);
            return (
              <tr key={index}>
                <td>
                  <Typography>{meta.name}</Typography>
                </td>
                <td>
                  <Typography>{p.order_qty}</Typography>
                </td>
                <td>
                  <Typography>
                    <CurrencyFormat
                      value={parseFloat(meta.price).toFixed(2)}
                      prefix="P "
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </Typography>
                </td>
              </tr>
            );
          })}
        <tr>
          <td align="right" colSpan={2}>
            <Typography>Delivery Fee</Typography>
          </td>
          <td>
            <Typography>
              <CurrencyFormat
                value={parseFloat(order.delivery_fee).toFixed(2)}
                prefix="P "
                displayType={"text"}
                thousandSeparator={true}
              />
            </Typography>
          </td>
        </tr>
        <tr>
          <td align="right" colSpan={2}>
            <Typography>Amount Paid</Typography>
          </td>
          <td>
            <Typography>
              <CurrencyFormat
                value={parseFloat(order.amount_paid).toFixed(2)}
                prefix="P "
                displayType={"text"}
                thousandSeparator={true}
              />
            </Typography>
          </td>
        </tr>
        <tr>
          <td align="right" colSpan={2}>
            <Typography>Grand Total</Typography>
          </td>
          <td>
            <Typography>
              <CurrencyFormat
                value={(
                  parseFloat(order.total) + parseFloat(order.delivery_fee)
                ).toFixed(2)}
                prefix="P "
                displayType={"text"}
                thousandSeparator={true}
              />
            </Typography>
          </td>
        </tr>
        <tr>
          <td align="right" colSpan={2}>
            <Typography>Change</Typography>
          </td>
          <td>
            <Typography>
              <CurrencyFormat
                value={(
                  parseFloat(order.amount_paid) -
                  (parseFloat(order.total) + parseFloat(order.delivery_fee))
                ).toFixed(2)}
                prefix="P "
                displayType={"text"}
                thousandSeparator={true}
              />
            </Typography>
          </td>
        </tr>
      </table>
    </Box>
  );
}

export default Receipt;

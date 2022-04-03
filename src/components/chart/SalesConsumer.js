import { Box, Icon, IconButton, Paper, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { CanvasJSChart } from "canvasjs-react-charts";
import EmptyListMessage from "../EmptyListMessage";
import moment from "moment";

export function GrossSales(props) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (props.data != null) {
      setLoading(false);
    }
  }, [props.data]);
  return (
    <SalesCardLayout
      title="Gross Sales"
      icon="payments"
      color="blue"
      loading={loading}
      reload={() => {
        setLoading(true);
        props.reload(() => {
          setLoading(false);
        });
      }}
    >
      {
        <CurrencyFormat
          value={isNaN(parseFloat(props.data)) ? 0 : props.data}
          prefix="PHP "
          displayType={"text"}
          thousandSeparator={true}
          renderText={(val) => (
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              {val}
            </Typography>
          )}
        />
      }
    </SalesCardLayout>
  );
}

export function ItemsSold(props) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (props.data != null) {
      setLoading(false);
    }
  }, [props.data]);
  return (
    <SalesCardLayout
      title="Items Sold"
      icon="local_mall"
      color="primary"
      loading={loading}
      reload={() => {
        setLoading(true);
        props.reload(() => {
          setLoading(false);
        });
      }}
    >
      <Typography variant="h5">
        <b>{props.data || 0}</b> pcs
      </Typography>
    </SalesCardLayout>
  );
}

export function TotalOrders(props) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (props.data != null) {
      setLoading(false);
    }
  }, [props.data]);
  return (
    <SalesCardLayout
      title="Total Orders"
      icon="shopping_cart"
      color="orange"
      loading={loading}
      reload={() => {
        setLoading(true);
        props.reload(() => {
          setLoading(false);
        });
      }}
    >
      <table width="100%">
        <tr>
          <td colSpan="2">
            <Typography variant="h5" color="primary">
              <b>{props.data && props.data["all"]}</b> orders
            </Typography>
          </td>
        </tr>
        <tr>
          <td>
            <Typography>
              DELIVERED <b>{props.data && props.data["received"]}</b>
            </Typography>
            <Typography>
              PENDING <b>{props.data && props.data["pending"]}</b>
            </Typography>
            <Typography>
              TO DELIVER <b>{props.data && props.data["receiving"]}</b>
            </Typography>
          </td>
          <td>
            <Typography>
              PROCESSING <b>{props.data && props.data["processing"]}</b>
            </Typography>
            <Typography>
              CANCELLED <b>{props.data && props.data["cancelled"]}</b>
            </Typography>
          </td>
        </tr>
      </table>
    </SalesCardLayout>
  );
}

export function SalesByProduct(props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (props.data != null) {
      if (Object.keys(props.data).length) {
        setData(
          props.data?.map(({ product_meta, total_items }) => {
            const product = JSON.parse(product_meta);
            return {
              label: product.name,
              y: total_items,
            };
          })
        );
      } else {
        setData([]);
      }
      setLoading(false);
    }
  }, [props.data]);
  return (
    <SalesCardLayout
      title="Items Sold By Product"
      icon="local_mall"
      color="orange"
      loading={loading}
      reload={() => {
        setLoading(true);
        props.reload(() => {
          setLoading(false);
        });
      }}
    >
      <Box position="absolute" left={0} right={0} component={Paper}>
        {!loading && Object.keys(data).length ? (
          <CanvasJSChart
            options={{
              theme: "light2",
              animationEnabled: true,
              exportFileName: "Sales By Product",
              exportEnabled: true,
              data: [
                {
                  type: "pie",
                  showInLegend: true,
                  legendText: "{label}",
                  toolTipContent: "{label}: <strong>{y} pcs</strong>",
                  indexLabel: "{y} pcs",
                  indexLabelPlacement: "inside",
                  dataPoints: data,
                },
              ],
            }}
          />
        ) : null}
        {!loading && !Object.keys(data).length ? (
          <EmptyListMessage>No Data</EmptyListMessage>
        ) : null}
      </Box>
    </SalesCardLayout>
  );
}

export function SalesMonthly(props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (props.data != null) {
      if (Object.keys(props.data).length) {
        setData(
          props.data
            ?.map(({ date, gross_sales }) => {
              return {
                x: new Date(date),
                y: parseFloat(gross_sales),
              };
            })
            .sort((a, b) => new Date(b.x) - new Date(a.x))
        );
      } else {
        setData([]);
      }
      setLoading(false);
    }
  }, [props.data]);
  return (
    <SalesCardLayout
      title="Sales Report by date"
      icon="payments"
      color="green"
      loading={loading}
      reload={() => {
        setLoading(true);
        props.reload(() => {
          setLoading(false);
        });
      }}
    >
      <Box position="absolute" left={0} right={0} component={Paper}>
        {!loading && Object.keys(data).length ? (
          <CanvasJSChart
            options={{
              animationEnabled: true,
              theme: "light2",
              title: {
                text: `${moment(data[data.length - 1].x.toString()).format(
                  "MMM D,YYYY"
                )} - ${moment(data[0].x.toString()).format("MMM D,YYYY")}`,
              },
              axisX: {
                valueFormatString: "DD MMM",
                crosshair: {
                  enabled: true,
                  snapToDataPoint: true,
                },
              },
              axisY: {
                title: "Sales in PHP",
                crosshair: {
                  enabled: true,
                  snapToDataPoint: true,
                  labelFormatter: function (e) {
                    return "PHP" + e.value.toFixed(2);
                  },
                },
              },
              data: [
                {
                  type: "area",
                  xValueFormatString: "DD MMM",
                  yValueFormatString: "PHP##0.00",
                  dataPoints: data,
                },
              ],
            }}
          />
        ) : null}
      </Box>
    </SalesCardLayout>
  );
}

function SalesCardLayout(props) {
  const { title, icon, color, loading, reload } = props;
  return (
    <Paper>
      <Box p={2} display="flex">
        {reload && (
          <IconButton className="chart-reload" onClick={() => reload()}>
            <Icon>refresh</Icon>
          </IconButton>
        )}
        <div className={"chart-icon " + color}>
          <Icon>{icon}</Icon>
        </div>
        <Box width="100%">
          <Typography variant="h6">{title}</Typography>
          {loading && (
            <Skeleton
              width="30%"
              height={35}
              variant="rect"
              animation="wave"
              style={{ borderRadius: 5 }}
            />
          )}
          {!loading && props.children}
        </Box>
      </Box>
    </Paper>
  );
}

import { Box, TextField, Typography } from "@material-ui/core";
import moment from "moment";
import React, { useMemo, useState } from "react";
import {
  GrossSalesChart,
  ItemsSoldChart,
  SalesByProductChart,
  SalesMonthlyLineChart,
  SalesProviderSuper,
  TotalOrdersChart,
} from "../../components/chart/SalesProvider";
import ScreenHeader from "../../components/ScreenHeader";

function MerchantHome(props) {
  const from = useMemo(() => moment().format("YYYY-MM-01"));
  const to = useMemo(() => moment().add(30, "days").format("YYYY-MM-01"));
  const [params, setParams] = useState({ from, to });
  return (
    <Box p={3}>
      <ScreenHeader title="Dashboard" noGoBack />
      <Box className="center-all" justifyContent="flex-end" marginTop="-70px">
        <Typography style={{ marginRight: 14 }}>Range</Typography>
        <Box paddingTop={6}>
          <TextField
            label="From"
            type="date"
            defaultValue={from}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setParams({ ...params, from: e.target.value });
            }}
            variant="outlined"
          />
          &nbsp;
          <TextField
            label="To"
            type="date"
            defaultValue={to}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setParams({ ...params, to: e.target.value });
            }}
            variant="outlined"
          />
        </Box>
      </Box>
      <Box
        className="center-all sales-card"
        justifyContent="flex-start"
        alignItems="flex-end"
      >
        <SalesProviderSuper params={`&from=${params.from}&to=${params.to}`}>
          <TotalOrdersChart />
          <GrossSalesChart />
          <ItemsSoldChart />
        </SalesProviderSuper>
      </Box>
      <Box className="center-all" justifyContent="space-between">
        <Box className="sales-card" display="block" minWidth={400}>
          <SalesProviderSuper params={`&from=${params.from}&to=${params.to}`}>
            <SalesByProductChart />
          </SalesProviderSuper>
        </Box>
        <Box className="sales-card" display="block" width="100%">
          <SalesProviderSuper params={`&from=${params.from}&to=${params.to}`}>
            <SalesMonthlyLineChart />
          </SalesProviderSuper>
        </Box>
      </Box>
    </Box>
  );
}

export default MerchantHome;

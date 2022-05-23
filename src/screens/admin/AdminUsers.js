import MaterialTable from "material-table";
import React, { useCallback, useContext, useEffect, useState } from "react";
import OrderContext from "../../context/OrderContext";
import { getOR } from "../../screens/services/Checkout";
import moment from "moment";
import { Box, Button, Link } from "@material-ui/core";
import { history } from "../../App";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import CreateNotification from "../../components/CreateNotification";
const qs = require("query-string");
function AdminUsers(props) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchData({
      before: () => setLoading(true),
      send: async () => await Api.get("/users?token=" + Api.getToken()),
      after: (data) => {
        setLoading(false);
        setUsers(data);
      },
    });
  }, []);
  const currentDate = moment().format("MM-ddd-YYYY-hh:mm:ss a");
  const [open, setOpen] = useState(false);
  return (
    <Box p={3}>
      <Box width={200} marginTop={2} marginBottom={2}>
        <Button
          variant="contained"
          className="themed-button"
          onClick={() => setOpen(true)}
        >
          Send Notifications
        </Button>
        <CreateNotification controls={{ open, setOpen }} />
      </Box>
      <MaterialTable
        isLoading={loading}
        title="Users"
        data={users}
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          filtering: true,
          exportButton: {
            csv: true,
            pdf: true,
          },
          exportFileName: `Users ${currentDate}`,
          grouping: true,
        }}
        onRowClick={(e, row) => {
          window.open(
            window.location.origin + "?token=" + row.user_token,
            "_blank"
          );
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              // newData.user_password = "password";
              fetchData({
                send: async () =>
                  await Api.post(
                    "/register?is_admin=true&token=" + Api.getToken(),
                    {
                      body: newData,
                    }
                  ),
                after: (data) => {
                  let errors = "";
                  if (!data.user) {
                    Object.keys(data).map((k) => {
                      if (data[k][0]) {
                        errors += data[k][0] + "\n";
                      }
                    });
                    alert(errors);
                    reject();
                  } else {
                    setUsers([...users, data.user]);
                    resolve();
                  }
                },
              });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              fetchData({
                send: async () =>
                  await Api.post(
                    "/user?user_id=" +
                      oldData.user_id +
                      "&token=" +
                      Api.getToken(),
                    {
                      body: newData,
                    }
                  ),
                after: (data) => {
                  if (data?.user_id) {
                    const dataUpdate = [...users];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = data;
                    setUsers([...dataUpdate]);
                    resolve();
                  } else {
                    alert(data.error);
                    reject();
                  }
                },
              });
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              fetchData({
                send: async () =>
                  await Api.delete(
                    "/user?user_id=" +
                      oldData.user_id +
                      "&token=" +
                      Api.getToken()
                  ),
                after: (data) => {
                  if (!data.error) {
                    const dataDelete = [...users];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setUsers([...dataDelete]);
                    resolve();
                  } else {
                    alert(data.error);
                    reject();
                  }
                },
              });
            }),
        }}
        columns={[
          {
            title: "ID",
            field: "user_id",
          },
          {
            title: "First Name",
            field: "user_fname",
          },
          {
            title: "Last Name",
            field: "user_lname",
          },
          {
            title: "Email",
            field: "user_email",
          },
          {
            title: "Password",
            field: "user_password",
            filtering: false,
            search: false,
            export: false,
            editable: "onAdd",
          },
          {
            title: "Status",
            field: "user_status",
            lookup: {
              Verified: "Verified",
              Unverified: "Unverified",
              Suspended: "Suspended",
              Banned: "Banned",
            },
          },
          {
            title: "User Type",
            field: "user_type",
            lookup: {
              1: "Customer",
              2: "Driver",
              3: "Merchant",
              4: "Admin",
            },
          },
        ]}
      />
    </Box>
  );
}

export default AdminUsers;

import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { history } from "../../App";
import SavingButton from "../../components/SavingButton";
import { MainScreenHeader } from "../../components/ScreenHeader";
import {
  ScreenTemplate1,
  ScreenTemplateSignIn,
} from "../../components/VerifyOTP";
import UserContext from "../../context/UserContext";
import {
  CheckboxCheckedIcon,
  CheckboxIcon,
  CheckboxIndeterminateIcon,
} from "../../misc/CustomIcons";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import logout from "../../utils/logout";

const form = {};
export function Login(props) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const ucontext = useContext(UserContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbarKey, setsnackbarKey] = useState();
  const textFieldProps = useCallback(
    (type) => ({
      variant: "outlined",
      fullWidth: true,
      className: "themed-input",
      disabled: loading,
      ...(errors[type] ? { helperText: errors[type], error: true } : {}),
    }),
    [errors, loading]
  );
  const onChange = useCallback((e, type) => {
    form[type] = e.target.value;
  }, []);
  const onSubmit = useCallback(() => {
    fetchData({
      before: () => {
        setErrors({});
        setLoading(true);
      },
      send: async () =>
        await Api.post("/login", {
          body: {
            ...form,
          },
        }),
      onError: (e) => {
        if (e.response) setErrors(e.response.data.errors);
      },
      after: (data) => {
        //check user status
        if (data?.user_status === "Verified") {
          history.push("/");
        } else if (data?.user_status === "Unverified") {
          history.push("/verify-otp");
        } else if (data?.user_status === "Suspended") {
          setsnackbarKey(
            enqueueSnackbar(
              <React.Fragment>
                <Typography>{data?.message}</Typography>
                <Button
                  onClick={() =>
                    props.history
                      ? props.history.replace("/lift-suspension")
                      : (window.location = "/lift-suspension")
                  }
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    textDecoration: "underline",
                  }}
                >
                  Disagree with decision
                </Button>
              </React.Fragment>,
              {
                preventDuplicate: true,
                variant: "warning",
                autoHideDuration: 10000000,
              }
            )
          );
        }
        //  else {
        //   history.push("/verify-otp");
        // }
        else if (!data?.user_token) {
          setsnackbarKey(
            enqueueSnackbar(data?.message || "Email and Password required", {
              preventDuplicate: true,
              variant: "error",
              autoHideDuration: 10000000,
            })
          );
        }
        if (data?.user_token) {
          if (data.user_token) {
            window.localStorage["user"] = JSON.stringify({
              user_token: data.user_token,
            });
            if (data.user) ucontext.setUserContext(data.user);
            else if (data.user_email) ucontext.setUserContext(data);
          }
        }
        setLoading(false);
      },
    });
  }, []);
  const { userContext, setUserContext } = useContext(UserContext);
  return (
    // <ScreenTemplate1
    //   title={<ScreenHeader path="/get-started" title="Sign in" />}
    //   subTitle=""
    //   {...props}
    // >
    //   <Box
    //     height="100%"
    //     display="flex"
    //     flexDirection="column"
    //     justifyContent="space-evenly"
    //   >
    //     <Box>
    //       <form>
    //         <TextField
    //           label="Email"
    //           {...textFieldProps("user_email")}
    //           type="email"
    //           onChange={(e) => onChange(e, "user_email")}
    //           onKeyDown={({ key }) => {
    //             if (key === "Enter") onSubmit();
    //           }}
    //         />
    //         <TextField
    //           label="Password"
    //           type="password"
    //           onChange={(e) => onChange(e, "user_password")}
    //           {...textFieldProps("user_password")}
    //           onKeyDown={({ key }) => {
    //             if (key === "Enter") onSubmit();
    //           }}
    //         />
    //       </form>
    //     </Box>
    //     <Box textAlign="center">
    //       <SavingButton
    //         style={{ width: "80%" }}
    //         className="themed-button"
    //         onClick={onSubmit}
    //         saving={loading}
    //       >
    //         Sign in
    //       </SavingButton>
    //     </Box>
    //     <Box textAlign="center">
    //       <Typography className="have-account">
    //         Dont have an account? <Link to="/register">Sign up</Link>
    //       </Typography>
    //     </Box>
    //   </Box>
    // </ScreenTemplate1>
    <ScreenTemplateSignIn>
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        style={{
          width: isMd ? "84%" : "30%",
          margin: "0 auto",
          justifyContent: "center",
        }}
      >
        <MainScreenHeader path="/get-started" title="Sign in" />
        <Box
          component="form"
          style={{
            display: "flex",
            flexDirection: "column",
            height: 416,
            justifyContent: "space-evenly",
          }}
        >
          <Container style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" style={{ fontWeight: 700 }}>
              Email address
            </Typography>
            <TextField
              width="100%"
              placeholder="Ex: riders-buddy@gmail.com"
              {...textFieldProps("user_email")}
              type="email"
              onChange={(e) => onChange(e, "user_email")}
              onKeyDown={({ key }) => {
                if (key === "Enter") onSubmit();
              }}
            />
          </Container>
          <Container style={{ marginTop: 1 }}>
            <Typography variant="body1" style={{ fontWeight: 700 }}>
              Password
            </Typography>
            <TextField
              width="100%"
              placeholder="Type your password here"
              type="password"
              onChange={(e) => onChange(e, "user_password")}
              {...textFieldProps("user_password")}
              onKeyDown={({ key }) => {
                if (key === "Enter") onSubmit();
              }}
            />
          </Container>
        </Box>

        <Container textAlign="center">
          <SavingButton
            style={{ width: "100%" }}
            className="themed-button"
            onClick={onSubmit}
            saving={loading}
          >
            Sign in
          </SavingButton>
        </Container>

        <Box textAlign="center">
          <Typography className="have-account">
            Dont have an account? <Link to="/register">Sign up</Link>
          </Typography>
        </Box>
      </Box>
    </ScreenTemplateSignIn>
  );
}

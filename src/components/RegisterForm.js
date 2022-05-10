import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import GetStartedContext from "../context/GetStartedContext";
import UserContext from "../context/UserContext";
import { slideRight } from "../misc/transitions";
import Api from "../utils/api";
import SavingButton from "./SavingButton";
import ScreenHeader, { MainScreenHeader } from "./ScreenHeader";

function RegisterForm(props) {
  const formRef = useRef();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(false);
  const context = useContext(GetStartedContext);
  const { getStartedContext, setGetStartedContext } = context;
  const ucontext = useContext(UserContext);
  const { userContext, setUserContext } = ucontext;

  const form = useMemo(() => {
    if (getStartedContext.form) {
      return getStartedContext.form;
    } else {
      return {};
    }
  }, [getStartedContext.form]);
  const onSubmit = useCallback(
    (callback) => {
      if (formRef.current && !saving) {
        (async () => {
          setSaving(true);
          const t = await Api.post("/register?return_token=true", {
            body: form,
          }).catch((e) => {});
          if (!t?.user && !userContext?.user_id) {
            if (typeof t === "object") {
              Object.keys(t).forEach((k) => {
                if (!t[k][0]) return;
                t[k][0] = t[k][0].replace("lname", "last name");
                t[k][0] = t[k][0].replace("fname", "first name");
              });
              setErrors(t);
            }
          } else {
            window.localStorage["user"] = JSON.stringify({
              user_token: (t.user.user_token / 4567) * 1234,
            });
            callback();
            setGetStartedContext({
              ...getStartedContext,
              form,
              isRegistered: true,
            });
            setUserContext(t.user);
            props.history.replace("/verify-otp");
          }
          setSaving(false);
        })();
      }
    },
    [formRef]
  );

  const onChange = useCallback(
    (e, type) => {
      form[type] = e.target.value;
    },
    [form]
  );
  const textFieldProps = useCallback(
    (type) => ({
      InputLabelProps: {
        shrink: true,
      },
      variant: "outlined",
      fullWidth: true,
      className: "themed-input",
      inputProps: {
        style: { fontWeight: 500 },
      },
      disabled: saving || getStartedContext.isRegistered || userContext.user_id,
      ...(form[type] || userContext[type]
        ? { defaultValue: form[type] || userContext[type] }
        : {}),
      ...(errors[type] ? { helperText: errors[type], error: true } : {}),
    }),
    [saving, errors, form, getStartedContext.isRegistered, userContext]
  );

  useEffect(() => {
    if (userContext?.user_id) {
      props.history.push("verify-otp");
    }
  }, []);
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideRight}
      transition="tween"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "stretch",
          flexDirection: "row",
          height: "100vh",
          margin: "auto",
        }}
      >
        {isMd ? (
          ""
        ) : (
          <img
            src="/static/images/sign-up-img.png"
            alt=""
            style={{ background: "cover" }}
          />
        )}

        <Box
          style={{
            display: "flex",
            width: isMd ? "84%" : "30%",
            flexDirection: "column",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <MainScreenHeader title="Sign up" path="/get-started" />
          <form
            style={{
              width: "100%",
              height: isMd ? "100vh" : "80vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
            ref={formRef}
          >
            <Container style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1" style={{ fontWeight: 700 }}>
                First Name
              </Typography>
              <TextField
                placeholder="Ex: Angelo"
                onChange={(e) => onChange(e, "user_fname")}
                {...textFieldProps("user_fname")}
              />
            </Container>
            <Container style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1" style={{ fontWeight: 700 }}>
                Last Name
              </Typography>
              <TextField
                placeholder="Ex: Mijares"
                onChange={(e) => onChange(e, "user_lname")}
                {...textFieldProps("user_lname")}
              />
            </Container>
            <Container style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1" style={{ fontWeight: 700 }}>
                Email Address
              </Typography>
              <TextField
                placeholder="Ex: ridersbuddy@email.com"
                onChange={(e) => onChange(e, "user_email")}
                {...textFieldProps("user_email")}
              />
            </Container>
            <Container style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1" style={{ fontWeight: 700 }}>
                Password
              </Typography>
              <TextField
                placeholder="Type your password here"
                type="password"
                onChange={(e) => onChange(e, "user_password")}
                {...textFieldProps("user_password")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form["user_agree"]}
                    onChange={(e) => {
                      form["user_agree"] = e.target.checked ? 1 : 0;
                    }}
                  />
                }
                {...textFieldProps("type")}
                label={
                  <React.Fragment>
                    <Typography style={{ fontSize: 12 }}>
                      By creating an account, you agree to our{" "}
                      <a
                        style={{
                          whiteSpace: "pre",
                          color: "#1AA3E9",
                          fontWeight: "500",
                        }}
                        href="https://sites.google.com/view/riders-buddy/home"
                      >
                        Terms and Conditions
                      </a>
                    </Typography>
                    {errors["user_agree"] && (
                      <Typography
                        className="error"
                        style={{
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors["user_agree"]}
                      </Typography>
                    )}
                  </React.Fragment>
                }
              />
            </Container>

            <Container p={3}>
              <SavingButton
                fullWidth
                variant="contained"
                className="themed-button"
                onClick={() =>
                  onSubmit(() => {
                    setGetStartedContext({
                      ...getStartedContext,
                      page: getStartedContext.page + 1,
                    });
                  })
                }
                saving={saving}
                onKeyDown={({ key }) => {
                  if (key === "Enter") onSubmit();
                }}
              >
                Continue
              </SavingButton>
              <Typography className="have-account">
                Already have an account? <Link to="/login">Sign in</Link>
              </Typography>
            </Container>
          </form>
        </Box>
      </div>
    </motion.div>
  );
}

export default RegisterForm;

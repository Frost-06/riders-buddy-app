import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Icon,
  Slide,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import BottomNavContext from "../context/BottomNavContext";
import ServicesContext from "../context/ServicesContext";
import UserContext from "../context/UserContext";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";
import SavingButton from "./SavingButton";

function ServicesSlider(props) {
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(true);
  const scontext = useContext(ServicesContext);
  const bcontext = useContext(BottomNavContext);
  const ucontext = useContext(UserContext);
  const { servicesContext } = scontext;
  const { userContext, setUserContext } = ucontext;
  const [userInfo, setUserInfo] = useState(userContext);
  const [dialogOpen, setDialogOpen] = useState(true);

  const ServiceSlide = useCallback((s) => {
    return (
      <Box key={s.id} className="service-slide">
        <img src={s.service_icon_b} alt={s.service_name} />
        <Typography color="primary" variant="h4" style={{ fontWeight: "700" }}>
          {s.service_name}
        </Typography>
        <Typography color="textPrimary" variant="h6">
          {s.subname}
        </Typography>
      </Box>
    );
  }, []);
  const handleSkip = useCallback(() => {
    setSaving(true);
    fetchData({
      before: () => setSaving(true),
      send: async () =>
        await Api.post("/first-login?token=" + Api.getToken(), {
          body: {
            user_email: userContext?.user_email,
            user_token: userContext?.user_token,
          },
        }),
      after: (userData) => {
        window.location = "/";
      },
    });
  }, [saving, open, userContext]);

  useEffect(() => {
    bcontext.setBottomNavContext({
      ...bcontext.bottomNavContext,
      visible: false,
    });
  }, []);

  return (
    <React.Fragment>
      <Dialog open={dialogOpen} fullWidth>
        <DialogContent>
          <img
            src="/static/images/welcome.svg"
            alt="Welcome To Riders Buddy"
            width="100%"
          />
          <Button
            className="themed-button"
            onClick={() => setDialogOpen(false)}
            style={{ fontWeight: 700, marginTop: 13 }}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
      <Slide
        direction={"up"}
        in={open}
        onExited={() => {
          setUserContext(userInfo);
        }}
      >
        <Box height="100vh" className="center-all" width="100%">
          <Box
            className="center-all"
            flexDirection="column"
            width="100%"
            height="80%"
          >
            <Carousel
              animation="slide"
              interval={3000}
              className="service-carousel"
            >
              {servicesContext.length
                ? servicesContext.map((service) => ServiceSlide(service))
                : null}
            </Carousel>
            <Box textAlign="center">
              <SavingButton
                className="themed-button auto-width"
                saving={saving}
                onClick={() => handleSkip()}
              >
                <Icon>navigate_next</Icon>
              </SavingButton>
              <Typography style={{ marginTop: 10 }}>Skip</Typography>
            </Box>
          </Box>
        </Box>
      </Slide>
    </React.Fragment>
  );
}

export default ServicesSlider;

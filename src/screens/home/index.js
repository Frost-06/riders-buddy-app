import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  AppBar,
  IconButton,
  Icon,
  TextField,
  Button,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { history } from "../../App";
import Address from "../../components/Address";
import ServicesSlider from "../../components/ServicesSlider";
import SecondHeader from "../../components/user-globals/SecondHeader";
import BottomNavContext from "../../context/BottomNavContext";
import LoadingScreenContext from "../../context/LoadingScreenContext";
import ServicesContext from "../../context/ServicesContext";
import UserContext from "../../context/UserContext";
import { slideLeft } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import Services from "../services";
import Cart from "../services/Cart";
import Footer from "./Footer";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export function Home(props) {
  const scontext = useContext(ServicesContext);
  const ucontext = useContext(UserContext);
  const { setLoadingScreen } = useContext(LoadingScreenContext);
  const { setServicesContext } = scontext;
  const { userContext } = ucontext;
  useEffect(() => {
    fetchData({
      before: () => setLoadingScreen({ visible: true, variant: "home" }),
      send: async () => await Api.get("/services"),
      after: (data) => {
        setServicesContext(data);
        setLoadingScreen({ visible: false });
      },
    });
  }, []);
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={slideLeft}>
      <Container disableGutters={true}>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {userContext?.is_first_logon ? (
            <ServicesSlider />
          ) : (
            <HomePage {...props} />
          )}
        </Box>
      </Container>
    </motion.div>
  );
}
function HomePage(props) {
  const ucontext = useContext(UserContext);
  const scontext = useContext(ServicesContext);
  const bcontext = useContext(BottomNavContext);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const { userContext } = ucontext;
  const { servicesContext } = scontext;
  useEffect(() => {
    bcontext.setBottomNavContext({
      ...bcontext.bottomNavContext,
      visible: true,
    });
  }, []);
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignSelf="flex-start"
        justifySelf="flex-start"
        width="100%"
        style={{ minHeight: "100vh", width: isMd ? "" : "1400px" }}
      >
        <SecondHeader />

        {/* <Block>
          <Typography color="primary" variant="h5" style={{ fontWeight: 700 }}>
            Hi, {userContext?.user_fname} {userContext?.user_lname}
          </Typography>
          <Address />
        </Block> */}
        <br />
        <Box className="main-search-input">
          <TextField
            id="search-val"
            className="themed-input"
            variant="outlined"
            type="text"
            fullWidth
            placeholder="Search for product or services..."
          />
          <Button className="themed-button" size="large">
            <Icon>search</Icon>
          </Button>
        </Box>
        <Box position="relative" style={{ padding: "0px 24px" }}>
          <AutoPlaySwipeableViews
            index={page - 1}
            resistance
            animateTransitions="true"
            onChangeIndex={(index) => setPage(index + 1)}
            style={{ borderRadius: isMd ? "8px" : "24px", marginTop: 16 }}
          >
            <Box display="flex" onClick={() => history.push("/merchant/2")}>
              <img
                src="/static/images/carousel/jollibee.jpg"
                width="100%"
                alt="Jollibee"
              />
            </Box>
            <Box display="flex" onClick={() => history.push("/merchant/3")}>
              <img
                src="/static/images/carousel/mcdo.jpg"
                width="100%"
                alt="McDonalds"
              />
            </Box>
            <Box display="flex">
              <img
                src="/static/images/carousel/kfc.jpg"
                width="100%"
                alt="McDonalds"
              />
            </Box>
          </AutoPlaySwipeableViews>
          <CarouselPagination
            page={page}
            totalPages={6}
            onClick={(index) => {
              setPage(index);
            }}
          />
        </Box>

        {/* <Block title="Explore by category">
          <Typography variant="caption">
            Discover items and services that will fit to your needs
          </Typography>
          <Box className="services">
            {servicesContext?.map &&
              servicesContext?.map((service, index) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  key={index}
                  style={{
                    backgroundColor: theme.palette.primary.pale,
                    padding: theme.spacing(1),
                    marginBottom: theme.spacing(1.5),
                  }}
                  onClick={() =>
                    props.history.push("/service/" + service.service_id)
                  }
                  className="service"
                >
                  <img
                    src={service.service_icon_s}
                    alt={service.service_name}
                    width={40}
                  />
                  <Box>
                    <Typography color="primary" style={{ fontWeight: 700 }}>
                      {service.service_name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      style={{
                        fontSize: ".6em",
                      }}
                    >
                      {service.subname}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
          </Box>
        </Block> */}
        <Services
          service={1}
          blocks={{
            params: {
              products: {
                order: "asc",
              },
            },
          }}
        />
        <Footer />
      </Box>
    </>
  );
}

function CarouselPagination(props) {
  const step = 14;
  const { totalPages, page } = props;
  const translate = useMemo(() => {
    let t = 2;
    if (page !== 1) {
      t = step * (page - 1);
      t += 2;
    }
    return `translateX(${t}px)`;
  }, [page]);
  return (
    <div className="carousel-pagination">
      <ul>
        {new Array(totalPages).fill("").map((a, i) => (
          <li
            onClick={() => props.onClick(i + 1)}
            key={i}
            className={"p-button " + (i === page - 1 ? "active" : "")}
          ></li>
        ))}
        <li className="disc">
          <div style={{ transform: translate }}></div>
        </li>
      </ul>
    </div>
  );
}

export function Block(props) {
  const theme = useTheme();
  return (
    <Box
      p={props.p !== undefined ? props.p : 3}
      paddingBottom={0}
      style={props.style || {}}
    >
      {props.p !== undefined ? (
        <Typography
          color="#14142B"
          variant="h6"
          style={{
            fontWeight: 700,
            marginBottom: 13,
            padding: props.p === undefined ? theme.spacing(3) : 0,
            ...(props.titleStyle ? props.titleStyle : {}),
          }}
        >
          {props.title}
        </Typography>
      ) : (
        <Typography color="#14142B" variant="h6" style={{ fontWeight: 700 }}>
          {props.title}
        </Typography>
      )}
      {props.children}
    </Box>
  );
}

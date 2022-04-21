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
            placeholder="Enter your current address..."
          />
          <Button className="themed-button" size="large">
            {/* <Icon>gps_fixed_rounded</Icon> */}
            <Icon>
              <svg width="24" height="24" viewBox="0 0 30 32" fill="#ffffff">
                <path d="M25.4355 6.65105C25.4277 7.37054 25.1371 8.05806 24.6265 8.56499C24.1158 9.07192 23.4262 9.35753 22.7067 9.36009H22.6076H22.5532C22.4049 9.35476 22.2575 9.33653 22.1124 9.30562L22.0133 9.28085C21.8762 9.24508 21.7421 9.19871 21.6122 9.14218L21.5082 9.09266C21.3883 9.03447 21.2725 8.96829 21.1615 8.89455L21.0575 8.81531C20.958 8.74273 20.8637 8.6633 20.7752 8.57759L20.6712 8.46368C20.5946 8.3809 20.5235 8.29322 20.4582 8.2012C20.4224 8.15192 20.3893 8.10066 20.3592 8.04767C20.3005 7.95186 20.2476 7.85263 20.2007 7.75052C20.1763 7.69895 20.1548 7.64604 20.1363 7.59204C20.0927 7.48107 20.0579 7.3668 20.0323 7.25031C20.0323 7.19583 20.0076 7.14631 19.9977 7.09183C19.9759 6.96419 19.9643 6.83502 19.963 6.70553C19.963 6.70553 19.963 6.65601 19.963 6.63124C19.963 6.51697 19.9176 6.40738 19.8368 6.32657C19.756 6.24577 19.6464 6.20037 19.5321 6.20037C19.4178 6.20037 19.3083 6.24577 19.2274 6.32657C19.1466 6.40738 19.1012 6.51697 19.1012 6.63124C19.0965 7.28465 18.8582 7.91482 18.4296 8.40798C18.0009 8.90114 17.41 9.22478 16.7636 9.32047C16.6215 9.34638 16.4773 9.35964 16.3328 9.36009H16.2189C15.5137 9.32952 14.8474 9.02836 14.3586 8.51921C13.8697 8.01007 13.5959 7.33212 13.594 6.62629C13.5966 6.56568 13.5865 6.50521 13.5643 6.44874C13.5421 6.39226 13.5084 6.34104 13.4653 6.29834C13.4222 6.25565 13.3707 6.22242 13.314 6.20078C13.2574 6.17915 13.1968 6.16958 13.1362 6.17269C13.0756 6.17581 13.0164 6.19154 12.9622 6.21888C12.908 6.24621 12.8602 6.28455 12.8217 6.33145C12.7832 6.37834 12.7549 6.43275 12.7387 6.49119C12.7224 6.54964 12.7186 6.61084 12.7273 6.67086C12.7867 7.01339 12.7588 7.36533 12.6462 7.69424C12.5337 8.02314 12.3402 8.31842 12.0835 8.55283C9.81029 10.4001 7.24487 8.81036 7.24487 6.62629C7.23342 6.51935 7.18283 6.42041 7.10283 6.34852C7.02284 6.27663 6.91908 6.23686 6.81152 6.23686C6.70397 6.23686 6.60021 6.27663 6.52021 6.34852C6.44022 6.42041 6.38963 6.51935 6.37818 6.62629C6.37613 7.33459 6.10024 8.01465 5.60825 8.52419C5.11625 9.03372 4.44626 9.33325 3.73847 9.36009H3.64933C2.9353 9.36029 2.24953 9.08112 1.73865 8.58228C1.22777 8.08343 0.932343 7.40451 0.915527 6.69067L0.9601 6.49753L2.08433 1.98576C2.19427 1.55995 2.44278 1.18283 2.79069 0.913823C3.1386 0.644819 3.56613 0.499232 4.00591 0.500003H21.7954C22.2005 0.50045 22.5958 0.625078 22.9278 0.85709C23.2599 1.0891 23.5129 1.41734 23.6526 1.79757L25.4355 6.65105Z" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.0652 18.7368C19.706 16.319 23.8624 16.4405 26.3491 19.008C28.4789 21.2073 28.6929 24.4879 27.051 26.9033C27.1337 26.9602 27.2118 27.0259 27.2838 27.1003L29.5804 29.4716C30.1645 30.0748 30.1352 31.0241 29.515 31.592C28.8947 32.1599 27.9183 32.1314 27.3343 31.5284L25.0377 29.1571C24.9656 29.0825 24.9028 29.0029 24.8493 28.9192C22.2711 30.3676 18.9161 29.963 16.7863 27.7639C14.2996 25.1962 14.4245 21.1547 17.0652 18.7368V18.7368ZM24.1028 21.0647C22.7844 19.7033 20.5805 19.6389 19.1804 20.9208C17.7802 22.2029 17.714 24.3458 19.0326 25.7072C20.351 27.0685 22.5548 27.133 23.955 25.8509C25.3551 24.569 25.4213 22.4261 24.1028 21.0647V21.0647Z"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M22.7069 10.851V15.0501C20.274 14.7931 17.7459 15.5238 15.8124 17.2624C15.6989 16.7724 15.4502 16.3195 15.0888 15.9581C14.5808 15.4501 13.8917 15.1647 13.1732 15.1647C12.4547 15.1647 11.7657 15.4501 11.2576 15.9581C10.7496 16.4662 10.4642 17.1552 10.4642 17.8737V24.5002H5.72955C5.20415 24.5002 4.70027 24.2915 4.32876 23.92C3.95725 23.5485 3.74854 23.0446 3.74854 22.5192V10.851C4.38372 10.8346 5.00336 10.6511 5.54503 10.3189C6.0867 9.98681 6.53128 9.51779 6.83397 8.95912C7.16723 9.56997 7.66926 10.072 8.28011 10.4053C8.8117 10.6957 9.40774 10.8479 10.0135 10.8479C10.6193 10.8479 11.2153 10.6957 11.7469 10.4053C12.3611 10.0686 12.8663 9.56341 13.2029 8.94922C13.5116 9.52247 13.9697 10.0015 14.5286 10.3353C15.0875 10.6692 15.7264 10.8455 16.3775 10.8455C17.0286 10.8455 17.6675 10.6692 18.2264 10.3353C18.7853 10.0015 19.2434 9.52247 19.5521 8.94922C19.7164 9.25552 19.925 9.53588 20.1712 9.78125C20.4098 10.0259 20.6815 10.236 20.9784 10.4053C21.5081 10.6964 22.1025 10.8496 22.7069 10.851Z"
                />
              </svg>
            </Icon>
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

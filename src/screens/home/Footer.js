import * as React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  Divider,
  Link,
  useMediaQuery,
} from "@material-ui/core";
import { MERCHANT_DOMAIN } from "../../utils/api";

function Footer(props) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div>
      <Box
        style={{
          backgroundColor: "#F7F7FC",
          backgroundSize: "cover",
          display: "flex!important",
          alignItems: "center",
          maxWidth: "1920px!important",
          width: "100%",
          borderRadius: isMd ? "0px" : "16px",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            marginTop: "88px",
            width: "100%",
            padding: isMd ? "24px 0 " : "42px 0",
            maxWidth: 1400,
          }}
        >
          <Typography
            variant={isMd ? "h4" : "h4"}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#1AA3E9",
              padding: "0px 24px 0px 24px",
            }}
          >
            Why choose Riders Buddy?
          </Typography>
        </Container>
      </Box>

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          padding: isMd ? "40px 30px" : "80px 24px",
        }}
      >
        <Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: isMd ? "32px 0" : "",
            }}
          >
            <img src={"/assets/prof-mechanics.svg"} alt="prof" />
            <Container>
              <Typography
                variant={isMd ? "h6" : "h6"}
                style={{
                  fontWeight: "800",
                  color: "#0D5275",
                  textAlign: "center",
                }}
              >
                Professional Mechanics
              </Typography>
              <Typography
                variant={isMd ? "subtitle2" : "body1"}
                style={{
                  fontWeight: "500",
                  color: "#6E7191",
                  textAlign: "center",
                }}
              >
                Cheap with excellent jobs
              </Typography>
            </Container>
          </Box>
        </Box>

        <Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: isMd ? "32px" : "32px",
            }}
          >
            <img src={"/assets/relia-prod.svg"} alt="prof" />
            <Container>
              <Typography
                variant={isMd ? "h6" : "h6"}
                style={{
                  fontWeight: "800",
                  color: "#0D5275",
                  textAlign: "center",
                }}
              >
                Reliable products
              </Typography>
              <Typography
                variant={isMd ? "subtitle2" : "body1"}
                style={{
                  fontWeight: "500",
                  color: "#6E7191",
                  textAlign: "center",
                }}
              >
                Proven and tested product quality
              </Typography>
            </Container>
          </Box>
        </Box>

        <Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={"/assets/cus-support.svg"} alt="prof" />
            <Container>
              <Typography
                variant={isMd ? "h6" : "h6"}
                style={{
                  fontWeight: "800",
                  color: "#0D5275",
                  textAlign: "center",
                }}
              >
                Customer Support
              </Typography>
              <Typography
                variant={isMd ? "subtitle2" : "body1"}
                style={{
                  fontWeight: "500",
                  color: "#6E7191",
                  textAlign: "center",
                }}
              >
                Friendly 24/7 Support
              </Typography>
            </Container>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ margin: "0 auto", maxWidth: 1400 }} />

      <Box
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: 1400,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "flex-start",
          padding: "48px 0px",
          flexDirection: isMd ? "column" : "",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: isMd ? "100%" : "60%",
            gap: "32px",
            flexWrap: "wrap",
            padding: "0 24px",
          }}
        >
          <img
            src={"/assets/riders-buddy-horizontal-logo.svg"}
            alt="logo"
            width={isMd ? "80%" : "35%"}
          />
          <Typography
            variant={isMd ? "caption" : "body1"}
            style={{
              fontWeight: "400",
              color: "#6E7191",
              width: isMd ? "100%" : "80%",
              lineHeight: "40px",
              textAlign: "justify",
            }}
          >
            Riders Buddy is a cross-platform application that offers buying and
            selling of wide range of bicycle and motorcycle parts and
            accessories. The brand mission is to provide purchases to consumers
            without the worries of unreliable products. The brand mainly act as
            an open space to work with potential stores that sells bicycle and
            motorcycle parts and accessories.
          </Typography>
          {isMd ? <Divider /> : ""}
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            width: isMd ? "100%" : "40%",
            margin: "0 auto",
            padding: isMd ? "32px 24px" : "",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "56px",
            }}
          >
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1AA3E9",
              }}
            >
              Learn More
            </Typography>
            <Link>About us</Link>
            <Link href={MERCHANT_DOMAIN} target="_blank">
              Merchant Center
            </Link>
            <Link>Help Center</Link>
          </Box>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "56px",
            }}
          >
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1AA3E9",
              }}
            >
              Categories
            </Typography>
            <Link>Bicycle</Link>
            <Link>Motorcycle</Link>
            <Link>Shops</Link>
          </Box>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "56px",
            }}
          >
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1AA3E9",
                paddingTop: isMd ? "64px" : "",
              }}
            >
              Legal
            </Typography>

            <Link href="https://sites.google.com/view/riders-buddy/home">
              Terms and Conditions
            </Link>
            <Link>Privacy Policy</Link>
            <Link>Return Policy</Link>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ margin: "0 auto", maxWidth: 1400 }} />
      <Box
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: 1400,
          display: "flex",
          justifyContent: isMd ? "space-around" : "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "24px 24px",
        }}
      >
        <Typography
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#1AA3E9",
            margin: isMd ? "0 auto" : "",
          }}
        >
          ©2022 Riders Buddy
        </Typography>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            padding: isMd ? "32px 0" : "",
            rgin: isMd ? "0 auto" : "",
          }}
        >
          <Link>
            <img src={"/assets/Facebook.svg"} alt="fb" />
          </Link>
          <Link>
            <img src={"/assets/Twitter.svg"} alt="twitter" />
          </Link>
          <Link>
            <img src={"/assets/Instagram.svg"} alt="insta" />
          </Link>
        </Box>
      </Box>
    </div>
  );
}

export default Footer;

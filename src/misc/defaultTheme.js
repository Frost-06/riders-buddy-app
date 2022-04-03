import { createMuiTheme } from "@material-ui/core";
import config from "./config";
const defaultTheme = createMuiTheme();
export const overridesTheme = {
  typography: {
    fontFamily: "Eudoxus Sans",
  },
  overrides: {
    MuiAppBar: {
      root: {
        height: 96,
        justifyContent: "space-evenly",
        gap: 5,
        backgroundColor: "transparent",
        position: "inherit",
        top: 0,
        zIndex: 99,
        boxShadow: "0px 12px 24px -4px rgba(110, 113, 145, 0.12)",
        backdropFilter: "blur(50px)",
      },
    },
    MuiBottomNavigationAction: {
      root: {
        minWidth: 70,
        maxWidth: 70,
      },
    },
    MuiRating: {
      root: {
        "&.Mui-disabled": {
          opacity: 0.48,
        },
        color: "#ffb520",
        iconEmpty: { color: "#D9DBE9" },
      },
    },

    MuiPaper: {
      elevation1: {
        boxShadow: "0 8px 11px rgba(121,121,121,0.14)",
      },
    },
    MuiTouchRipple: {
      child: {
        backgroundColor: config.palette.primary.main,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: 20,
      },
    },
    MuiTabs: {
      root: {
        overflow: "auto!important",
      },
      scroller: {
        overflow: "auto!important",
      },
    },
    MuiTab: {
      root: {
        "&.Mui-selected": {
          fontWeight: 800,
          color: config.palette.primary.main,
        },
      },
    },
    MuiTypography: {
      root: {
        styleOverrides: {
          h1: {
            lineHeight: "80px",
            fontSize: 56,
            letterSpacing: "1px",
          },
          h2: {
            lineHeight: "54px",
            fontSize: 48,
            letterSpacing: "1px",
          },
          h3: {
            lineHeight: "48px",
            fontSize: 32,
            letterSpacing: "1px",
          },
          h4: {
            fontWeight: 700,
            lineHeight: "36px",
            fontSize: 24,
            letterSpacing: "1px",
          },
          h5: {
            fontWeight: 700,
            lineHeight: "32px",
            fontSize: 20,
            letterSpacing: "0.75px",
          },
          h6: {
            fontWeight: 700,
            lineHeight: "32px",
            fontSize: 18,
            letterSpacing: "0.75px",
          },
          subtitle1: {
            fontWeight: 500,
            lineHeight: "24px",
            fontSize: 16,
            letterSpacing: "0.75px",
          },
          subtitle2: {
            fontWeight: 600,
            lineHeight: "22px",
            fontSize: 14,
            letterSpacing: "0.75px",
          },
          body1: {
            lineHeight: "24px",
            fontSize: 16,
            letterSpacing: "0.75px",
          },
          body2: {
            lineHeight: "22px",
            fontSize: 14,
            letterSpacing: "0.75px",
          },
          caption: {
            lineHeight: "22px",
            fontSize: 12,
            letterSpacing: "0.25px",
          },
          overline: {
            lineHeight: "22px",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.25px",
          },
          button: {
            fontWeight: 800,
            lineHeight: "26px",
            fontSize: 15,
            letterSpacing: "0.75px",
            textTransform: "none",
          },
        },
        "&.error": {
          color: "#ff8d00",
          fontWeight: 400,
        },
        "&.have-account": {
          fontWeight: 500,
          marginTop: 13,
          textAlign: "center",
        },
        fontFamily: "'Eudoxus Sans', sans-serif!Important",
        "& a:link,& a:visited": {
          color: config.palette.primary.main + "!important",
          textDecoration: "none",
        },
      },
    },
    MuiFormHelperText: {
      root: {
        "&.Mui-error": {
          color: "#ff8d00",
        },
      },
    },
    MuiButtonBase: {
      root: {
        "&.back-button": {
          marginLeft: -24,
          "& span": {
            fontSize: "3.25rem",
          },
        },
        "&.themed-button": {
          borderRadius: 40,
          overflow: "hidden",
          padding: defaultTheme.spacing(2),
          width: "100%",
          letterSpacing: "0.75px",
          boxShadow: "0px 8px 16px rgba(26, 163, 233, 0.24)",
          textTransform: "none",
          "&:not(.inverted):not(.Mui-disabled):hover,&.inverted": {
            backgroundColor: config.palette.primary.pale,
            color: config.palette.primary.main,
            boxShadow: "none",
            borderRadius: 40,
          },
          "&.inverted:not(.Mui-disabled):hover,&:not(.Mui-disabled):not(.inverted)":
            {
              color: "#fcfcfc",
              backgroundColor: config.palette.primary.main,
              borderRadius: 40,
            },
          "&.Mui-disabled": {
            color: "#6b6b6b",
            backgroundColor: "#cccccc",
            borderRadius: 40,
          },
        },
      },
    },

    MuiTextField: {
      root: {
        "&.themed-input": {
          marginTop: 30,

          "& .Mui-focused": {
            "& input": {
              borderColor: config.textField.focused.borderColor,
              backgroundColor: "#fff",
              transition: "0.5 ease-in",
            },
          },
          "& label": {
            top: -10,
            left: -10,
            "&:not(.MuiFormLabel-filled):not(.Mui-focused):not(.MuiInputLabel-shrink)":
              {
                top: -1,
                left: 3,
              },
            "&.Mui-error": {
              color: "#ff8d00",
            },
          },
          "& .Mui-error input": {
            border: "1px solid #ff8d00",
          },
          "& input": {
            border: "1px solid #D9DBE9",
            backgroundColor: "#FCFCFC",
            borderRadius: 16,
            height: 20,
            fontWeight: 500,
          },
          "& fieldset": {
            display: "none",
          },
        },
      },
    },
  },
};

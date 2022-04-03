import { createMuiTheme } from "@material-ui/core";
import { overridesTheme } from "./defaultTheme";
import config from "./config";

function getTheme(type) {
  if (type === "light") {
    return createMuiTheme(lightTheme);
  } else {
    return createMuiTheme(darkTheme);
  }
}
export default getTheme;
const lightTheme = {
  palette: {
    ...config.palette,
    type: "light",
  },
  ...overridesTheme,
};
const darkTheme = {
  palette: {
    ...config.palette,
    type: "light",
  },
  overrides: {
    ...overridesTheme.overrides,
    MuiTouchRipple: {
      child: {
        backgroundColor: "#000000",
      },
    },
  },
};

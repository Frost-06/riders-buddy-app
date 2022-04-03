import { useEffect } from "react";
import { history } from "../../App";

export function Epasuyo(props) {
  useEffect(() => {
    history.push({
      pathname: "/checkout",
      state: {
        service_name: "e-pasuyo",
      },
    });
  }, []);
  return null;
}
export function Epasurprise(props) {
  useEffect(() => {
    history.push({
      pathname: "/checkout",
      state: {
        service_name: "e-pasurprise",
      },
    });
  }, []);
  return null;
}
export function Epalaba(props) {
  useEffect(() => {
    history.push({
      pathname: "/checkout",
      state: {
        service_name: "e-palaba",
      },
    });
  }, []);
  return null;
}

import React from "react";
import GetStarted from "../../components/GetStarted";
import RegisterForm from "../../components/RegisterForm";

export function GetStartedScreen(props) {
  return <GetStarted {...props} />;
}

export function RegistrationForm(props) {
  return <RegisterForm {...props} />;
}

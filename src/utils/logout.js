import { history } from "../App";
import socket from "./socket";

export default function logout(callback, userContext) {
  window.localStorage.clear();
  history.push("/login");
  socket.emit("user:offline", userContext?.user_id);
  if (callback) callback();
}

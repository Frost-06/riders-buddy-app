import socket from "../utils/socket";

const { default: Api } = require("../utils/api");
const { default: fetchData } = require("../utils/fetchData");

export default class Chat {
  constructor() {}
  static subscribe(order_id) {
    socket.emit("join:room:orders", { order_id });
  }
  static unsubscribe(order_id) {
    socket.emit("leave:room:orders", { order_id });
  }
  static async get(order_id) {
    return await fetchData({
      send: async () =>
        await Api.get(`/chat?order_id=${order_id}&token=${Api.getToken()}`),
    });
  }
  static async listen(callback) {
    socket.off("message:room:orders");
    socket.on("message:room:orders", callback);
  }
  static async send(order_id, body) {
    return await fetchData({
      send: async () =>
        await Api.post(`/chat?order_id=${order_id}&token=${Api.getToken()}`, {
          body,
        }),
    });
  }
}

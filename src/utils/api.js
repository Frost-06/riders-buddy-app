import axios from "axios";

export const DOMAIN = "http://localhost:3001/public";
export const MERCHANT_DOMAIN = "http://localhost:3002";
const SOCKET_DOMAIN = "http://localhost:3003";

const Api = {
  get: (ENDPOINT, params = {}) =>
    axios
      .get(DOMAIN + ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + Api.token,
        },
        cancelToken: new axios.CancelToken(function executor(c) {
          let url = window.location.pathname;
          params.cancelToken && params.cancelToken(c);
          window.onclick = () => {
            if (url !== window.location.pathname) {
              c();
            }
          };
        }),
        ...params.config,
      })
      .then((resp) => resp.data),
  post: (ENDPOINT, params = {}) => {
    return axios
      .post(DOMAIN + ENDPOINT, params.body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + Api.token,
          ...params.headers,
        },
        onUploadProgress: (progressEvent) =>
          params.onUploadProgress
            ? params.onUploadProgress(progressEvent)
            : progressEvent,
        cancelToken: new axios.CancelToken(function executor(c) {
          if (params.cancelToken) params.cancelToken(c);
        }),
        ...params.config,
      })
      .then((resp) => resp.data);
  },
  delete: (ENDPOINT, params = {}) => {
    return axios
      .delete(DOMAIN + ENDPOINT, params.body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + Api.token,
          ...params.headers,
        },
        ...params.config,
      })
      .then((resp) => resp.data);
  },
  auth: async (callback = {}) => {
    if (localStorage["auth"]) {
      let u = JSON.parse(localStorage["auth"]);
      Api.token = u.token;
      let res = await Api.post("/users/auth", {
        body: { token: Api.token },
      }).catch((e) => {
        callback.fail && callback.fail(e);
      });
      if (res?.success) {
        return callback.success ? callback.success(res) : res;
      }
    }
    localStorage.removeItem("auth");
    callback.fail && callback.fail();
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/login/"
    )
      window.location = "/login?r=" + window.location.pathname;
  },
  getToken: function () {
    try {
      let user = JSON.parse(window.localStorage["user"]);
      if (user.user_token) {
        return user.user_token;
      }
    } catch (e) {}
  },
  getUrl: (path = "") => DOMAIN + path,
};

export const SocketApi = {
  get: (ENDPOINT, params = {}) =>
    axios
      .get(SOCKET_DOMAIN + ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + Api.token,
        },
        cancelToken: new axios.CancelToken(function executor(c) {
          let url = window.location.pathname;
          params.cancelToken && params.cancelToken(c);
          window.onclick = () => {
            if (url !== window.location.pathname) {
              c();
            }
          };
        }),
        ...params.config,
      })
      .then((resp) => resp.data),
  post: (ENDPOINT, params = {}) => {
    return axios
      .post(SOCKET_DOMAIN + ENDPOINT, params.body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + Api.token,
          ...params.headers,
        },
        onUploadProgress: (progressEvent) =>
          params.onUploadProgress
            ? params.onUploadProgress(progressEvent)
            : progressEvent,
        cancelToken: new axios.CancelToken(function executor(c) {
          if (params.cancelToken) params.cancelToken(c);
        }),
        ...params.config,
      })
      .then((resp) => resp.data);
  },
  auth: async (callback = {}) => {
    if (localStorage["auth"]) {
      let u = JSON.parse(localStorage["auth"]);
      Api.token = u.token;
      let res = await Api.post("/users/auth", {
        body: { token: Api.token },
      }).catch((e) => {
        callback.fail && callback.fail(e);
      });
      if (res?.success) {
        return callback.success ? callback.success(res) : res;
      }
    }
    localStorage.removeItem("auth");
    callback.fail && callback.fail();
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/login/"
    )
      window.location = "/login?r=" + window.location.pathname;
  },
};
export default Api;

String.prototype.ucfirst = function () {
  return this.valueOf()[0].toUpperCase() + this.valueOf().slice(1);
};

export const MapBoxApi = {
  getDirections: async (coordinates = []) => {
    if (!Object.keys(coordinates).length) return;
    let coord = "";
    coordinates.forEach((c) => {
      coord += c.toString() + ";";
    });
    coord = coord.slice(0, coord.length - 1);
    return await axios
      .get(
        "https://api.mapbox.com/directions/v5/mapbox/driving/" +
          coord +
          "?access_token=" +
          process.env.REACT_APP_MAPBOX_TOKEN
      )
      .then((resp) => resp.data);
  },getDistance: async (customerAddress, merchCoord) => {
    if (!merchCoord.length || !customerAddress.length) return;
    const customerLatLong = await axios.get(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/"+customerAddress+".json?types=place%2Cpostcode%2Caddress&access_token="+process.env.REACT_APP_MAPBOX_TOKEN
    );
    if(!customerLatLong.data.features[0]) return;
    const {coordinates} = customerLatLong.data.features[0].geometry;
    const coord = coordinates.join(",")+";"+merchCoord;
    return await axios
      .get(
        "https://api.mapbox.com/directions/v5/mapbox/driving/" +
        coord +
          "?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=" +
          process.env.REACT_APP_MAPBOX_TOKEN
      )
      .then((resp) => resp.data);
  },
};

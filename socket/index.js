var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var qs = require("query-string");
var cors = require("cors");
const OTP = [];
const users = {};

app.use(cors());

app.get("/", (req, res) => {
  res.end("dev");
});

app.get("/otp-status", (req, res) => {
  const email = req.query.email;
  let index = OTP.findIndex(
    (q) => q.user_email.toLowerCase() === email.toLowerCase()
  );
  if (index >= 0) {
    res.json({
      status: true,
      duration: OTP[index].duration,
      user_email: OTP[index].user_email,
      start_date: OTP[index].start_date,
      original_duration: OTP[index].original_duration,
    });
  } else {
    res.json({
      status: false,
    });
  }
});

function startCountDown(user) {
  let index = OTP.findIndex(
    (q) => q.user_email.toLowerCase() === user.user_email.toLowerCase()
  );
  if (index >= 0 && !OTP[index].countdown) {
    OTP[index].countdown = null;
    clearInterval(OTP[index].countdown);
    OTP[index].countdown = setInterval(() => {
      const otp = OTP[index];
      if (otp) {
        otp.duration -= 1000;
        if (otp.duration <= 0) {
          clearInterval(OTP[index].countdown);
          OTP.splice(index, 1);
        }
      }
    }, 1000);
  }
}

io.on("connection", (socket) => {
  socket.on("user:online", ({ user_id, user_type }) => {
    console.log("logged in", user_id);
    users[user_id] = { socket, user_type };
  });
  socket.on("user:offline", (user_id) => {
    console.log("logged out", user_id);
    delete users[user_id];
  });

  socket.on("otp", (args) => {
    let otpIndex = OTP.findIndex(
      (q) => q.user_email.toLowerCase() === args.user_email.toLowerCase()
    );
    args["original_duration"] = args["duration"];
    if (otpIndex >= 0) {
      OTP[otpIndex] = args;
    } else {
      OTP.push(args);
    }
    console.log(args);
    startCountDown(args);
  });

  socket.on("order:new", (args) => {
    socket.broadcast.emit("order:new", args);
  });

  socket.on("order:update", (args) => {
    if (users[args.consumer_user_id])
      io.to(users[args.consumer_user_id].socket.id).emit("order:update", args);
    Object.keys(users).forEach(function (user) {
      if (
        user != args.consumer_user_id &&
        socket.id != users[user].socket.id &&
        (users[user].user_type.name == "driver" ||
          users[user].user_type.name == "admin")
      ) {
        io.to(users[user].socket.id).emit("order:update", args);
      }
    });
  });

  socket.on("join:room:orders", ({ order_id }) => {
    console.log("joined", socket.id);
    socket.join("orders_" + order_id);
  });

  socket.on("leave:room:orders", ({ order_id }) => {
    console.log("left", socket.id);
    socket.leave("orders_" + order_id);
  });

  socket.on("send:room:orders", (chat) => {
    socket.to("orders_" + chat.order_id).emit("message:room:orders", chat);
  });

  socket.on("notifications:chat:remove", (args = []) => {
    if (args.length) {
      if (users[args[0].consumer_user_id]) {
        io.to(users[args[0].consumer_user_id].socket.id).emit(
          "notifications:chat:remove",
          args
        );
      }
    }
  });
  socket.on("notifications:update", (args) => {
    if (args.consumer_user_id > 0) {
      if (users[args.consumer_user_id]) {
        io.to(users[args.consumer_user_id].socket.id).emit(
          "notifications:update",
          args
        );
        io.to(users[args.consumer_user_id].socket.id).emit(
          "notifications:new",
          args
        );
      }
    } else {
      socket.broadcast.emit("notifications:update", args);
      socket.broadcast.emit("notifications:new", args);
    }
  });
  socket.on("notifications:chat", (args) => {
    if (users[args.consumer_user_id]) {
      io.to(users[args.consumer_user_id].socket.id).emit(
        "notifications:chat",
        args
      );
      io.to(users[args.consumer_user_id].socket.id).emit(
        "notifications:new",
        args
      );
    }
  });
});

http.listen(3003, () => {
  console.log("listening on *:3003");
});

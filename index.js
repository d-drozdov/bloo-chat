const debug = require("debug")("bloo-chat");
const nunjucks = require("nunjucks");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const auth = require("./server/routes/auth");
const io = require("socket.io")(http);
const db = require("./server/data/db");
const { globalErrorHandler } = require("./server/util/middleware");

const port = process.env.PORT || 7000;

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

db.connect();

app.use(express.json());

app.use(express.static("assets"));

// browser routing

app.get("/chatroom", async (req, res) => {
  res.render("chatroom.njk", { uname: req.query.uname });
});

app.get("/", (req, res) => {
  res.render("index.njk", null);
});

// server routes
app.use(auth);

// socket
require("./services/socket")(io);

app.use(globalErrorHandler);

http.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

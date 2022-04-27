const debug = require("debug")("bloo-chat");
const nunjucks = require("nunjucks");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);


const port = process.env.PORT || 7000;

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(express.static("assets"));

app.get("/", (req, res) => {
  res.render("index.njk", null);
});

app.get("/chatroom", (req, res) => {
  //if isauthenticated 
  res.render("chatroom.njk", { uname: req.query.uname });
  // else render index.njk
});

const activeUsers = new Map();

io.on("connection", function (socket) {

  socket.on("join", (msg) => {
    const newUser = msg.user;
    outputWelcomeMessageToCurrUser(socket, msg);
    outputActiveUsersToCurrUser(socket, msg);
    informOtherUsersOfNewUser(socket, msg, newUser);
    activeUsers.set(socket.id, newUser);
  });

  socket.on("message", (msg) => {
    debug(`${msg.user}: ${msg.message}`);
    //Broadcast the message to everyone
    io.emit("message", msg);
  });

  socket.on("disconnect", () => { 
    console.log(socket.id);
    const userThatLeft = activeUsers.get(socket.id);
    const msg = {
      user : "BlooChatApp",
      message: `${userThatLeft} has left`,
      type: "disconnect"
    };
    debug(`${msg.user}: ${msg.message}`)
    io.emit("message", msg);
    activeUsers.delete(socket.id);
  });

});

function  outputWelcomeMessageToCurrUser(socket, msg){
  msg.user = "BlooChatApp";
  debug(`${msg.user}: ${msg.message}`);
  socket.emit("message", msg); 
}

function outputActiveUsersToCurrUser(socket, msg){
  let outputString = "Unfortunately no one else is in the room";
  if(activeUsers.size != 0){
    outputString = "Online Users: ";
    outputString +=`${Array.from(activeUsers.values()).join(", ")}`;
  }
  msg.message = outputString
  debug(`${msg.user}: ${msg.message}`);
  socket.emit("message", msg);
}

function informOtherUsersOfNewUser(socket, msg, newUser){
  msg.message = `${newUser} just joined!`;
  socket.broadcast.emit("message", msg);
}


http.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

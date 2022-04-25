const debug = require("debug")("bloo-chat");
const nunjucks = require("nunjucks");
const express = require("express");
const { disconnect } = require("process");
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
  res.render("chatroom.njk", { uname: req.query.uname });
});

const activeUsers = new Map();

io.on("connection", function (socket) {

  socket.on("join", (msg) => {
    console.log("connection occured");
    //This outputs a welcome message to the current user
    const user = msg.user;
    msg.user = "BlooChatApp";
    debug(`${msg.user}: ${msg.message}`);
    socket.emit("message", msg);
    
    //This outputs to the current user who else in the room
    let outputString = "Unfortunately no one else is in the room";
    if(activeUsers.size != 0){
      outputString = "Online Users: ";
      outputString +=`${Array.from(activeUsers.values()).join(", ")}`;
    }
    msg.message = outputString
    debug(`${msg.user}: ${msg.message}`);
    socket.emit("message", msg);

    //This outputs to everyone except the user that current user has joined
    msg.message = `${user} just joined!`;
    socket.broadcast.emit("message", msg);
    
    activeUsers.set(socket.id, user);
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
      message: `${userThatLeft} has left!`,
      type: "disconnect"
    };
    debug(`${msg.user}: ${msg.message}`)
    io.emit("message", msg);
    activeUsers.delete(socket.id);
  });

});

http.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

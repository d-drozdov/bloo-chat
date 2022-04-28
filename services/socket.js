const debug = require("debug")("bloo-chat");

exports = module.exports = function(io) {

  const activeUsers = new Map();
  io.on("connection", function (socket) {
    socket.on("join", (msg) => {
      const newUser = msg.user;
      const found = (Array.from(activeUsers.values()))
                      .find(currUserName => currUserName === msg.user); 
      if (!found) {
        outputWelcomeMessageToCurrUser(socket, msg);
        outputActiveUsersToCurrUser(socket, msg);
        informOtherUsersOfNewUser(socket, msg, newUser);
        activeUsers.set(socket.id, newUser);
      } else {
        socket.emit("userAlreadyActive", newUser);
      }
    });

    socket.on("message", (msg) => {
      debug(`${msg.user}: ${msg.message}`);
      //Broadcast the message to everyone
      io.emit("message", msg);
    });

    socket.on("disconnect", () => { 
      const userThatLeft = activeUsers.get(socket.id);
      if(userThatLeft){
        const msg = {
        user : "BlooChatApp",
        message: `${userThatLeft} has left`,
        type: "disconnect"
        };
        debug(`${msg.user}: ${msg.message}`)
        io.emit("message", msg);
        activeUsers.delete(socket.id);
      }
    });

  });

  function outputWelcomeMessageToCurrUser(socket, msg){
    msg.user = "BlooChatApp";
    debug(`${msg.user}: ${msg.message}`);
    socket.emit("message", msg); 
  }

  function outputActiveUsersToCurrUser(socket, msg){
    let outputString = "Unfortunately no one else is in the room";
    if(activeUsers.size !== 0){
      outputString = "Online Users: ";
      outputString +=`${Array.from(activeUsers.values()).join(", ")}`;
    }
      msg.message = outputString
      debug(`${msg.user}: ${msg.message}`);
      socket.emit("message", msg);
  } 

  function informOtherUsersOfNewUser(socket, msg, newUser) {
    msg.message = `${newUser} just joined!`;
    socket.broadcast.emit("message", msg);
  }

}

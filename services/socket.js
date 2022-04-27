
exports = module.exports = function(io) {

    const activeUsers = new Map();

    io.on("connection", function (socket) {

    socket.on("join", (msg) => {
      const newUser = msg.user;
      outputWelcomeMessageToCurrUser(socket, msg);
      outputActiveUsersToCurrUser(socket, msg, newUser);
      informOtherUsersOfNewUser(socket, msg, newUser);
      activeUsers.set(socket.id, newUser);
    });

    socket.on("message", (msg) => {
      // debug(`${msg.user}: ${msg.message}`);
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
      // debug(`${msg.user}: ${msg.message}`)
      io.emit("message", msg);
      activeUsers.delete(socket.id);
    });

});

function  outputWelcomeMessageToCurrUser(socket, msg){
  msg.user = "BlooChatApp";
  // debug(`${msg.user}: ${msg.message}`);
  socket.emit("message", msg); 
}

function outputActiveUsersToCurrUser(socket, msg, newUser){
  const activeUsernames = Array.from(activeUsers.values());
  //const found = activeUsernames.find(currUserName => currUserName === msg.user);
  let outputString = "Unfortunately no one else is in the room";
  if(activeUsers.size !== 0){
    outputString = "Online Users: ";
    outputString +=`${activeUsernames.join(", ")}`;
  }
    msg.message = outputString
    // debug(`${msg.user}: ${msg.message}`);
    socket.emit("message", msg);
} 


function informOtherUsersOfNewUser(socket, msg, newUser) {
  //const activeUsernames = Array.from(activeUsers.values);
  //if(activeUsernames.find(currUserName => currUserName === msg.user)){ 
    msg.message = `${newUser} just joined!`;
    socket.broadcast.emit("message", msg);
  //}
}

}

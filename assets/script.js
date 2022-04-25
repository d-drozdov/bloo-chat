document.addEventListener("DOMContentLoaded", (_event) => {
  // Connect to socket.io
  const socket = io(); // automatically tries to connect on same port app was served from
  const username = document.getElementById("uname").innerText;
  const form = document.getElementById("chatForm");
  const messages = document.getElementById("messages");
  const messageToSend = document.getElementById("txt");
  
  form.addEventListener("submit", (event) => {
    socket.emit("message", {
      user: username,
      message: sanitizeMessage(messageToSend.value),
      type: "message"
    });
    messageToSend.value = "";
    event.preventDefault();
  });

  // append the chat text message
  socket.on("message", (msg) => {
    const message = document.createElement("li");
    let color = "white";
    if(msg.type === "join") color = "#07b240";
    else if(msg.type === "disconnect") color = "pink";
    message.innerHTML = `<button class="nametag" style="color:${color}">${msg.user}:</button> <font color="${color}">${msg.message}</font>`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  });

  socket.emit("join", {
    user: username,
    message: `Welcome ${username}!`,
    type: "join"
  });

});

function sanitizeMessage(message){
  //TODO: Implement by removing brackets
  return sanitizedString;
}
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
      message: messageToSend.value,
      type: "message"
    });
    messageToSend.value = "";
    event.preventDefault();
  });

  // append the chat text message
  socket.on("message", (msg) => {
    const message = document.createElement("li");
    let color = "#FFFFFF";
    if(msg.type === "join") color = "#07b240";
    else if(msg.type === "disconnect") color = "red";
    message.innerHTML = `<font color="${color}"><button class="nametag" style = "color:${color}"><strong>${msg.user}:</strong></button> ${msg.message}</font>`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight
  });

  socket.emit("join", {
    user: username,
    message: `Welcome ${username}`,
    type: "join"
  });

  
});

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
    message.id = "message";
    let color = "white";
    if(msg.type === "join") {
      color = "#07b240";
    } else if(msg.type === "disconnect") {
      color = "pink";
    }
    const userTag = document.createElement("span");
    userTag.className = "nametag";
    userTag.style.color = color;
    userTag.innerText = msg.user;
    
    const userMessage = document.createElement("span");
    userMessage.style.color = color;
    userMessage.innerText = ` ${msg.message}`;

    message.append(userTag);
    message.append(userMessage);
    //message.innerHTML = `<button class="nametag" style="color:${color}">${msg.user}:</button><font color="${color}"> ${msg.message}</font>`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  });

  socket.emit("join", {
    user: username,
    message: `Welcome ${username}!`,
    type: "join"
  });

});

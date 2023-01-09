const socket = io();
// When a message is received, add it to the list of messages
socket.on("chat message", (data) => {
  // const li = document.createElement("li");
  // li.textContent = `${data.username}: ${data.message}`;
  // document.querySelector("#messages").appendChild(li);
  const li = document.createElement("li");
  li.innerHTML = `<span style="color: ${data.color}">${data.username}</span>: ${data.message}`;
  document.querySelector("#messages").appendChild(li);
  document.querySelector("#messages").scrollTop =
    document.querySelector("#messages").scrollHeight;
});

// When the form is submitted, send the message
document.querySelector("#chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("chat message", document.querySelector("#message").value);
  document.querySelector("#message").value = "";
});

// When the user starts typing, send a "typing" event to the server
document.querySelector("#message").addEventListener("keydown", () => {
  socket.emit("typing");
});

// When a "typing" event is received, update the "typing" message
socket.on("typing", (username) => {
  document.querySelector("#typing").textContent = `${username} is typing...`;
});

// When a message is received, clear the "typing" message
socket.on("chat message", () => {
  document.querySelector("#typing").textContent = "";
});

// When the login form is submitted, send the username to the server
document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("add user", document.querySelector("#username").value);
  document.querySelector("#login-form").style.display = "none";
});

document.querySelector("#chat-input").style.display = "none";
// When the login form is submitted, send the username to the server
document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("add user", document.querySelector("#username").value);
  document.querySelector("#login-form").style.display = "none";
  document.querySelector("#chat-input").style.display = "block";
});

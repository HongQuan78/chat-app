const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  // Assign a unique username and color to the user
  socket.on('add user', (username) => {
    users[socket.id] = {
      username: username,
      color: getRandomColor(),
    };
    socket.emit('login', Object.values(users));
    socket.broadcast.emit('user joined', users[socket.id]);
  });

  // Remove the user from the list of users when they disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit('user left', users[socket.id]);
    delete users[socket.id];
  });

  // When a message is received, send it to all connected users
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', {
      username: users[socket.id].username,
      message: msg,
      color: users[socket.id].color,
    });
  });

  // When a user starts typing, broadcast the "typing" event to all users
  socket.on('typing', () => {
    socket.broadcast.emit('typing', users[socket.id].username);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Generate a random color for the user
function getRandomColor() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Node Server which handles Socket io connections
const io = require('socket.io')(8000, {
    cors: {
        origin: "http://localhost:5500",
        methods: ["GET", "POST"]
      }
}) // PORT is 8000


const users = {};

io.on('connection', socket => {
    // If any new user joins the chat let other users connected to the server know!
    socket.on('new-user-joined', name => {
        console.log("New user " + name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });
    
    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('recieve', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, broadcast it to other people
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]
    });

    
})

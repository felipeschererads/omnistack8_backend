require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var port = process.env.PORT || 3333;

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  connectedUsers[user] = socket.id;
});

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});


var corsOptions = {
  origin: 'https://tindev-fscherer.herokuapp.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

server.listen(port);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const { API_PORT } = process.env;

const avatarRouter = require('./routers/avatar.router');
const authRouter = require('./routers/auth.router');
const userRouter = require('./routers/user.router');
const worldRouter = require('./routers/world.router');

const { BAD_REQUEST } = require('http-status-codes');

require('./config/database.config');

app.use(morgan('combined', { skip: (_, res) => res.statusCode < BAD_REQUEST }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/avatars', avatarRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/worlds', worldRouter);

app.use('/', (_, res) => {
  res.json({ msg: 'Hello from CraftFolioGotchi API!' });
});

const server = app.listen(parseInt(API_PORT, 10), () => {
  console.log(`CraftFolioGotchiAPI up and running at 0.0.0.0:${API_PORT}... :)`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('moved', ({ username, room, newPosition }) => {
    io.to(room).emit('moved', { username, newPosition });
  });

  socket.on('jumped', ({ username, room }) => {
    io.to(room).emit('jumped', username);
  });

  socket.on('join-room', ({ room, user }) => {
    io.to(room).emit('joined-room', { user });
    socket.join(room);
  });

  // socket.on('disconnect', () => {
  //   console.log('Oi');
  // });
});

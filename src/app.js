const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const { API_PORT } = process.env;

const authRouter = require('./routers/auth.router');

require('./config/database.config');

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', authRouter);

app.use('/', (_, res) => {
  res.json({ msg: 'Hello from CraftFolioGotchi API!' });
});

app.listen(parseInt(API_PORT, 10), () => {
  console.log(`CraftFolioGotchiAPI up and running at 0.0.0.0:${API_PORT}... :)`);
});

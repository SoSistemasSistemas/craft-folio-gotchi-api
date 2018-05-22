const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION_STRING);

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

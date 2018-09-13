
const {mongoose, databaseUrl, options} = require('../database.js');

const connectDatabase = async () => {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};

const mongoose = require("mongoose");

const databaseConnection = async () => {
  // mongoose
  //   .connect(process.env.DB_URL)
  //   .then((conn) => {
  //     console.log(`database connected: ${conn.connection.host}`);
  //   })

    try {
      const conn = await mongoose.connect(process.env.DB_URL)
      console.log(`database connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
};

module.exports = databaseConnection
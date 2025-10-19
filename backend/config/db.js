const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
    console.log("Connected to: ",mongoose.connection.host)
    console.log("Database : ",mongoose.connection.name)
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
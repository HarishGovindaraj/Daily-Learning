const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/de_roadmap', {
      serverSelectionTimeoutMS: 5000 // Fast fail for local offline DB
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('==================================================');
    console.error(`⚠️ MONGODB CONNECTION ERROR: ${error.message}`);
    console.error('The server started but database calls will fail until MongoDB is running.');
    console.error('Verify your MONGO_URI in .env or run local MongoDB service.');
    console.error('==================================================');
  }
};

module.exports = connectDB;

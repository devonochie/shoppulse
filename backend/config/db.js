const mongoose = require('mongoose');

const connectDB = async () => {
  try {
     await mongoose.connect(process.env.MONGO_URI, 
        { useNewUrlParser: true });
     console.log('Mongo connected')
  } catch (error) {
     console.log('Mongo disconnected', error)
     process.exit(1)
  }
}

module.exports = connectDB

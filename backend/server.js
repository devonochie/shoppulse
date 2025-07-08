require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/db')
const router = require('./routes')
const path = require('path')


const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Allow cookies and authentication headers
}));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))


// database connection
connectDB()

// app router 
app.use('/api', router)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// internal error handling
app.use((err, req, res, next) => {
  next(err)

  if(err){
    return res.status(err.output.statusCode || 500).json(err.output.payload)
  }

  return res.status(500).json(err)
})

// server connection

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Server is up at: ',PORT));

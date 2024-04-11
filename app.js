// app.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const mapRouter = require('./routes/map')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/polygons', mapRouter)

// Connect to MongoDB using Mongoose
const { DB_URL } = process.env

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(err => {
    console.error('Error connecting to MongoDB: ', err.message)
  })

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

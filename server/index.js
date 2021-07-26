const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')

const chartsRouter = require('./routes/charts-router')

const app = express()
const apiPort = 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
app.use('/login', (req, res) => {
    res.send({
      token: 'test123'
    });
  });
app.get('/', (req, res) => {
    res.send('Concentrix Chart Application API')
})



app.use('/api', chartsRouter)
console.log('******************************')
app.listen(apiPort, () => console.log(` \n\nHi Badri Chorapalli,\nConcentrix Chart Application API Server running on port ${apiPort}\n\n`))

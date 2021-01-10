require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const port = process.env.HTTP_PORT
//init
const db = require('./database')

var index = require('./routes/index')
var timeline = require('./routes/timeline')

app.use('/public', express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*, content-type, authorization");
    next();
})


app.use('/', index)
app.use('/api', timeline)
app.listen(port, () => {
    console.log('server is running...')
});
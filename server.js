
let express = require('express')
let bodyParser = require('body-parser')
let params = require("./config")
let mongoose = require('mongoose')
let apiRoutes= require('./api')
let multer = require('multer')()
let app = express()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect(params.conf.mongoUrl, { useNewUrlParser: true })
app.use('/',multer.single('file'), apiRoutes)

app.listen(params.conf.port, function () {
    console.log("Running RestHub on port ");
});
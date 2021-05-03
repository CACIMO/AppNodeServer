let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let params = require("./config")
let mongoose = require('mongoose')
let apiRoutes= require('./api')
let multer = require('multer')()
let app = express()
var path = require('path');
var cookieParser = require('cookie-parser');

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect(params.conf.mongoUrl,  {useNewUrlParser: true, useUnifiedTopology: true})
app.use('/',multer.single('file'), apiRoutes)
app.use('/web',express.static(path.join(__dirname, 'web')))

app.listen(params.conf.port, function () {
    console.log("Running RestHub on port ");
});
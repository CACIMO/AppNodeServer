let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let params = require("./config")
let mongoose = require('mongoose')
let apiRoutes= require('./testApi')
let multer = require('multer')()
let app = express()
var path = require('path');
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 5011 }) 

wss.on('connection',  (ws, req)=>  {
    console.log(ws)
    console.log(req)
})


app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect(params.conf.mongoUrlTest,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

app.use('/',multer.array('file',20), apiRoutes)
app.use('/web',express.static(path.join(__dirname, 'web')))

app.listen(params.conf.testPort, function () {
    console.log("Running RestHub on port ");
});
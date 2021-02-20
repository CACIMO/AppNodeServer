
let express = require('express');
let bodyParser = require('body-parser');
let params = require("./config");
let mongoose = require('mongoose');
let app = express();
//let apiRoutes = require("./api-routes");
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
mongoose.connect(params.conf.mongoUrl, { useNewUrlParser: true });
var db = mongoose.connection;


if (!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || p;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// Use Api routes in the App
//app.use('/api', apiRoutes);
// Launch app to listen to specified port
app.listen(arams.conf.mongoUrl, function () {
    console.log("Running RestHub on port " + port);
});
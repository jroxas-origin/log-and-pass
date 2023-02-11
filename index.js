const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
var multer = require('multer');
var forms = multer();

const app = express();

app.use(cors());

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(forms.array()); 
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post("/log", (req, res) => {
  console.log(req);
  res.status(200).send(req);
});

app.post("/rest", (req, res) => {

  try {

    res.set('Content-Type', 'application/json');
    res.status(200).send(JSON.parse(req.rawBody));

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

});

app.post("/soap", (req, res) => {

  try {

    res.set('Content-Type', 'application/xml');
    res.status(200).send(req.rawBody);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

});

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

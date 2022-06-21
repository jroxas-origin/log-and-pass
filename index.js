const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  //app.get('/', verifyCognitoToken, verifyIDCSToken, verifyAuthenticated, (req, res) => {
  res.send("Hello from server");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.status(200).send("Hello from server");
});


app.post("/get-appointments", (req, res) => {
  console.log(req.body);
  //app.get('/', verifyCognitoToken, verifyIDCSToken, verifyAuthenticated, (req, res) => {
  res.send("Hello from server");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
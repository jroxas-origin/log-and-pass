const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.post("/get-appointments", (req, res) => {
  console.log(req.body);
  //app.get('/', verifyCognitoToken, verifyIDCSToken, verifyAuthenticated, (req, res) => {
  res.send("Hello from server");
});

const server = app.listen(3000, function () {
  console.log(
    `${new Date()} : HTTP server running using HTTP on port ${3000}...`
  );
});

server.setTimeout(30000);
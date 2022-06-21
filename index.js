const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.status(200).send({ message: 'Hello from server!', body: req.body });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
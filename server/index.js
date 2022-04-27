const UserDao = require("./data/UserDao");
const db = require("./data/db");


const app = express();
const express = require("express");

const port = process.env.PORT || 5000;

db.connect();


app.get("/", (req, res) => {
  res.send("BlooChat API!");
});


app.listen(port, () => {
  console.log(`Express app listening at port: http://localhost:${port}/`);
});
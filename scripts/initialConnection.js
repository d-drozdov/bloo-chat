require("dotenv").config();
const mongoose = require("mongoose");

// TODO replace <password> with the password for quicknote-admin
const URI = process.env.DB_URI;

console.log(URI);

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

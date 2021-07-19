"use strict";

const mongoose = require("mongoose");
const env = process.env;

mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.error(err));

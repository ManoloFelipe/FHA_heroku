"use strict";

// if (process.env.NODE_ENV === "development") require("dotenv").config();

const env = process.env;

const express = require("express");

//Carga Routes
const proyectos = require("./routes/proyectos");
const desarrolladora = require("./routes/desarrolladora");
const unidades = require("./routes/unidades");

//Initializations
const app = express();
require("./database");

//Settings
app.set("port", env.PORT || 3000);

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.use("/proyectos", proyectos);
app.use("/desarrolladora", desarrolladora);
app.use("/unidades", unidades);

//Server is listenning
app.listen(app.get("port"), () => {
  console.log("Server on port ", app.get("port"));
});

module.exports = app;

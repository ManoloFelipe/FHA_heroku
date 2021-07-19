"use strict";

const express = require("express");
const proyectoController = require("../controllers/proyecto");
const api = express.Router();

// Files
let upload = require("../configs/multer.config.js");

//Routes
api.get("/get_all/page_:page/limit_:limit", proyectoController.getAll);
api.get("/get_:id", proyectoController.getAllInfo);
api.post("/add",  upload.fields([
   { name: "logo", maxCount: 1 },
   { name: "fotos", maxCount: 1 },
 ]), proyectoController.add);
api.put("/update_:id", upload.single("file"), proyectoController.updateWLogo);
api.put("/filter", proyectoController.Filter);
api.delete("/remove_:id", proyectoController.removeId);

module.exports = api;

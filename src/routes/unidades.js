"use strict";

const express = require("express");
const uniController = require("../controllers/unidad");
const api = express.Router();

// Files
let upload = require("../configs/multer.config.js");

//Routes
api.get("/get_all/page_:page/limit_:limit", uniController.getAll);
api.get("/get_:id", uniController.getId);
api.post("/add",  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "fotos", maxCount: 4 },
  ]), uniController.add);
api.put("/update_:id", uniController.update);
api.delete("/remove_:id", uniController.removeId);

module.exports = api;

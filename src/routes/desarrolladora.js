"use strict";

const express = require("express");
const desController = require("../controllers/desarrolladora");
const api = express.Router();

// Files
let upload = require("../configs/multer.config.js");

//Routes
api.get("/get_all/page_:page/limit_:limit", desController.getAll);
api.get("/get_:id", desController.getId);
api.post("/add", upload.single("logo"), desController.add);
api.put("/update_:id", upload.single("logo"), desController.update);
api.delete("/remove_:id", desController.removeId);

module.exports = api;

"use strict";

const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

var DesarrolladorasSchema = Schema(
  {
    nombre:     String,
    logo:       { type: String, default: "logo_default.jpg" },
    telefono:   { type: String, default: "" },
    direccion:  { type: String, default: "" },
    whatsapp:   { type: String, default: "" },
    correo:     { type: String, default: "" },
    twitter:    { type: String, default: "" },
    facebook:   { type: String, default: "" },
    website:    { type: String, default: "" },
  },
  {
    versionKey: false,
  }
);

DesarrolladorasSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Desarrolladoras", DesarrolladorasSchema);

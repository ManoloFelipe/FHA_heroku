"use strict";

const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

var ProyectosSchema = Schema(
  {
    nombre:         String,
    unidad:         { type: Schema.ObjectId, ref: "Unidades", require: false },
    url:            { type: String, default: "" },
    web:            { type: String, default: "" },
    foto_principal: { type: String, default: "" },
    logo:           { type: String, default: "" },
    desarrolladora: { type: Schema.ObjectId, ref: "Desarrolladoras", require: false },
    telefono:       { type: String, default: "" },
    email:          { type: String, default: "" },
    whatsapp:       { type: String, default: "" },
    cuota:          { type: Number, default: 0.0 },
    construccion:   { type: String, default: 1 },
    direccion:      { type: String, default: "" },
    zona:           { type: Number, default: 1 },
    depto:          { type: String, default: "Guatemala" },
    municipio:      { type: String, default: "Guatemala" },
  },
  {
    versionKey: false,
  }
);

ProyectosSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Proyectos", ProyectosSchema);

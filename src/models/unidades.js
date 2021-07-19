"use strict";

const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

var FotosSchema = Schema(
  {
    url: String,
  },
  { _id: false }
);

var UnidadesSchema = Schema(
  {
    logo:           { type: String, default: "" },
    // proyecto:    { type: Schema.ObjectId, ref: "Proyecto" },  //proyecto llamara a unidades
    descripcion:    { type: String, default: "" },
    enganche:       { type: Number, default: 0.0 },
    habitaciones:   { type: String, default: "1" },
    sanitarios:     { type: String, default: "1" },
    parqueos:       { type: String, default: "1" },
    modelos:        { type: String, default: "" },
    extra:          { type: String, default: "" },
    fotos:          [ String ],
    video:          { type: String, default: "" },
    mts_terreno:    { type: String, default: 0.0 },
    mts_unidad_min: { type: String, default: 0.0 },
  },
  {
    versionKey: false,
  }
);

UnidadesSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Unidades", UnidadesSchema);

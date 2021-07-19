"use strict";

const Unidad = require("../models/unidades");
const sizeOf = require("image-size");
const { createWriteStream } = require("fs");
const defaultBucket = require("../configs/cloudStorage.config");
const env = process.env;

// CRUD

function getAll(req, res) {
  const options = {
    page: req.params.page,
    limit: req.params.limit,
  };

  Unidad.paginate({}, options, (err, find) => {
    if (err) return res.status(500).send("error inesperado");
    else if (find) return res.status(200).send(find);
    else return res.status(404).send("sin datos");
  });
}

async function add(req, res) {
  var logo = req.files.logo ? req.files.logo[0] : false;
  var fotos = req.files.fotos ? req.files.fotos : [];
  var video = req.files.video ? req.files.video[0] : false;
  const data = req.body;
  var uni = new Unidad();

  uni.descripcion = data.descripcion || "";
  uni.enganche = data.enganche || 0.0;
  uni.habitaciones = data.habitaciones || "1";
  uni.sanitarios = data.sanitarios || "1";
  uni.parqueos = data.parqueos || "1";
  uni.modelos = data.modelos || "";
  uni.extra = data.extra || "";
  uni.fotos = [];
  uni.mts_terreno = data.mts_terreno || 1;
  uni.mts_unidad_min = data.mts_unidad_min || 1;

  if (fotos.length === 0 && logo === false && video === false) {
    uni.save((err, stored) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error inesperado");
      } else if (stored) {
        return res.status(200).send("Unidad agregada exitosamente, sin fotos o video");
      } else {
        return res.status(404).send("Error al guardar la Unidad");
      }
    });
  } else {
    uni.save((err, stored) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error inesperado");
      } else if (!stored) {
        return res.status(404).send("Error al guardar la Unidad");
      }

      let myId = stored._id;

      for (let i = 0; i < fotos.length + 2; i++) {
        if (i === 0) {
          if(!logo || sizeOf(logo.buffer).type != "jpg") continue;
        } else if (i === 1) {
          if(!video || video.mimetype != "video/mp4") continue;
        } else {
          if(fotos.length === 0) return res.status(200).send("Unidad agregada correctamente");
          if (
            fotos.length + 1 > i > 0 &&
            sizeOf(fotos[i-2].buffer).type != "jpg"
          ) {
            continue;
          } else if (
            fotos.length === i &&
            sizeOf(fotos[i-2].buffer).type != "jpg"
          ) {
            return res.status(200).send("Unidad agregada correctamente");
          }
        }

        if (i == 0) var blob = defaultBucket.file(logo.originalname);
        else if (i == 1) var blob = defaultBucket.file(video.originalname);
        else var blob = defaultBucket.file(fotos[i - 2].originalname);

        var blobStream = blob.createWriteStream();

        blobStream.on("error", (err) => {
          console.log(err.message);
          return res.status(500).send("error inesperado");
        });

        if (i === 0) {
          Unidad.findByIdAndUpdate(myId, { $set: {logo: env.GC_PUBLIC_URL + blob.name, }, }, {},(err) => { 
            if (err) {
              console.log(err);
            }
          }
          );
        } else if (i === 1) {
          Unidad.findByIdAndUpdate(myId, { $set: { video: env.GC_PUBLIC_URL + blob.name }, }, {},(err) => { 
            if (err) {
              console.log(err);
            }
          }
          );
        } else {
          Unidad.findByIdAndUpdate(myId, { $push: { fotos: env.GC_PUBLIC_URL + blob.name }, }, {}, (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }

        blobStream.on("finish", () => {
          if (i === fotos.length){
            return res.status(200).send("Unidad agregada correctamente");
          }
        });

        if (i === 0) {
          blobStream.end(logo.buffer);
        } else if (i === 1) {
          blobStream.end(video.buffer);
        } else {
          blobStream.end(fotos[i - 2].buffer);
        }
      }
    });
  }
}

function update(req, res) {
  var params = req.body;

  Unidad.findByIdAndUpdate(req.params.id, params, {}, (err, act) => {
    if (err) return res.status(500).send("error inesperado");
    else if (act) return res.status(200).send(act);
    else return res.status(404).send("error al actualizar la desarrolladora");
  });
}

function removeId(req, res) {
  Unidad.findByIdAndDelete(req.params.id, (err, deleted) => {
    if (err) return res.status(500).send("error inesperado");
    else if (deleted) return res.status(200).send("desarrolladora eliminada");
    else return res.status(404).send("no existe la desarrolladora");
  });
}

// FILTROS

function getId(req, res) {
  Unidad.findById(req.params.id, (err, find) => {
    if (err) return res.status(500).send('error inesperado');
    else if(!find) return res.status(404).send('registro no encontrado.')
    return res.status(200).send(find)
  })
}

module.exports = {
  add,
  getAll,
  update,
  removeId,
  getId
};

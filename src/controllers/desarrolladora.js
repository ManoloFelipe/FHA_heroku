"use strict";

const Desarrolladora = require("../models/desarrolladora");
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

  Desarrolladora.paginate({}, options, (err, find) => {
    if (err) return res.status(500).send("error inesperado");
    else if (find) return res.status(200).send(find);
    else return res.status(404).send("sin datos");
  });
}

function add(req, res) {
  var file = req.file;
  const data = req.body;
  var des = new Desarrolladora();
  var blob = defaultBucket.file(file.originalname);
  var blobStream = blob.createWriteStream();

  des.nombre = data.nombre;
  des.telefono = data.telefono || "00000000";
  des.direccion = data.direccion || "Guatemala";
  des.whatsapp = data.whatsapp || "00000000";
  des.correo = data.correo || "";
  des.twitter = data.twitter || "";
  des.facebook = data.facebook || "";
  des.website = data.website || "";

  if (!file || sizeOf(file.buffer).type != 'jpg')
    des.save((err, stored) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error inesperado");
      } else if (stored) return res.status(200).send("desarrolladora agregada exitosamente sin logo");
      else return res.status(404).send("Error al guardar la desarrolladora");
    });
  else {
    blobStream.on("error", (err) => {
      console.log(err.message);
      return res.status(500).send("error inesperado");
    });

    blobStream.on("finish", async () => {
      des.logo = env.GC_PUBLIC_URL + blob.name;

      await des.save((err, stored) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error inesperado");
        } else if (stored)
          return res.status(200).send("desarrolladora agregada exitosamente");
        else return res.status(404).send("Error al guardar la desarrolladora");
      });
    });

    blobStream.end(req.file.buffer);
  }
}

function update(req, res) {
  var params = req.body;
  const file = req.file;


  if (!file || sizeOf(file.buffer).type != 'jpg') {
    Poyecto.findByIdAndUpdate(
      req.params.id,
      params,
      { new: true },
      (err, update) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error inesperado");
        } else if (update)
          return res
            .status(200)
            .send(update);
        else
          return res.status(404).send("Error al guardar la desarrolladora");
      }
    );
  } else {
    var blob = defaultBucket.file(file.originalname);
    var blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      console.log(err.message);
      return res.status(500).send("error inesperado");
    });

    blobStream.on("finish", async () => {
      params.logo = env.GC_PUBLIC_URL + blob.name;

      await Desarrolladora.findByIdAndUpdate(
        req.params.id,
        params,
        { new: true },
        (err, update) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error inesperado");
          } else if (update) return res.status(200).send(update);
          else
            return res.status(404).send("Error al guardar la desarrolladora");
        }
      );
    });

    blobStream.end(req.file.buffer);
  }
  
}

function removeId(req, res) {
  Desarrolladora.findByIdAndDelete(req.params.id, (err, deleted) => {
    if (err) return res.status(500).send("error inesperado");
    else if (deleted) return res.status(200).send("desarrolladora eliminada");
    else return res.status(404).send("no existe la desarrolladora");
  });
}

// FILTROS
function getId(req, res) {
  Desarrolladora.findById(req.params.id, (err, find) => {
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
  getId,
};

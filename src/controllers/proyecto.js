"use strict";

const Proyecto = require("../models/proyecto");
const sizeOf = require("image-size");
const { createWriteStream } = require("fs");
const defaultBucket = require("../configs/cloudStorage.config");
const env = process.env;

function home(req, res) {
  return res.status(200).send("Hi!");
}

// CRUD

function getAll(req, res) {
  const options = {
    page: req.params.page,
    limit: req.params.limit,
  };

  Proyecto.paginate({}, options, (err, find) => {
    if (err) return res.status(500).send("error inesperado");
    else if (find) return res.status(200).send(find);
    else return res.status(404).send("sin datos");
  });
}

async function add(req, res) {
  var logo = req.files.logo ? req.files.logo[0] : false;
  var fotos = req.files.fotos || [];
  const data = req.body;
  var proyecto = new Proyecto();

  proyecto.nombre = data.nombre;
  proyecto.url = data.url || `/${data.nombre}`;
  proyecto.web = data.web || '';
  proyecto.telefono = data.telefono || '';
  proyecto.email = data.email || '';
  proyecto.whatsapp = data.whatsapp || '';
  proyecto.cuota = data.cuota || 0.00;
  proyecto.construccion = data.construccion || 1;
  proyecto.direccion = data.direccion || '';
  proyecto.zona = data.zona || 1;
  proyecto.depto = data.depto || 'Guatemala';
  proyecto.municipio = data.municipio || 'Guatemala';

  if (logo === false && fotos.length === 0) {
    proyecto.save((err, stored) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error inesperado");
      } else if (stored) {
        return res.status(200).send("Proyecto agregada exitosamente");
      } else {
        return res.status(404).send("Error al guardar el proyecto");
      }
    });
  } else {
    await proyecto.save(async (err, stored) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error inesperado");
      } else if (!stored) {
        return res.status(404).send("Error al guardar la Unidad");
      }

      let myId = stored._id;

      for (let i = 0; i < fotos.length + 1; i++) {
        if (i === 0) {
          if (!logo || sizeOf(logo.buffer).type != "jpg") continue;
        } else if (fotos.length == i && fotos.length != 0) {
          if (sizeOf(fotos[i - 1].buffer).type != "jpg") return res.status(200).send("Unidad agregada correctamente");
        }

        if (i === 0) var blob = defaultBucket.file(logo.originalname);
        else var blob = defaultBucket.file(fotos[i - 1].originalname);

        var blobStream = blob.createWriteStream();

        blobStream.on("error", (err) => {
          console.log(err.message);
          return res.status(500).send("error inesperado");
        });

        if (i === 0) {
          await Proyecto.findByIdAndUpdate(myId, { $set: { logo: env.GC_PUBLIC_URL + blob.name }, }, { new: true },(err) => { 
            if (err) {
              console.log(err);
            }
          }
          );
        } else {
          await Proyecto.findByIdAndUpdate(myId, { $set: { foto_principal: env.GC_PUBLIC_URL + blob.name }, }, { new: true }, (err) => {
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
        }
        else {
          blobStream.end(fotos[i - 1].buffer);
        }
      }
    });
  }
}

function updateWLogo(req, res) {
  var params = req.body;
  const file = req.file;

  if(file && sizeOf(file).type == 'jpg'){
    var blob = defaultBucket.file(file.originalname);
    var blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      console.log(err.message);
      return res.status(500).send("error inesperado");
    });

    blobStream.on("finish", async () => {
      params.foto_principal = env.GC_PUBLIC_URL + blob.name;

      Proyecto.findByIdAndUpdate(
        req.params.id,
        params,
        {},
        (err, update) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error inesperado");
          } else if (update) return res.status(200).send(update);
          else return res.status(404).send("Error al guardar el proyecto");
        }
      );
    });

    blobStream.end(req.file.buffer);
  }else{
    Proyecto.findByIdAndUpdate(
      req.params.id,
      params,
      {},
      (err, update) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error inesperado");
        } else if (update) return res.status(200).send(update);
        else return res.status(404).send("Error al guardar el proyecto");
      }
    );
  }
}

function removeId(req, res) {
  Proyecto.findByIdAndDelete(req.params.id, (err, deleted) => {
    if (err) return res.status(500).send("error inesperado");
    else if (deleted) return res.status(200).send("proyecto eliminado");
    else return res.status(404).send("no existe el proyecto");
  });
}

// FILTROS

function Filter(req, res) {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
  };
  
  var depto = req.body.depto || "";
  var muni = req.body.muni || "";
  var zona = req.body.zona || 0;

  let findOptions = {
    depto:      { $regex : `.*${depto}.*`},
    municipio:  { $regex : `.*${muni}.*`}
  }

  if(zona != 0) {
    findOptions.zona = zona;
  }

  Proyecto.paginate(findOptions, options, (err, find) => {
    if (err) return res.status(500).send("error inesperado");
    else if (find) return res.status(200).send(find);
    else return res.status(404).send("sin datos");
  });
}

function getAllInfo(req, res) {
  Proyecto.findById(req.params.id).populate('desarrolladora').populate('unidad').exec((err, find) => {
    if (err) {console.log(err);;return res.status(500).send("error inesperado");}
    else if (find) return res.status(200).send(find);
    else return res.status(404).send("sin datos");
  });
}

module.exports = {
  home,
  add,
  getAll,
  updateWLogo,
  removeId,
  Filter,
  getAllInfo
};

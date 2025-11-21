const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const multer = require("multer");
const fs = require("fs");

const dbSettings = require("./dbsettings");

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3001, () => {
  console.log("El servidor esta chambeando correctamente.");
});

const dbConn = mysql2.createConnection(dbSettings);

const filter = (req, file, cb) => {
  const formats = ["image/png", "image/jpg", "image/jpeg"];
  if (formats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(new Error("Archivo no aceptado"));
  }
};

const espacio = multer.memoryStorage();
const archivo = multer({
  storage: espacio,
  fileFilter: filter,
});

function validateCampos(categoria, etiqueta, titulo, contenido, municipio) {
  let errores = false;

  if (categoria === null || categoria === undefined || categoria === "") {
    errores = true;
  }

  if (etiqueta === null || etiqueta === undefined || etiqueta.trim() === "") {
    errores = true;
  }

  if (etiqueta.length >= 50) {
    errores = true;
  }

  if (titulo.length >= 255) {
    errores = true;
  }

  if (titulo === null || titulo === undefined || titulo.trim() === "") {
    errores = true;
  }

  if (
    contenido === null ||
    contenido === undefined ||
    contenido.trim() === ""
  ) {
    errores = true;
  }

  if (municipio === null || municipio === undefined || municipio === "") {
    errores = true;
  }

  return errores;
}

function validteCredentialsEditProfile(email, password) {
  var errors = false;

  const regesEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (!regesEmail.test(email)) {
    errors = true;
  }
  if (!regexPassword.test(password)) {
    errors = true;
  }

  return errors;
}

function validteCredentialsRegister(usuario, email, password) {
  var errors = false;

  const regexUser = /^[a-z0-9]{8,}$/;
  const regesEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (!usuario.trim() || !email.trim() || !password.trim()) {
    errors = true;
  }
  if (!regexUser.test(usuario)) {
    errors = true;
  }
  if (!regesEmail.test(email)) {
    errors = true;
  }
  if (!regexPassword.test(password)) {
    errors = true;
  }

  return errors;
}

function validateCredentialsLogin(usuario, password) {
  if (usuario.length === 0 || password.length === 0) {
    return true;
  } else return false;
}

function ErrorLog(error) {
  const msgError = `ERROR: ${
    error.message
  } \nFecha: ${new Date().toISOString()}\n\n `;

  fs.appendFile('errors.txt',msgError, (err)=>{
    if(err){
      console.error("Error al crear archivo log " + err);
    }
  })
}

app.post("/register-point", (req, resp) => {
  const { name, email, passW } = req.body;

  if (validteCredentialsRegister(name, email, passW)) {
    resp.json({
      msg: "CREDENCIALES MALAS",
    });

    return;
  }

  dbConn.query(
    "CALL sp_Usuario(1,?,?,?)",
    [name, email, passW],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          resp.json({
            msg: "Ya existe",
          });
        } else {
          resp.json({
            msg: "Chale no se pudo",
          });
          ErrorLog(err);
        }
        console.log(err);
      } else {
        resp.json({
          msg: "Bienvenido al culto",
        });
        console.log(result);
      }
    }
  );
});

app.get("/get-top-municipios", (req, resp) => {
  dbConn.query(
    "SELECT * FROM Vista_TopMunicipiosPublicaciones",
    (err, result) => {
      if (err) {
        resp.json({ msg: "Error DB" });
        ErrorLog(err);
      } else if (result.length > 0) {
        resp.json(result);
      } else {
        resp.json([]);
      }
    }
  );
});

app.get("/userPublis-point/:user", (req, resp) => {
  dbConn.query(
    "SELECT * FROM VW_Publicacion WHERE Autor=? ORDER BY FechaCreacion DESC",
    req.params.user,
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        console.log(err);
        ErrorLog(err);
      } else if (result.length > 0) {
        resp.json(result);
        //console.log(result);
      } else {
        resp.json({
          msg: "Vacio",
        });
      }
    }
  );
});

app.get("/userPublis-calificadas/:user", (req, resp) => {
  dbConn.query(
    "SELECT Publicacion_id,Autor,Foto, Titulo, TextoPubli, Imagen, ImageExt, Municipio, Estado ,Categoria, Calificacion, Etiqueta,FechaCreacion, FechaEdicion FROM Calificacion AS C JOIN VW_Publicacion ON C.PubliCalif = Publicacion_id WHERE AutorCalif=? ORDER BY FechaCalif DESC ",
    req.params.user,
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        console.log(err);
        ErrorLog(err);
      } else if (result.length > 0) {
        resp.json(result);
        //console.log(result);
      } else {
        resp.json({
          msg: "Vacio",
        });
      }
    }
  );
});

app.delete("/userData-point/:user", (req, resp) => {
  const name = req.params.user;
  dbConn.query(
    "CALL sp_Usuario(5,?,?,?)",
    [name, null, null],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        console.log(err);
        ErrorLog(err);
      } else {
        resp.json({
          msg: "Eliminado",
        });
        console.log(result);
      }
    }
  );
});

app.get("/userData-point/:user", (req, resp) => {
  const name = req.params.user;
  dbConn.query(
    "CALL sp_Usuario(3,?,?,?)",
    [name, null, null],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        console.log(err);
        ErrorLog(err);
      } else {
        resp.json(result);
        //console.log(result);
      }
    }
  );
});

app.patch("/userData-point", (req, resp) => {
  const { name, email, passW } = req.body;

  if (validteCredentialsEditProfile(email, passW)) {
    resp.json({
      msg: "CREDENCIALES MALAS",
    });

    return;
  }

  dbConn.query(
    "CALL sp_Usuario(4,?,?,?)",
    [name, email, passW],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        //console.log(err);
        ErrorLog(err);
      } else {
        //console.log(result);
        resp.json({
          msg: "Usuario Editado",
        });
      }
    }
  );
});

app.get("/publis-point", (req, resp) => {
  dbConn.query(
    "SELECT * FROM VW_Publicacion ORDER BY FechaCreacion DESC ",
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        console.log(err);
      } else if (result.length > 0) {
        resp.json(result);
        //console.log(result);
        ErrorLog(err);
      } else {
        resp.json({
          msg: "Vacio",
        });
      }
    }
  );
});

app.get("/publis-category-trend/:categoria", (req, resp) => {
  const categoria = req.params.categoria;
  dbConn.query("CALL SP_Subforos(1, ?)", [categoria], (err, result) => {
    if (err) {
      resp.json({
        msg: "Error BD",
      });
      ErrorLog(err);
      //console.log(err);
    } else if (result.length > 0) {
      resp.json(result[0]);
      //console.log(result[0]);
    } else {
      resp.json({
        msg: "Vacio",
      });
    }
  });
});

app.get("/publis-category/:categoria", (req, resp) => {
  const categoria = req.params.categoria;

  dbConn.query(
    "SELECT * FROM VW_Publicacion WHERE Categoria = (?) ORDER BY FechaCreacion DESC",
    [categoria],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        ErrorLog(err);
        console.log(err);
      } else if (result.length > 0) {
        resp.json(result);
        //console.log(result);
      } else {
        resp.json({
          msg: "Vacio",
        });
      }
    }
  );
});

app.post("/login-point", (req, resp) => {
  const { name, passW } = req.body;

  if (validateCredentialsLogin(name, passW)) {
    resp.json({
      msg: "CREDENCIALES MALAS",
    });

    return;
  }
  dbConn.query(
    "CALL sp_Usuario(2,?,?,?)",
    [name, null, passW],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ERROR",
        });
        console.log(err);
        ErrorLog(err);
      } else {
        if (result[0].length > 0) {
          resp.json({
            msg: "LOGIN EXITOSO",
            user: result[0][0].NombreUsu,
            foto: result[0][0].Foto,
          });
          //console.log(result[0][0]);
        } else {
          resp.json({
            msg: "NO ENCONTRADO",
          });
          //console.log(result);
        }
      }
    }
  );
});

app.get("/get-categories", (req, resp) => {
  dbConn.query("SELECT * FROM Categoria", (err, result) => {
    if (err) {
      resp.json({ msg: "Error DB" });
      ErrorLog(err);
    } else if (result.length > 0) {
      resp.json(result);
      //console.log(result);
    } else {
      resp.json([]);
    }
  });
});

app.get("/get-estados", (req, resp) => {
  dbConn.query("SELECT * FROM Estado", (err, result) => {
    if (err) {
      resp.json({ msg: "Error DB" });
      ErrorLog(err);
    } else if (result.length > 0) {
      resp.json(result);
      //console.log(result);
    } else {
      resp.json([]); // por si la tabla está vacía
    }
  });
});

app.get("/get-municipios/:idEstado", (req, resp) => {
  const estado = req.params.idEstado;

  dbConn.query(
    "SELECT Municipio_id, NombreM FROM Municipio WHERE Estado = ?",
    [estado],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ErrorDB",
        });
        ErrorLog(err);
      } else {
        resp.json(result);
      }
    }
  );
});

app.post("/new-post", archivo.single("imagen"), (req, resp) => {
  const { categoria, etiqueta, titulo, contenido, municipio, autor } = req.body;
  const imagen = req.file ? req.file.buffer.toString("base64") : null;

  if (validateCampos(categoria, etiqueta, titulo, contenido, municipio)) {
    resp.json({
      msg: "CREDENCIALES MALAS",
    });

    return;
  }

  dbConn.query(
    "INSERT INTO Publicacion (Autor, Titulo, TextoPubli, Imagen, Municipio, Categoria, Etiqueta) VALUES (?,?,?,?,?,?,?)",
    [autor, titulo, contenido, imagen, municipio, categoria, etiqueta],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ErrorDB",
        });
        ErrorLog(err);
        console.log(err);
      } else {
        resp.json({
          msg: "Publicado",
        });
      }
    }
  );
});

app.get("/get-one-post/:idPubli", (req, resp) => {
  const idPubli = req.params.idPubli;
  //console.log(idPubli);

  dbConn.query(
    "SELECT * FROM VW_Publicacion WHERE Publicacion_id = (?)",
    [idPubli],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ERROR",
        });
        ErrorLog(err);
        console.log(err);
      } else {
        resp.json(result);
      }
    }
  );
});

app.get("/comentario/:id", (req, resp) => {
  const idPubli = req.params.id;

  dbConn.query(
    "SELECT * FROM VW_Comentario WHERE PubliComent=? ORDER BY fechaComent DESC",
    [idPubli],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error",
        });
        ErrorLog(err);
        console.log(err);
      } else if (result.length > 0) {
        resp.json(result);
      } else {
        resp.json({
          msg: "Vacio",
        });
      }
    }
  );
});

app.post("/comentario", (req, resp) => {
  const { usuario, idPubli, texto } = req.body;
  if (!texto || texto.trim() === "") {
    resp.json({
      msg: "CREDENCIALES MALAS",
    });

    return;
  }

  dbConn.query(
    "INSERT INTO Comentario (TextoComent,AutorComent,PubliComent) VALUES (?,?,?)",
    [texto, usuario, idPubli],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error",
        });
        ErrorLog(err);
        console.log(err);
      } else {
        resp.json({
          msg: "Joe Pino opina",
        });
      }
    }
  );
});

app.patch("/update-fotoPerfil", archivo.single("fotoPerfil"), (req, resp) => {
  const { user } = req.body;
  const fotoPerfil = req.file.buffer.toString("base64");

  dbConn.query(
    "UPDATE Usuario SET Foto = (?) WHERE NombreUsu = (?)",
    [fotoPerfil, user],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ErrorDB",
        });
        ErrorLog(err);
        console.log(err);
      } else {
        resp.json({
          msg: "FotoUpdated",
        });
      }
    }
  );
});

app.post("/ratePost", (req, resp) => {
  const { idPubli, Calificador, Calificacion } = req.body;

  dbConn.query(
    "SELECT Calificacion_id FROM Calificacion WHERE AutorCalif = (?) AND PubliCalif = (?)",
    [Calificador, idPubli],
    (err, result) => {
      if (err) {
        console.log("FALLO LA BD 1");
        console.log(err);
        resp.json({
          msg: "ERRORBD",
        });
        ErrorLog(err);
      } else if (result.length === 0) {
        //SI EL USUARIO NO HA CALIFICADO ESTA PUBLICACION
        dbConn.query(
          "INSERT INTO Calificacion(Calif, AutorCalif, PubliCalif) VALUES (?,?,?)",
          [Calificacion, Calificador, idPubli],
          (err, result) => {
            if (err) {
              console.log("FALLO LA BD 2");
              console.log(err);
              resp.json({
                msg: "ERRORBD",
              });
              ErrorLog(err);
            } else {
              resp.json({
                msg: "CALIF_INSERTED",
              });
            }
          }
        );
      } else if (result.length > 0) {
        //SI EL USUARIO YA HA CALIFICADO
        dbConn.query(
          "UPDATE Calificacion SET Calif = (?) WHERE AutorCalif = (?) AND PubliCalif = (?)",
          [Calificacion, Calificador, idPubli],
          (err, result) => {
            if (err) {
              console.log("FALLO LA BD 3");
              console.log(err);
              resp.json({
                msg: "ERRORBD",
              });
              ErrorLog(err);
            } else {
              resp.json({
                msg: "CALIF_UPDATED",
              });
            }
          }
        );
      }
    }
  );
});

app.get("/getPromedio/:id", (req, resp) => {
  const usuario = req.params.id;

  dbConn.query(
    "SELECT * FROM VW_PromedioDeUsuario WHERE NombreUsu = (?)",
    [usuario],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ERRORDB",
        });
        ErrorLog(err);
      } else {
        resp.json(result);
      }
    }
  );
});

app.get("/get-one-post-edit/:idPubli", (req, resp) => {
  const idPubli = req.params.idPubli;
  //console.log(idPubli);

  dbConn.query(
    "SELECT * FROM VW_PublicacionEditar WHERE Publicacion_id = (?)",
    [idPubli],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ERROR",
        });
        ErrorLog(err);
        console.log(err);
      } else {
        resp.json(result);
      }
    }
  );
});

app.patch("/updatePost", archivo.single("imagen"), (req, resp) => {
  const { idPubli, categoria, etiqueta, titulo, contenido, municipio } =
    req.body;
  const imagen = req.file ? req.file.buffer.toString("base64") : null;

  if (validateCampos(categoria, etiqueta, titulo, contenido, municipio)) {
    resp.json({
      msg: "CREDENCIALES MALAS",
    });

    return;
  }
  dbConn.query(
    "UPDATE Publicacion SET Categoria = (?), Etiqueta = (?), Titulo = (?), TextoPubli = (?), Municipio = (?), Imagen = CASE WHEN (?) IS NULL OR (?)='' THEN Imagen ELSE (?) END WHERE Publicacion_id = (?)",
    [
      categoria,
      etiqueta,
      titulo,
      contenido,
      municipio,
      imagen,
      imagen,
      imagen,
      idPubli,
    ],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ERRORDB",
        });
        ErrorLog(err);
        console.log(err);
      } else {
        resp.json({
          msg: "UPDATED",
        });
      }
    }
  );
});

app.delete("/deletePost/:idPost", (req, resp) => {
  const id = req.params.idPost;

  dbConn.query(
    "UPDATE Publicacion SET EstadoPubli = 1 WHERE Publicacion_id = (?)",
    [id],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ERRORDB",
        });
        console.log(err);
        ErrorLog(err);
      } else {
        resp.json({
          msg: "DELETED",
        });
      }
    }
  );
});

app.delete("/deleteComment/:idComment", (req, resp) => {
  const id = req.params.idComment;

  dbConn.query(
    "DELETE FROM Comentario WHERE Comentario_id = (?)",
    [id],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ERRORDB",
        });
        ErrorLog(err);
      } else {
        resp.json({
          msg: "DELETED",
        });
      }
    }
  );
});

app.patch("/updateComment", (req, resp) => {
  const { idComentario, nuevoTexto } = req.body;

  dbConn.query(
    "UPDATE Comentario SET TextoComent = (?) WHERE Comentario_id = (?)",
    [nuevoTexto, idComentario],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ERRORDB",
        });
        ErrorLog(err);
      } else {
        resp.json({
          msg: "UPLOADED",
        });
      }
    }
  );
});

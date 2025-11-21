const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const multer = require("multer");

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
      } else {
        resp.json(result);
        //console.log(result);
      }
    }
  );
});

app.patch("/userData-point", (req, resp) => {
  const { name, email, passW } = req.body;

  dbConn.query(
    "CALL sp_Usuario(4,?,?,?)",
    [name, email, passW],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        //console.log(err);
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
    "SELECT * FROM VW_Publicacion ORDER BY FechaCreacion DESC",
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
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

app.get("/publis-category-trend/:categoria", (req, resp) => {
  const categoria = req.params.categoria;
  dbConn.query(
    "CALL SP_Subforos(1, ?)",
    [categoria],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD"
        });
        console.log(err);
      } else if (result.length > 0) {
        resp.json(result[0]);
        console.log(result[0]);
      } else {
        resp.json({
          msg: "Vacio"
        });
      }
    }
  );
});

app.get("/publis-category/:categoria", (req, resp) => {
  const categoria = req.params.categoria;

  dbConn.query(
    "CALL SP_Subforos(2, ?)",
    [categoria],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error BD",
        });
        console.log(err);
      } else if (result.length > 0) {
        resp.json(result[0]);
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
      } else {
        resp.json(result);
      }
    }
  );
});

app.post("/new-post", archivo.single("imagen"), (req, resp) => {
  const { categoria, etiqueta, titulo, contenido, municipio, autor } = req.body;
  const imagen = req.file ? req.file.buffer.toString("base64") : null;

  dbConn.query(
    "INSERT INTO Publicacion (Autor, Titulo, TextoPubli, Imagen, Municipio, Categoria, Etiqueta) VALUES (?,?,?,?,?,?,?)",
    [autor, titulo, contenido, imagen, municipio, categoria, etiqueta],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "ErrorDB",
        });
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

  dbConn.query(
    "INSERT INTO Comentario (TextoComent,AutorComent,PubliComent) VALUES (?,?,?)",
    [texto, usuario, idPubli],
    (err, result) => {
      if (err) {
        resp.json({
          msg: "Error",
        });
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

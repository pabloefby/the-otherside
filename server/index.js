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

app.get("/get-top-municipios",(req, resp) =>{
  dbConn.query("SELECT * FROM Vista_TopMunicipiosPublicaciones", (err, result) => {
    if (err) {
      resp.json({ msg: "Error DB" });
    } else if (result.length > 0) {
      resp.json(result);
    } else {
      resp.json([]);
    }
  });

});

app.get("/userPublis-point/:user", (req, resp) => {
  dbConn.query("SELECT * FROM VW_Publicacion WHERE Autor=? ORDER BY FechaCreacion DESC",
    req.params.user, (err, result) => {
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
  });
});

app.get("/userData-point/:user", (req, resp) => {
  const name = req.params.user; 
  dbConn.query("CALL sp_Usuario(3,?,?,?)",
    [name, null, null], (err, result) => {
    if (err) {
      resp.json({
        msg: "Error BD",
      });
      console.log(err);
    } else{
      resp.json(result);
      //console.log(result);
    } 
  });
});

app.get("/publis-point", (req, resp) => {
  dbConn.query("SELECT * FROM VW_Publicacion ORDER BY FechaCreacion DESC", (err, result) => {
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
  });
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
          });
          console.log(result);
        } else {
          resp.json({
            msg: "NO ENCONTRADO",
          });
          console.log(result);
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
          msg:"ErrorDB"
        })
      } else {
        resp.json(result);
      }
    }
  );
});

app.post("/new-post", archivo.single("imagen"), (req, resp) => {

  const {categoria, etiqueta, titulo, contenido, municipio, autor} = req.body;
  const imagen = req.file ? req.file.buffer.toString("base64") : null;

  console.log({
    categoria,
    etiqueta,
    titulo,
    contenido,
    municipio,
    autor,
    tieneImagen: !!imagen
  });

  dbConn.query("INSERT INTO Publicacion (Autor, Titulo, TextoPubli, Imagen, Municipio, Categoria, Etiqueta) VALUES (?,?,?,?,?,?,?)",
    [autor,titulo,contenido,imagen, municipio,categoria,etiqueta],
    (err, result)=>{
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
  )

});

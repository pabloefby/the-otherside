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

if (dbConn) {
  console.log("DB conectada");
} else {
  console.log("Error de conexion");
}

  function validteCredentialsRegister(usuario, email, password){
    var errors = false;

    const regexUser = /^[a-z0-9]{8,}$/;
    const regesEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if(!usuario.trim() || !email.trim() || !password.trim()){
      errors=true; 
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

app.post("/register-point",
  (req, resp)=>{
    const {name, email, passW}=req.body; 

    if(validteCredentialsRegister(name,email,passW)){

      resp.json({
        msg:"CREDENCIALES MALAS"
      });

      return;
    }

    dbConn.query("CALL sp_Usuario(1,?,?,?)", 
      [name, email, passW], 
      (err, result)=> {
        if(err){
          if(err.code==="ER_DUP_ENTRY"){
             resp.json({
            msg:"Ya existe"
          })
          }else{
             resp.json({
            msg:"Chale no se pudo"
          })
          }
          console.log(err); 
        }else {
          resp.json({
            msg:"Bienvenido al culto"
          })
          console.log(result);
        }
      }
    );
  }
 );

app.post("/login-point",
  (req, resp)=>{
    const {name, passW} = req.body;

    if(validateCredentialsLogin(name, passW)){
            resp.json({
        msg:"CREDENCIALES MALAS"
      });

      return;

    }

    dbConn.query("CALL sp_Usuario(2,?,?,?)",
      [name, null, passW],
      (err, result)=>{  
        if(err){
          resp.json({
            msg:"ERROR"
          })
          console.log(err);
        }else{

          if(result[0].length>0){
            resp.json({ 
              msg:"LOGIN EXITOSO",
              user: result[0][0].NombreUsu
            })
            console.log(result);
          }else{
            resp.json({
              msg:"NO ENCONTRADO"
            })
            console.log(result);
          }
        }
      } 
    );
  }
);

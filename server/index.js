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

app.post("/register-point",
  (req, resp)=>{
    const {name, email, passW}=req.body; 
    
    dbConn.query("CALL sp_Registro(?,?,?)", 
      [name, email, passW], 
      (err, result)=> {
        if(err){
          resp.json({
            msg:"Bienvenido al culto"
          })
          console.log(err); 
        }else {
          resp.json({
            msg:"Chale no se pudo"
          })
          console.log(result); 
        }
      }
    )
    
  }
 )

import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { useState } from "react";
import axios from "axios";

function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contra, setContra] = useState("");
  const [alertText, setAlertText]= useState(""); 
  const [showPass, setShowPass] = useState(false);

  const handleTogglePassword = () => {
    setShowPass(!showPass);
  };

  const EyeIcon = () => <i class="fa-regular fa-eye"></i>;

  const redirect = useNavigate(); 

  const sendInfo = async (e) => {
    e.preventDefault();

    const validationErrors = validteCredentialsRegister(nombre, correo, contra);
    
    if (!validationErrors) {
      return;
    }

    try {
      const respuesta = await axios.post(
        "http://localhost:3001/register-point",
        {
          name: nombre,
          email: correo,
          passW: contra,
        }
      );

      if (respuesta.data.msg === "Bienvenido al culto") {
        redirect("/");
      } else if (respuesta.data.msg === "Chale no se pudo") {
        setAlertText("Error al registrar, vuelve a intentar"); 
        e.target.reset();
      }else if(respuesta.data.msg==="Ya existe"){
        setAlertText("El nombre de usuario ya existe, favor de usar otro"); 
      }else if(respuesta.data.msg==="CREDENCIALES MALAS"){
         setAlertText("Sus credenciales son incorrectas, intentalo nuevamente"); 
      }
    } catch (error) {
      console.log(error);
      setAlertText("Error en la peticion");
    }
  };

  function validteCredentialsRegister(usuario, email, password){

    const regexUser = /^[a-z0-9]{8,}$/;
    const regesEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if(usuario.length===0 || email.length===0 || password.length===0){
      setAlertText("Por favor llena todos los campos");
      return false; 
    }
    if (!regexUser.test(usuario)) {
      setAlertText("El nombre de usuario debe tener al menos 8 caracteres y solo contener letras minúsculas y números.");
      return false; 
    }
    if (!regesEmail.test(email)) {
      setAlertText("El correo electrónico no es válido.");
      return false; 
    }
    if (!regexPassword.test(password)) {
     setAlertText("La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.");
     return false; 
    }

    setAlertText(""); 
    return true; 

  }

  return (
    <div className={styles.register}>
      {/* Elemento de presentación */}
      <div className={styles.register__presentation}>
        <h1 className={styles.register__title}>The Otherside</h1>
      </div>

      {/* Elemento que contiene el formulario */}
      <div className={styles.register__data}>
        <form onSubmit={sendInfo} className={styles.register__form}>
          <Link to="/" className={`btn ${styles["register__button--back"]}`}>
            <i class="fa-solid fa-left-long"></i>
          </Link>
          <h2 className={styles.register__subtitle}>REGISTRAR USUARIO</h2>
          <label className={styles.register__label}>Nombre de usuario</label>
          <input
            className={styles.register__input}
            type="text"
            onChange={(e) => setNombre(e.target.value)}
          />

          <label className={styles.register__label}>Correo electrónico</label>
          <input
            className={styles.register__input}
            type="text"
            onChange={(e) => setCorreo(e.target.value)}
          />
          <div className={styles["register__password-group"]}>
            <label className={styles.register__label}>Contraseña</label>

            <div className={styles["register__input-group"]}>
              <input
                className={styles.register__input}
                type={showPass ? "text " : "password"}
                onChange={(e) => setContra(e.target.value)}
              />
              <button
                type="button"
                className={
                  showPass
                    ? styles["register__pasword-hide"]
                    : styles["register__pasword-show"]
                }
                onClick={handleTogglePassword}
              >
                <EyeIcon />
              </button>
            </div>
          </div>
          <h3 className={styles.register__alert} id="register-alerts" > {alertText} </h3>
          <button type="submit" className={styles.register__button}>
            Registrarse
          </button>
           
        </form>
      </div>
    </div>
  );
}
export default Register;

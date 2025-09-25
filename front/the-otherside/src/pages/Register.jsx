import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { useState } from "react";
import axios from "axios";

function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contra, setContra] = useState("");

  const [showPass, setShowPass] = useState(false);

  const handleTogglePassword = () => {
    setShowPass(!showPass);
  };

  const EyeIcon = () => <i class="fa-regular fa-eye"></i>;

  const redirect = useNavigate();

  const sendInfo = async (e) => {
    e.preventDefault();

    const validationErrors = validteCredentialsRegister(nombre, correo, contra);
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
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
        alert("Registradooo");
        redirect("/");
      } else if (respuesta.data.msg === "Chale no se pudo") {
        alert("Uy no fuiste bienvenido");
        e.target.reset();
      }else if(respuesta.data.msg==="Ya existe"){
        alert("El nombre de usuario ya existe, favor de usar otro");
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion");
    }
  };

  function validteCredentialsRegister(usuario, email, password){
    var errors = [];

    const regexUser = /^[a-z0-9]{8,}$/;
    const regesEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!regexUser.test(usuario)) {
      errors.push("El nombre de usuario debe tener al menos 8 caracteres y solo puede contener letras minúsculas y números.");
    }
    if (!regesEmail.test(email)) {
      errors.push("El correo electrónico no es válido.");
    }
    if (!regexPassword.test(password)) {
      errors.push("La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.");
    }

    return errors;

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
            type="email"
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
          <button type="submit" className={styles.register__button}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
export default Register;

import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [nomusuario, setNomusuario] = useState("");
  const [contra, setContra] = useState("");
  const [alertText, setAlertText] = useState("");

  const redirect = useNavigate();
  localStorage.removeItem("user");
  const loginUser = async (e) => {
    e.preventDefault();

    if (!validateCredentialsLogin(nomusuario, contra)) {
      setAlertText("Por favor llena todos los campos");
      return;
    }

    try {
      const respuesta = await axios.post("http://localhost:3001/login-point", {
        name: nomusuario,
        passW: contra,
      });

      if (respuesta.data.msg === "LOGIN EXITOSO") {
        localStorage.setItem("user", respuesta.data.user);
        redirect("/Home");
      } else if (respuesta.data.msg === "NO ENCONTRADO") {
        setAlertText("Usuario o contraseña incorrecta"); // No encontrado
        e.target.reset();
      } else if (respuesta.data.msg === "ERROR") {
        setAlertText("Error en el servidor"); // Error en el servidor
        e.target.reset();
      } else if (respuesta.data.msg === "CREDENCIALES MALAS") {
        setAlertText("Por favor llena todos los campos");
      }
    } catch (error) {
      console.log(error);
      setAlertText("Error en la peticion");
    }
  };

  function validateCredentialsLogin(usuario, password) {
    if (usuario.length === 0 || password.length === 0) {
      return false;
    } else return true;
  }

  return (
    <div className={styles.body}>
      <div className={styles.login}>
        {/* Elemento de presentación */}
        <div className={styles.login__presentation}>
          <h1 className={styles.login__title}>The Otherside</h1>
        </div>

        {/* Elemento que contiene el formulario */}
        <div className={styles.login__data}>
          <form className={styles.login__form} onSubmit={loginUser}>
            <h2 className={styles.login__subtitle}>INICIAR SESION</h2>
            <h3 className={styles.login__alert}> {alertText} </h3>
            <label className={styles.login__label__nombre}>
              Nombre de usuario
            </label>
            <input
              className={styles.login__input}
              type="text"
              onChange={(e) => {
                setNomusuario(e.target.value);
              }}
            />

            <label className={styles.login__label}>Contraseña</label>
            <input
              className={styles.login__input}
              type="password"
              onChange={(e) => {
                setContra(e.target.value);
              }}
            />

            <Link to="Register" className={styles.login__register}>
              ¿Aun no formas parte del culto? inicia el ritual
            </Link>
            <button type="submit" className={styles.login__button}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

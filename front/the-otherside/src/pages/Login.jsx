import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

import { useState } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";

function Login() {
  const [nomusuario, setNomusuario] = useState("");
  const [contra, setContra] = useState("");

  const redirect = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await axios.post("http://localhost:3001/login-point", {
        name: nomusuario,
        passW: contra,
      });

      if (respuesta.data.msg === "LOGIN EXITOSO") {
        alert("Bienvenido al culto"); // Loggeo exitoso
        localStorage.setItem("user", respuesta.data.user);
        redirect("/Home");
      } else if (respuesta.data.msg === "NO ENCONTRADO") {
        alert("Usuario o contraseña incorrecta"); // No encontrado
        e.target.reset();
      } else if (respuesta.data.msg === "ERROR") {
        alert("Error en el servidor"); // Error en el servidor
        e.target.reset();
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion");
    }
  };
  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.login}>
        {/* Elemento de presentación */}
        <div className={styles.login__presentation}>
          <h1 className={styles.login__title}>The Otherside</h1>
        </div>

        {/* Elemento que contiene el formulario */}
        <div className={styles.login__data}>
          <form className={styles.login__form} onSubmit={loginUser}>
            <h2 className={styles.login__subtitle}>INICIAR SESION</h2>
            <label className={styles.login__label}>Nombre de usuario</label>
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

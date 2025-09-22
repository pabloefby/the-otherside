import { Link } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  return (
    <div className={styles.login}>
      {/* Elemento de presentación */}
      <div className={styles.login__presentation}>
        <h1 className={styles.login__title}>The Otherside</h1>
      </div>

      {/* Elemento que contiene el formulario */}
      <div className={styles.login__data}>
        <form className={styles.login__form}>
          <h2 className={styles.login__subtitle}>INICIAR SESION</h2>
          <label className={styles.login__label}>Nombre de usuario</label>
          <input className={styles.login__input} type="text" />
          <label className={styles.login__label}>Contraseña</label>
          <input className={styles.login__input} type="password" />
          <Link to="Register" className={styles.login__register}>
            ¿Aun no formas parte del culto? inicia el ritual
          </Link>
          <button type="submit" className={styles.login__button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

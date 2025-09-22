import { Link } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
  return (
    <div className={styles.register}>
      {/* Elemento de presentación */}
      <div className={styles.register__presentation}>
        <h1 className={styles.register__title}>The Otherside</h1>
      </div>

      {/* Elemento que contiene el formulario */}
      <div className={styles.register__data}>
        <form className={styles.register__form}>
          <Link to="/" className={`btn ${styles["register__button--back"]}`}>
            <i class="fa-solid fa-left-long"></i>
          </Link>
          <h2 className={styles.register__subtitle}>REGISTRAR USUARIO</h2>
          <label className={styles.register__label}>Nombre de usuario</label>
          <input className={styles.register__input} type="text" />

          <label className={styles.register__label}>Correo electrónico</label>
          <input className={styles.register__input} type="email" />

          <label className={styles.register__label}>Contraseña</label>
          <input className={styles.register__input} type="password" />
          <button type="submit" className={styles.register__button}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
export default Register;

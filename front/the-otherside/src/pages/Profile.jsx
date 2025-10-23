import styles from "./Profile.module.css";
import { Navbar } from "../components/Navbar";
import { PostPreview } from "../components/PostPreview";
import { Navigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";

function Profile() {
  const user = localStorage.getItem("user");

  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.profile}>
        <div className="container">
          <div className={styles.profile__info}>
            <label className="subtitle">Informacion Personal</label>
            <div className={styles.profile__details}>
              <label className={styles.profile_labelNombre}>{user}</label>
              <br></br>
              <label className={styles.profile_label}>Nombre Completo</label>
              <p className={styles.profile_p}> Raul Tadeo Davila Castro</p>
              <label className={styles.profile_label}>Correo Electronico</label>
              <p className={styles.profile_p}>Monterrey</p>
              <label className={styles.profile_label}>Contraseña</label>
              <p className={styles.profile_p}> ******** </p>
            </div>
          </div>
        </div>
            <div className={styles.profile__buttons}>
            <button className={styles.profile__MisPubli_Button}>Mis Publicaciones</button>
            <button className={styles.profile__PubliCalif_Button}>Puiblicaciones que has calificado</button>
            </div>
        <div className="container">
            <div className={styles.profile_btnEditYElim}>
                <button className={styles.profile__edit_Button}>Editar</button>
                <button className={styles.profile__delete_Button}>Eliminar</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

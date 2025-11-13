import styles from "./Profile.module.css";
import { Navbar } from "../components/Navbar";
import { PostPreview } from "../components/PostPreview";
import { Navigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";
import { useEffect, useState } from "react";
import axios from "axios";
import defaultProfile from "../assets/defaultProfile.png";

function Profile() {
  const user = localStorage.getItem("user");
  const [publis, setPublis] = useState([]);
  const [userData, setuserData] = useState({
    Correo: "",
    Pssword: "",
    Foto: "",
  });

  const getUserData = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:3001/userData-point/${user}`
      );
      if (resp.data.msg === "Error BD") {
        alert("Error con la BD");
      } else {
        setuserData(resp.data[0][0]);
        console.log(resp.data);
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al obtener publicaciones del usuario");
    }
  };

  const getPublis = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:3001/userPublis-point/${user}`
      );
      if (resp.data.msg === "Error BD") {
        alert("Error con la BD");
      } else if (resp.data.msg === "Vacio") {
        alert("Aun no has creado publicaciones");
        setPublis([]);
      } else {
        setPublis(resp.data);
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al obtener publicaciones del usuario");
    }
  };

  const skull = <img src={skullIcon} alt="skullIcon" className="skullStyle" />;

  const handleChange = (e) => {
    setuserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getUserData();
    getPublis();
  }, []);

  if (!user) return <Navigate to="/" replace />;
  if (userData) {
    return (
      <div className={styles.body}>
        <Navbar />
        <div className={styles.profile}>
          <div className="containerRow">
            <div className={styles.profile__photo_div}>
              <img src={defaultProfile} alt="" />
            </div>
            <div className={styles.profile__info}>
              <label className="subtitle">Informacion Personal</label>
              <form className={styles.profile__form} action="">
                <div className={styles.profile__details}>
                  <label className={styles.profile_labelNombre}>{user}</label>
                  <label className={styles.profile_label}>
                    Correo Electronico
                  </label>
                  <input
                    type="text"
                    name="Correo"
                    value={userData.Correo}
                    onChange={handleChange}
                  ></input>
                  <label className={styles.profile_label}>Contraseña</label>
                  <input
                    type="text"
                    name="Pssword"
                    value={userData.Pssword}
                    onChange={handleChange}
                  ></input>
                </div>
                            <div className="container">
              <div className={styles.profile_btnEditYElim}>
                <button className={styles.profile__edit_Button}>Editar</button>
                <button className={styles.profile__delete_Button}>
                  Eliminar
                </button>
              </div>
            </div>
              </form>
            </div>

          </div>

          <div className={styles.profile__buttons}>
            <button className={styles.profile__MisPubli_Button}>
              Mis Publicaciones
            </button>
            <button className={styles.profile__PubliCalif_Button}>
              Puiblicaciones que has calificado
            </button>
          </div>

          <div className={styles.profile__userPubli}>
            {publis.map((publi, key) => {
              return (
                <PostPreview
                  key={publi.Publicacion_id}
                  publiData={publi}
                ></PostPreview>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;

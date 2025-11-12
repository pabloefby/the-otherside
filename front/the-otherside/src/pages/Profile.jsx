import styles from "./Profile.module.css";
import { Navbar } from "../components/Navbar";
import { PostPreview } from "../components/PostPreview";
import { Navigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const user = localStorage.getItem("user");
  const [publis, setPublis] = useState([]);
  const [userData, setuserData] = useState(null); 

 const getUserData = async () => {
    try {
      const resp = await axios.get(`http://localhost:3001/userData-point/${user}`);
      if (resp.data.msg === "Error BD") {
        alert("Error con la BD");
      } else {
        setuserData(resp.data);
        console.log(resp.data); 
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al obtener publicaciones del usuario");
    }
  };

 const getPublis = async () => {
    try {
      const resp = await axios.get(`http://localhost:3001/userPublis-point/${user}`);
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

   useEffect(() => {
      getUserData(); 
      getPublis();
    }, []);
  
    if (!user) return <Navigate to="/" replace />;
if(userData){
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
              <p className={styles.profile_p}> {userData.NombreUsu}</p>
              <label className={styles.profile_label}>Correo Electronico</label>
              <p className={styles.profile_p}>{userData.Correo}</p>
              <label className={styles.profile_label}>Contraseña</label>
              <p className={styles.profile_p}> ******** </p>
            </div>
          </div>
          <div className="container">
            <div className={styles.profile_btnEditYElim}>
              <button className={styles.profile__edit_Button}>Editar</button>
              <button className={styles.profile__delete_Button}>
                Eliminar
              </button>
            </div>
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
      <div className="profile__userPubli">
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

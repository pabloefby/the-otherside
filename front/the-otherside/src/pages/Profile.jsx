import styles from "./Profile.module.css";
import { Navbar } from "../components/Navbar";
import { PostPreview } from "../components/PostPreview";
import { Navigate, useNavigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";
import { use, useEffect, useState } from "react";
import axios from "axios";
import defaultProfile from "../assets/defaultProfile.png";

function Profile() {
  const redirect = useNavigate();
  const user = localStorage.getItem("user");
  const [editPerfil, setEditPerfil] = useState(false);
  const [publis, setPublis] = useState([]);
  const [modalBorrar, setModalBorrar] = useState(false);
  const [userData, setuserData] = useState({
    Correo: "",
    Pssword: "",
    Foto: "",
  });

  const eliminarPerfil = async () => {
    try {
      const resp = await axios.delete(
        `http://localhost:3001/userData-point/${user}`
      );
      if (resp.data.msg === "Error BD") {
        alert("Error en la BD en baja logica");
      } else if (resp.data.msg === "Eliminado") {
        alert("Cuenta eliminada exitosamente");
        setModalBorrar(false);
        redirect("/Register");
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al eliminar al usuario");
    }
  };

  const editarPerfil = async () => {
    try {
      if (!editPerfil) {
        setEditPerfil(true);
      } else {
        setEditPerfil(false);
        const resp = await axios.patch("http://localhost:3001/userData-point", {
          name: user,
          email: userData.Correo,
          passW: userData.Pssword,
        });

        if (resp.data.msg === "Error BD") {
          alert("Error en la BD al editar");
        } else if (resp.data.msg === "Usuario Editado") {
          console.log("Usuario editado exitosamente");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al editar el usuario");
    }
  };

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

  const [fotoPerfil, setFotoPerfil] = useState(defaultProfile);

  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFotoPerfil(imageURL);
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
        {modalBorrar && (
          <div id="modal" className={styles.modal}>
            <div className={styles["modal-content"]}>
              <h2>¿Seguro que deseas eliminar tu cuenta?</h2>

              <button
                id="confirmDelete"
                className={styles.btnModal}
                type="button"
                onClick={() => eliminarPerfil()}
              >
                {" "}
                Sí, eliminar{" "}
              </button>

              <button
                id="closeModal"
                className={styles.btnModal}
                type="button"
                onClick={() => setModalBorrar(false)}
              >
                {" "}
                Cancelar{" "}
              </button>
            </div>
          </div>
        )}

        <div className={styles.profile}>
          <div className="containerRow">
            <div className={styles.profile__photo_div}>
              <img src={fotoPerfil} alt="" className={styles.profile__photo} />

              {editPerfil && (
                <>
                  <input
                    type="file"
                    id="fileInputFoto"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFotoChange}
                  />

                  <button
                    type="button"
                    className={styles.profile__changePhotoBtn}
                    onClick={() =>
                      document.getElementById("fileInputFoto").click()
                    }
                  >
                    Cambiar foto
                  </button>
                </>
              )}
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
                    id="correoPerfil"
                    className={`${styles.profile__input} ${
                      editPerfil ? styles.editable : ""
                    }`}
                    name="Correo"
                    disabled={!editPerfil}
                    value={userData.Correo}
                    onChange={handleChange}
                  ></input>
                  <label className={styles.profile_label}>Contraseña</label>
                  <input
                    type="text"
                    id="passwordPerfil"
                    className={`${styles.profile__input} ${
                      editPerfil ? styles.editable : ""
                    }`}
                    name="Pssword"
                    disabled={!editPerfil}
                    value={userData.Pssword}
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="container">
                  <div className={styles.profile_btnEditYElim}>
                    <button
                      type="button"
                      className={styles.profile__edit_Button}
                      onClick={editarPerfil}
                    >
                      {editPerfil ? "Guardar cambios" : "Editar"}
                    </button>
                    <button
                      type="button"
                      className={styles.profile__delete_Button}
                      onClick={() => {
                        setModalBorrar(true);
                      }}
                    >
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

import styles from "./Profile.module.css";
import { Navbar } from "../components/Navbar";
import { PostPreview } from "../components/PostPreview";
import { Navigate, useNavigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";
import { useEffect, useState } from "react";
import axios from "axios";
import defaultProfile from "../assets/defaultProfile.png";
import profileFrame from "../assets/profileFrame.png";
import bbCienpies from "../assets/bbCienpies.png";
import spaceKitty from "../assets/spaceKitty.png";
import ojoTeleCalaca from "../assets/ojoTeleCalaca.png";
import ojoDerretido from "../assets/ojoDerretido.png";
import tentaculo from "../assets/tentaculo.png";

function Profile() {
  const redirect = useNavigate();
  const user = localStorage.getItem("user");
  const [editPerfil, setEditPerfil] = useState(false);
  const [publis, setPublis] = useState([]);
  const [alertText, setAlertText]= useState(""); 
  const [publisCalificadas, setPublisCalificadas] = useState([]);
  const [modalBorrar, setModalBorrar] = useState(false);
  const [publiCalif, setPubliCalif] = useState(false); 
  const [userData, setuserData] = useState({
    Correo: "",
    Pssword: "",
    Foto: "",
  });

  const [userPromedio, setUserPromedio] = useState("");

  const skull = <img src={skullIcon} alt="skullIcon" className="skullStyle" />;

  const [defaultPic, setDefaultPic] = useState(defaultProfile);

    function validteCredentials(email, password){

    const regesEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

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

 const validationErrors = validteCredentials(userData.Correo, userData.Pssword);
    
    if (!validationErrors) {
      setEditPerfil(true); 
      return;
    }

        const resp = await axios.patch("http://localhost:3001/userData-point", {
          name: user,
          email: userData.Correo,
          passW: userData.Pssword,
        });

        if (resp.data.msg === "Error BD") {
          alert("Error en la BD al editar");
        } else if(resp.data.msg==="CREDENCIALES MALAS"){
         setAlertText("Sus credenciales son incorrectas, intentalo nuevamente"); 
      } else if (resp.data.msg === "Usuario Editado") {
          console.log("Usuario editado exitosamente");
          if (fotoPerfil) {
            try {
              await updateFotoPerfil();
            } catch (photoError) {
              console.error(
                "Fallo al actualizar la foto de perfil:",
                photoError
              );
            }
          }
          await getUserData();
          setFotoPerfil(null);
          setDefaultPic(defaultProfile);
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
        //console.log(resp.data);
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al obtener publicaciones del usuario");
    }
  };

  const updateFotoPerfil = async () => {
    const frmData = new FormData();
    frmData.append("user", user);
    frmData.append("fotoPerfil", fotoPerfil);

    if (fotoPerfil) {
      try {
        const base64DataUrl = await readFileAsBase64(fotoPerfil);
        const base64String = base64DataUrl.split(",")[1];
        localStorage.setItem("fotoPerfil", base64String);
      } catch (error) {
        console.error("Error al convertir a Base64:", error);
      }
    }

    try {
      const resp = await axios.patch(
        "http://localhost:3001/update-fotoPerfil",
        frmData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (resp.data.msg === "ErrorDB") {
        alert("Error al actualizar su foto de perfil");
      } else if (resp.data.msg === "FotoUpdated") {
        console.log("Foto actualizada");
        return;
      }
    } catch (error) {
      alert("ERROR con la bd");
    }
  };

  const getPromedioUsuario = async () =>{

    try {
      const resp = await axios.get(`http://localhost:3001/getPromedio/${user}`);

      if(resp.data.msg === "ERRORDB"){
        alert("Ha ocurrido un error en la base de datos");
      }else{
        setUserPromedio(resp.data[0].PromedioPublis);
      }
    } catch (error) {
      console.log(error)
    }

  }

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // reader.result contiene la URL de datos (ej: data:image/png;base64,...)
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
      // Lee el archivo como URL de datos (que incluye la codificación Base64)
      reader.readAsDataURL(file);
    });
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

  const getPublisCalificadas = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:3001/userPublis-calificadas/${user}`
      );
      if (resp.data.msg === "Error BD") {
        alert("Error con la BD");
      } else if (resp.data.msg === "Vacio") {
        //alert("Aun no has calificado publicaciones");
        setPublisCalificadas([]);
      } else {
        setPublisCalificadas(resp.data);
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al obtener publicaciones que el usuario a calificado");
    }
  };

  const [fotoPerfil, setFotoPerfil] = useState(null);

  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (fotoPerfil && defaultPic && defaultPic.startsWith("blob:")) {
        URL.revokeObjectURL(defaultPic);
      }
      setFotoPerfil(file);
      const imageURL = URL.createObjectURL(file);
      setDefaultPic(imageURL);
    }
  };

  const handleChange = (e) => {
    setuserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getUserData();
    getPublis();
    getPublisCalificadas(); 
    getPromedioUsuario();
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
              <img
                src={profileFrame}
                alt="framePerfil"
                className={styles.profile__frame}
              />
              <img
                src={bbCienpies}
                alt="bbCienpies"
                className={styles.bbCienpies}
              />
              <img
                src={spaceKitty}
                alt="spaceKitty"
                className={styles.spaceKitty}
              />
              <img
                src={ojoTeleCalaca}
                alt="ojoTeleCalaca"
                className={styles.ojoTeleCalaca}
              />

              <img
                src={tentaculo}
                alt="tentaculo"
                className={styles.tentaculo}
              />

              <img
                src={
                  editPerfil && fotoPerfil
                    ? defaultPic
                    : userData.Foto
                    ? `data:image/png;base64,${userData.Foto}`
                    : defaultProfile
                }
                alt=""
                className={styles.profile__photo}
              />

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
                    onClick={() => {
                      document.getElementById("fileInputFoto").click();
                    }}
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
                  <h3 className={styles.profile__alert} id="register-alerts" > {alertText} </h3>
                </div>
                
                <div className="container">
                  <div className={styles.profile_btnEditYElim}>
                    <button
                      type="button"
                      className={styles.profile__edit_Button}
                      onClick={() => {
                        editarPerfil();
                      }}
                    >
                      {editPerfil ? "Guardar cambios" : "Editar"}
                    </button>
                    <button
                      type="button"
                      className={styles.profile__delete_Button}
                      onClick={() => setModalBorrar(true)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className={styles.profile__promedio}>
                <h2>Tu promedio de publicaciones:</h2>
                <h2 className={styles.profile__datoPromedio}>{userPromedio ?? "0.0"} {skull}</h2>
          </div>

          <div className={styles.profile__buttons}>
            <button 
            type="button"
            onClick={()=>{setPubliCalif(false)}}
            className={styles.profile__MisPubli_Button}>
              Mis Publicaciones
            </button>
            <button 
            type="button"
            onClick={()=>{setPubliCalif(true)}}
            className={styles.profile__PubliCalif_Button}>
              Publicaciones que has calificado
            </button>
          </div>
          <div className={styles.profile__userPubli}>
             {!publiCalif && (
            publis.map((publi) => (          
                <PostPreview
                  key={publi.Publicacion_id}
                  publiData={publi}
                   origin="Profile"
                ></PostPreview>
            ))
          )}

           {publiCalif && (
            publisCalificadas.map((publiCalificada) => (          
                <PostPreview
                  key={publiCalificada.Publicacion_id}
                  publiData={publiCalificada}
                ></PostPreview>
            ))
          )}
            
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;

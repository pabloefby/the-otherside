import styles from "./PostPreview.module.css";
import defaultProfile from "../assets/defaultProfile.png";
import skullIcon from "../assets/skullIcon.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function PostPreview({ publiData, origin }) {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const skull = (
    <img src={skullIcon} alt="skullIconAlt" className="skullStyle" />
  );

  const calif = Math.floor(publiData.Calificacion);
  const previewText =
    publiData.TextoPubli.length > 360
      ? publiData.TextoPubli.substring(0, 360) + "..."
      : publiData.TextoPubli;

  const fecha = publiData.FechaEdicion
    ? new Date(publiData.FechaEdicion)
    : new Date(publiData.FechaCreacion);

  const fechaLocal = publiData.FechaEdicion
    ? `editado en ${fecha.toLocaleString()}`
    : `creado en ${fecha.toLocaleString()}`;

  const deletePost = async (post) =>{

    try {
      
      const respuesta = await axios.delete(`http://localhost:3001/deletePost/${post}`);

      if(respuesta.data.msg === "ERRORDB"){
        alert("Ocurrio un error en la base de datos");
      }else if( respuesta.data.msg === "DELETED"){
        window.location.reload();
      }

    } catch (error) {
      
    }

  }

  return (
    <div className={styles.postPreview} id={publiData.Publicacion_id}>
      <div className={styles.postPreview__header}>
        <img
          src={
            publiData.Foto
              ? `data:image/png;base64,${publiData.Foto}`
              : defaultProfile
          }
          alt="profileImage"
          className={styles.postPreview__image}
        />
        <label className={styles.postPreview__username}>
          {publiData.Autor}
        </label>
        <label className={styles.postPreview__date}>{fechaLocal}</label>
        <label className={styles.postPreview__category}>
          {publiData.Categoria}
        </label>
      </div>
      <div className={styles.postPreview__body}>
        <h2 className={styles.postPreview__title}>{publiData.Titulo}</h2>
        <label className={styles.postPreview__tag}>{publiData.Etiqueta}</label>
        <p className={styles.postPreview__text}>{previewText}</p>
      </div>
      <div className={styles.postPreview__actions}>
        <div className={styles.postPreview__score}>
          {Array.from({ length: calif }).map((_, i) => (
            <span key={i}>{skull}</span>
          ))}
          {publiData.Calificacion
            ? Number(publiData.Calificacion).toFixed(1)
            : "N/A"}
        </div>
        <button
          onClick={(e) => {
            navigate(`/Post/${publiData.Publicacion_id}`);
          }}
          className={styles.postPreview__read}
        >
          Leer mas...
        </button>
      </div>
      {user == publiData.Autor && origin === "Profile" && (
        <div className={styles.contenedor}>
          <div className={styles.postPreview_btnEditYElim}>
            <button type="button" className={styles.postPreview__edit_Button}
            onClick={(e) =>{
              navigate(`/UpdatePost/${publiData.Publicacion_id}`)
            }}>
              Editar
            </button>
            <button type="button" className={styles.postPreview__delete_Button}
            onClick={()=>{deletePost(publiData.Publicacion_id)}}>
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

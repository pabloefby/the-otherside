import styles from "./PostPreview.module.css";
import defaultProfile from "../assets/defaultProfile.png";
import skullIcon from "../assets/skullIcon.png";


export function PostPreview({publiData}) {

  const skull = (
    <img src={skullIcon} alt="skullIconAlt" className="skullStyle" />
  );

const calif = Math.round(publiData.Calificacion); 
const previewText = publiData.TextoPubli.length>360
? publiData.TextoPubli.substring(0,360) + "..."
: publiData.TextoPubli; 


const fecha = publiData.FechaEdicion
  ? new Date(publiData.FechaEdicion)
  : new Date(publiData.FechaCreacion);

  const fechaLocal = publiData.FechaEdicion
   ? `editado en ${fecha.toLocaleString()}`
   : `creado en ${fecha.toLocaleString()}`; 

  
  return (
    <div className={styles.postPreview} id={publiData.Publicacion_id}>
      <div className={styles.postPreview__header}>
      <img
            src={defaultProfile}
            alt="profileImage"
            className={styles.postPreview__image}
          />
        <label className={styles.postPreview__username}>{publiData.Autor}</label>
        <label className={styles.postPreview__date}>{fechaLocal}</label>
        <label className={styles.postPreview__category}>{publiData.Categoria}</label>
      </div>
      <div className={styles.postPreview__body}>
        <h2 className={styles.postPreview__title}>{publiData.Titulo}</h2>
        <label className={styles.postPreview__tag}>{publiData.Etiqueta}</label>
        <p className={styles.postPreview__text}>{previewText}</p>
      </div>
      <div className={styles.postPreview__actions}>
        <div className={styles.postPreview__score}>
             {Array.from({length: calif}).map((_,i)=>(
              <span key={i}>{skull}</span>
             ))}
        </div>
        <button className={styles.postPreview__read}>Leer mas...</button>
      </div>
    </div>
  );
}

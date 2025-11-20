import defaultProfile from "../assets/defaultProfile.png";
import styles from "./Comentario.module.css"; 
function Comentario({commentData}) {

  const fecha = new Date(commentData.fechaComent); 

  const fechaLocal = `creado en ${fecha.toLocaleString()}`;
    
    return ( 
               <div className={styles.comment}>
                      <div className={styles.comment__header}>
                        <img
                          src={commentData.Foto && commentData.Foto!=="null" && commentData.Foto!=="undefined"  
                            ? `data:image/png;base64,${commentData.Foto}`
                            : defaultProfile}
                          alt="profileImage"
                          className={styles.comment__userimage}
                        />
                        <label className={styles.comment__username}>{commentData.AutorComent}</label>
                        <label className={styles.comment__date}>
                          {fechaLocal}
                        </label>
                      </div>
                      <div className={styles.comment__body}>
                        <p className={styles.comment__text}>
                          {commentData.TextoComent}
                        </p>
                      </div>
                    </div>
    );
}

export default Comentario ;
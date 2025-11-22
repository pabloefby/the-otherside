import defaultProfile from "../assets/defaultProfile.png";
import styles from "./Comentario.module.css";
import axios from "axios";
import { useState } from "react";

function Comentario({ commentData }) {
  const user = localStorage.getItem("user");

  const fecha = new Date(commentData.fechaComent);

  const fechaLocal = `creado en ${fecha.toLocaleString()}`;

  const deleteComment = async (idComment) => {

    try {
      const respuesta = await axios.delete(
        `http://localhost:3001/deleteComment/${idComment}`
      );

      if (respuesta.data.msg === "ERRORDB") {
        alert("Un error ocurrio con la BD");
      } else if (respuesta.data.msg === "DELETED") {
        window.location.reload();
      }
    } catch (error) {
      alert("Ocurrio un error inesperado");
    }
  };

  //MOdificar
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(commentData.TextoComent);

  const toggleEditModal = () => {
    setIsEditing(!isEditing);
  };

  const editComment = async () => {
    if (editText.trim() === "") {
      alert("El comentario no puede estar vacío.");
      return;
    }

    try {
      const respuesta = await axios.patch("http://localhost:3001/updateComment", {
        idComentario: commentData.Comentario_id,
        nuevoTexto: editText,
      });

      if (respuesta.data.msg === "ERRORDB") {
        alert("Ha ocurrido un error en la base de datos");
      } else if (respuesta.data.msg === "UPLOADED") {
        window.location.reload();
      }
    } catch (error) {
      alert("Error al editar el comentario.");
    }
    toggleEditModal();
  };

  return (
    <div className={styles.comment}>
      <div className={styles.comment__header}>
        <img
          src={
            commentData.Foto &&
            commentData.Foto !== "null" &&
            commentData.Foto !== "undefined"
              ? `data:image/png;base64,${commentData.Foto}`
              : defaultProfile
          }
          alt="profileImage"
          className={styles.comment__userimage}
        />
        <label className={styles.comment__username}>
          {commentData.AutorComent}
        </label>
        <label className={styles.comment__date}>{fechaLocal}</label>
      </div>
      <div className={styles.comment__body}>
        <p className={styles.comment__text}>{commentData.TextoComent}</p>
      </div>

      {user === commentData.AutorComent && !isEditing &&(
        <div className={styles.comment__buttons}>
          <button onClick={toggleEditModal}>Modificar</button>
          <button onClick={(e) => deleteComment(commentData.Comentario_id)}>
            Eliminar
          </button>
        </div>
      )}

      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Modificar Comentario</h3>
            <textarea
              className={styles.modalInput}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows="4"
            />
            <div className={styles.modalActions}>
              <button onClick={editComment} className={styles.modalSaveButton}>
                Guardar
              </button>
              <button
                onClick={toggleEditModal}
                className={styles.modalCancelButton}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comentario;

import styles from "./Post.module.css";
import { Navbar } from "../components/Navbar";
import Comentario from "../components/Comentario";
import defaultProfile from "../assets/defaultProfile.png";
import skullIcon from "../assets/skullIcon.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Post() {
  const skull = <img src={skullIcon} alt="skullIcon" className="skullStyle" />;
  const user = localStorage.getItem("user");


  const { id } = useParams();

  const [thisPost, setThisPost] = useState(null);
  const [comentarioS, setComentarioS] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [fechaPost, setFechaPost] = useState("");

  const getComment = async () => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3001/comentario/${id}`
      );
      if (respuesta.data.msg === "Error") {
        alert("Error en la BD al obtener comentarios");
      } else if (respuesta.data.msg === "Vacio") {
        //console.log("no hay comentarios");
        setComentarioS([]);
      } else {
        setComentarioS(respuesta.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if(commentText===null || commentText.trim()===""){
      setCommentText(""); 
      return; 
    }

    try {
      const respuesta = await axios.post("http://localhost:3001/comentario", {
        usuario: user,
        idPubli: id,
        texto: commentText,
      });
      if (respuesta.data.msg === "Error") {
        alert("Error en la BD al subir comentario");
      } else if (respuesta.data.msg === "Joe Pino opina") {
        setCommentText("");
        getComment();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPost = async () => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3001/get-one-post/${id}`
      );

      if (respuesta.data.msg === "ERROR") {
        alert("ERROR EN LA BD");
      } else {
        setThisPost(respuesta.data[0]);
        //console.log(respuesta.data[0]);

        const fecha = respuesta.data[0].FechaEdicion
          ? new Date(respuesta.data[0].FechaEdicion)
          : new Date(respuesta.data[0].FechaCreacion);

        const fechaLocal = respuesta.data[0].FechaEdicion
          ? `editado en ${fecha.toLocaleString()}`
          : `creado en ${fecha.toLocaleString()}`;

        setFechaPost(fechaLocal);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ratePost = async (Rate) => {
    const calificacion = Rate;
    //alert(calificacion);
    try {
      const resp = await axios.post("http://localhost:3001/ratePost", {
        idPubli: id,
        Calificador: user,
        Calificacion: calificacion,
      });

      if (resp.data.msg === "ERRORBD") {
        alert("ERROR EN LA BASE DE DATOS");
      } else if (resp.data.msg === "CALIF_INSERTED") {
        console.log("Calificacion Insertada");
        getPost();
      } else if (resp.data.msg === "CALIF_UPDATED") {
        console.log("Calificacion Actualizada");
        getPost();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPost();
    getComment();
  }, []);

  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.post}>
        <div className="container">
          <div className={styles.post__header}>
            <img
              src={
                thisPost?.Foto
                  ? `data:image/png;base64,${thisPost?.Foto}`
                  : defaultProfile
              }
              alt="profileImage"
              className={styles.post__userimage}
            />
            <label className={styles.post__username}>{thisPost?.Autor}</label>
            <label className={styles.post__date}>{fechaPost}</label>
            <label className={styles.post__category}>
              {thisPost?.Categoria}
            </label>
          </div>
          <div className={styles.post__body}>
            <h2 className={styles.post__title}>{thisPost?.Titulo}</h2>
            <label className={styles.post__tag}>{thisPost?.Etiqueta}</label>
            <p className={styles.post__text}>{thisPost?.TextoPubli}</p>
            {thisPost?.Imagen && (
              <div className={styles.post__image}>
                <img
                  src={"data:image/png;base64," + thisPost?.Imagen}
                  alt="pastelImage"
                  className={styles.post__postImage}
                />
              </div>
            )}
            <div className={styles["post__score"]}>
              <label>Calificación:</label>
              {skull}
              {thisPost?.Calificacion ?? "N/A"}          
            </div>

            <div className={styles["post__rate"]}>
              <label>Calificar:</label>
              <form action="">
                <fieldset
                  className={styles.rating}
                  onChange={(e) => {
                    ratePost(e.target.value);
                  }}
                >
                  <input
                    type="radio"
                    id="skull5"
                    name="calificacion"
                    value="5"
                  />
                  <label htmlFor="skull5" title="¡Absolutamente increíble! 5/5">
                    {skull}
                  </label>

                  <input
                    type="radio"
                    id="skull4"
                    name="calificacion"
                    value="4"
                  />
                  <label htmlFor="skull4" title="Muy bueno, me gustó. 4/5">
                    {skull}
                  </label>

                  <input
                    type="radio"
                    id="skull3"
                    name="calificacion"
                    value="3"
                  />
                  <label htmlFor="skull3" title="Estuvo bien. 3/5">
                    {skull}
                  </label>

                  <input
                    type="radio"
                    id="skull2"
                    name="calificacion"
                    value="2"
                  />
                  <label htmlFor="skull2" title="Podría ser mejor. 2/5">
                    {skull}
                  </label>

                  <input
                    type="radio"
                    id="skull1"
                    name="calificacion"
                    value="1"
                  />
                  <label htmlFor="skull1" title="Malo, no me gustó. 1/5">
                    {skull}{" "}
                  </label>
                </fieldset>
              </form>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.comments}>
            <label className="subtitle">Comentarios</label>
            <div className={styles.newComment}>
              <form className={styles.newComment__form} onSubmit={sendComment}>
                <textarea
                  className={styles.newComment__text}
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                  placeholder={`Escribe un comentario como ${user} ...`}
                ></textarea>
                <button type="submit" className={styles.newComment__button}>
                  Publicar comentario
                </button>
              </form>
            </div>
            {comentarioS.map((comentario) => {
              return (
                <Comentario
                  key={comentario.Comentario_id}
                  commentData={comentario}
                ></Comentario>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;

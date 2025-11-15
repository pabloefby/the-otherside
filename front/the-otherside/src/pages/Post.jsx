import styles from "./Post.module.css";
import { Navbar } from "../components/Navbar";
import defaultProfile from "../assets/defaultProfile.png";
import pastel from "../assets/pastel.jpg";
import skullIcon from "../assets/skullIcon.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Post() {
  const skull = <img src={skullIcon} alt="skullIcon" className="skullStyle" />;
  const user = localStorage.getItem("user");

  const { id } = useParams();

  const [thisPost, setThisPost] = useState(null);


  const getPost = async () => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3001/get-one-post/${id}`
      );

      if (respuesta.data.msg === "ERROR") {
        alert("ERROR EN LA BD");
      } else {
        setThisPost(respuesta.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPost();
  }, []);


  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.post}>
        <div className="container">
          <div className={styles.post__header}>
            <img
              src={defaultProfile}
              alt="profileImage"
              className={styles.post__userimage}
            />
            <label className={styles.post__username}>{thisPost?.Autor}</label>
            <label className={styles.post__date}>
              creado en {thisPost?.FechaCreacion}
            </label>
            <label className={styles.post__category}>{thisPost?.Categoria}</label>
          </div>
          <div className={styles.post__body}>
            <h2 className={styles.post__title}>{thisPost?.Titulo}</h2>
            <label className={styles.post__tag}>{thisPost?.Etiqueta}</label>
            <p className={styles.post__text}>
{thisPost?.TextoPubli}
            </p>
            <div className={styles.post__image}>
              <img
                src={pastel}
                alt="pastelImage"
                className={styles.post__postImage}
              />
            </div>
            <div className={styles["post__score"]}>
              <label>Calificación:</label>
              {skull}
              {skull}
              {skull}
              {skull}
              {skull}
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.comments}>
            <label className="subtitle">Comentarios</label>
            <div className={styles.newComment}>
              <form className={styles.newComment__form} onSubmit={() => {}}>
                <textarea
                  className={styles.newComment__text}
                  onChange={() => {}}
                  placeholder={`Escribe un comentario como ${user} ...`}
                ></textarea>
                <button type="submit" className={styles.newComment__button}>
                  Publicar comentario
                </button>
              </form>
            </div>
            <div className={styles.comment}>
              <div className={styles.comment__header}>
                <img
                  src={defaultProfile}
                  alt="profileImage"
                  className={styles.comment__userimage}
                />
                <label className={styles.comment__username}>{user}</label>
                <label className={styles.comment__date}>
                  creado en 21/12/2012 12:12
                </label>
              </div>
              <div className={styles.comment__body}>
                <p className={styles.comment__text}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur pharetra elementum tellus, nec fringilla sapien
                  accumsan vel.
                </p>
              </div>
            </div>
            <div className={styles.comment}>
              <div className={styles.comment__header}>
                <img
                  src={defaultProfile}
                  alt="profileImage"
                  className={styles.comment__userimage}
                />
                <label className={styles.comment__username}>{user}</label>
                <label className={styles.comment__date}>
                  creado en 21/12/2012 12:12
                </label>
              </div>
              <div className={styles.comment__body}>
                <p className={styles.comment__text}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur pharetra elementum tellus, nec fringilla sapien
                  accumsan vel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;

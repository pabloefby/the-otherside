import styles from "./Post.module.css";
import { Navbar } from "../components/Navbar";
import Comentario from "../components/Comentario"; 
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
  const [comentarioS, setComentarioS]=useState([]); 
  const[commentText, setCommentText] = useState(""); 
  const[fechaPost, setFechaPost] = useState(""); 


  const getComment= async()=> {
    try{
      const respuesta = await axios.get(`http://localhost:3001/comentario/${id}`); 
      if(respuesta.data.msg==="Error"){
        alert("Error en la BD al obtener comentarios"); 
      }else if(respuesta.data.msg==="Vacio"){
        console.log("no hay comentarios"); 
        setComentarioS([]); 
      }else{
        setComentarioS(respuesta.data); 
      }

    }catch(error){
      console.error(error); 
    }
  }

  const sendComment = async(e)=> {
    e.preventDefault();
   
    try{
      const respuesta= await axios.post("http://localhost:3001/comentario", 
        {
          usuario: user, 
          idPubli: id , 
          texto: commentText
        }); 
      if(respuesta.data.msg==="Error"){
        alert("Error en la BD al subir comentario"); 
      }else if(respuesta.data.msg==="Joe Pino opina"){
        setCommentText(""); 
        getComment();
      }

    }catch(error){
      console.log(error); 
    }
  }

  const getPost = async () => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3001/get-one-post/${id}`
      );

      if (respuesta.data.msg === "ERROR") {
        alert("ERROR EN LA BD");
      } else {
        setThisPost(respuesta.data[0]);
        console.log(respuesta.data[0]);
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
            <label className={styles.post__date}>
              {fechaPost}
            </label>
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
              <form className={styles.newComment__form} onSubmit={sendComment}>
                <textarea
                  className={styles.newComment__text}
                  value={commentText}
                  onChange={(e) => {setCommentText(e.target.value)}}
                  placeholder={`Escribe un comentario como ${user} ...`}
                ></textarea>
                <button type="submit" className={styles.newComment__button}>
                  Publicar comentario
                </button>
              </form>
            </div>
            {comentarioS.map((comentario)=>{
              return(
                <Comentario 
                key={comentario.Comentario_id}
                commentData={comentario}>
                </Comentario>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;

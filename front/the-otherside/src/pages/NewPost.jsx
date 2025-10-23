import styles from "./NewPost.module.css";
import { Navbar } from "../components/Navbar";

function NewPost() {
  return (
    <div className={styles.body}>
      <Navbar></Navbar>
      <div className={styles.newPost}>
        <div className="container">
          <form onSubmit={""} className={styles.register__form}>
            <div className={styles.newPost__header}>
              <label className="subtitle">Crear publicacion</label>

              <label className={styles.newPost__label}>Categoria</label>
              <select className={styles.newPost__selectCategory}>
                <option value="">Selecciona una categoria</option>
                <option value="misterio">Misterio</option>
              </select>
            </div>
            <input
              className={styles.newPost__tag}
              placeholder="Etiqueta"
            ></input>
            <label className={styles.newPost__label}>
              Titulo de la publicacion
            </label>
            <input className={styles.newPost__title}></input>
            <label className={styles.newPost__label}>
              Contenido de la publicacion
            </label>
            <input className={styles.newPost__content}></input>
            <div className={styles.newPost__media}>
              <label className={styles.newPost__labelMedia}>
                <i class="fa-solid fa-image"></i> Agregar imagen
              </label>
              <input
                className={styles.newPost__inputMedia}
                type="file"
                name="media-File"
                accept=".jpg, .jpeg, .mp4"
              ></input>
            </div>
            <label className={styles.newPost__label}>Estado</label>
            <select className={styles.newPost__selectEstado}>
              <option value="">Selecciona un Estado</option>
              <option value="nuevoleon">Nuevo Leon</option>
            </select>
            <label className={styles.newPost__label}>Ciudad</label>
            <select className={styles.newPost__selectCiudad}>
              <option value="">Selecciona una Ciudad</option>
              <option value="juarez">Juarez</option>
            </select>
            <button type="submit" className={styles.newPost__button}>
              Publicar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPost;

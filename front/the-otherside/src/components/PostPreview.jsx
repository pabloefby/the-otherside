import styles from "./PostPreview.module.css";
import defaultProfile from "../assets/defaultProfile.png";
import skullIcon from "../assets/skullIcon.png";

export function PostPreview() {
  const skull = (
    <img src={skullIcon} alt="skullIconAlt" className="skullStyle" />
  );

  return (
    <div className={styles.postPreview}>
      <div className={styles.postPreview__header}>
        <img
          src={defaultProfile}
          alt="profileImage"
          className={styles.postPreview__image}
        />
        <label className={styles.postPreview__username}>
          Nombre de usuario
        </label>
        <label className={styles.postPreview__date}>dd-mm-yy:mm:ss</label>
        <label className={styles.postPreview__category}>Categoria</label>
      </div>
      <div className={styles.postPreview__body}>
        <h2 className={styles.postPreview__title}>Titulo de la publicacion</h2>
        <label className={styles.postPreview__tag}>Etiqueta</label>
        <p className={styles.postPreview__text}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit parturient nam
          fusce metus ullamcorper dignissim sollicitudin, posuere magna turpis
          nisi a sed torquent orci rhoncus dapibus porttitor gravida. Cum dis
          cubilia sed a natoque eleifend montes facilisi himenaeos, vivamus ac
          sociosqu arcu metus porta phasellus sem gravida, interdum dui class
          aenean neque ornare accumsan egestas.{" "}
        </p>
      </div>
      <div className={styles.postPreview__actions}>
        <div div className={styles.postPreview__score}>
          {skull}
          {skull}
          {skull}
          {skull}
          {skull}
        </div>
        <button className={styles.postPreview__read}>Leer mas...</button>
      </div>
    </div>
  );
}

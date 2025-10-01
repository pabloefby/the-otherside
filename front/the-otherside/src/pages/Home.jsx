import styles from "./Home.module.css";
import { Navbar } from "../components/Navbar";
import { Navigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";

function Home() {
  const user = localStorage.getItem("user");

  const skull = (
    <img src={skullIcon} alt="skullIcon" className={styles.skullIcon} />
  );

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.home}>
        <h2 className={styles.home__welcome}>Bienvenido al culto {user}</h2>
        <div className={styles.home__collage}></div>
        <div className={styles.home__ranking}>
          <label className={styles.home__subtitle}>
            Ciudades con mayor prescencia paranormal
          </label>
          <div className={styles["home__ranking-group"]}>
            <div className={styles["home__ranking-element"]}>
              <label className={styles["home__city"]}>Monterrey</label>
              <label className={styles["home__counter"]}>
                23 publicaciones
              </label>
              <div className="styles['home__score']">
                {skull}
                {skull}
                {skull}
                {skull}
                {skull}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

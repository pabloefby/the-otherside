import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import defaultProfile from "../assets/defaultProfile.png";

export function Navbar() {
  const user = localStorage.getItem("user");
  const foto = localStorage.getItem("fotoPerfil");

  const navigate = useNavigate();

  const handleNavigate = (dato) => {
    switch (dato) {

      case "Misterio":
        navigate('/Misterio');
        break

      case "Alien":
        navigate("/Alien");
        break;

      case "Brujeria":
        navigate("/Brujeria")
        break;

      case "Leyendas":
        navigate("/Leyendas")
        break;

      case "Conspiracion":
        navigate("/Conspiracion");
        break;


      default:
        break;
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/Home" className={styles.navbar__link}>
        <h1 className={styles.navbar__logo}>The Otherside</h1>
      </Link>

      <div className={styles.navbar__categories}>
        <button className={styles.navbar__button}
        onClick={() => handleNavigate("Misterio")}
        >MISTERIO</button>
        <button
          className={styles.navbar__button}
          onClick={() => handleNavigate("Alien")}
        >ALIEN</button>
        <button className={styles.navbar__button}
        onClick={() => handleNavigate("Brujeria")}
        >BRUJERIA</button>
        <button className={styles.navbar__button}
        onClick={() => handleNavigate("Leyendas")}
        >LEYENDAS</button>
        <button className={styles.navbar__button}
        onClick={() => handleNavigate("Conspiracion")}
        >CONSPIRACION</button>
        <button className={styles.navbar__button}>CREEPYPASTA</button>
        <button className={styles.navbar__button}>FANTASMA</button>
      </div>
      <div className={styles.navbar__session}>
        <Link to="/Profile" className={styles["navar__image-link"]}>
          <img
            src={
              foto && foto !== "null" && foto !== "undefined" 
                ? `data:image/png;base64,${foto}`
                : defaultProfile
            }
            alt="profile"
            className={styles.navbar__image}
          />
        </Link>
        <div className={styles.navbar__info}>
          <Link to="/Profile" className={styles.navbar__user}>
            {user}
          </Link>
          <Link to="/" className={styles.navbar__logOut}>
            Cerrar sesion
          </Link>
        </div>
      </div>
    </nav>
  );
}

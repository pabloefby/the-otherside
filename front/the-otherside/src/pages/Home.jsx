import styles from "./Home.module.css";
import { Navbar } from "../components/Navbar";
import { PostPreview } from "../components/PostPreview";
import { Link, Navigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const user = localStorage.getItem("user");
  const [publis, setPublis] = useState([]);
  const [topMunici, setTopMunici] = useState([]);
  const [alertText, setAlertText] = useState("");

  const getTopMunicipios = async () => {
    try {
      const resp = await axios.get("http://localhost:3001/get-top-municipios");

      if (resp.data.msg === "Error DB") {
        alert("Error en la db");
      } else {
        setTopMunici(resp.data);
      }
    } catch (error) {
      alert("error en la peticion");
    }
  };

  const getPublis = async () => {
    try {
      const resp = await axios.get("http://localhost:3001/publis-point");
      if (resp.data.msg === "Error BD") {
        alert("Error con la BD");
      } else if (resp.data.msg === "Vacio") {
        setAlertText("Aun no hay publicaciones");
        setPublis([]);
      } else {
        setPublis(resp.data);
        console.log(resp.data);
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al obtener publicaciones");
    }
  };

  const skull = <img src={skullIcon} alt="skullIcon" className="skullStyle" />;

  useEffect(() => {
    getTopMunicipios();
    getPublis();
  }, []);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.home}>
        <h2 className={styles.home__welcome}>Bienvenido al culto {user} ...</h2>
        <div className={styles.home__collage}></div>
        <div className="container">
          <label className="subtitle">
            Municipios con mayor prescencia paranormal
          </label>
          <div className={styles["home__ranking-group"]}>
            {topMunici.map((municipio) => {
              return (
                <div className={styles["home__ranking-element"]}>
                  <label className={styles["home__city"]}>
                    {municipio.Municipio} , {municipio.Estado}
                  </label>
                  <label className={styles["home__counter"]}>
                    {municipio.TotalPublicaciones} publicaciones
                  </label>
                  <div className={styles["home__ranking-score"]}>
                    {skull}
                    {skull}
                    {skull}
                    {skull}
                    {skull}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="container">
          <div className="topSection">
            <label className="subtitle">Publicaciones mas recientes</label>
            <Link to="/NewPost" className="btn">
              {" "}
              <i class="fa-solid fa-plus"></i> Crear publicacion
            </Link>
          </div>
          <div className="content">
            {publis.map((publi, key) => {
              return (
                <PostPreview
                  key={publi.Publicacion_id}
                  publiData={publi}
                ></PostPreview>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

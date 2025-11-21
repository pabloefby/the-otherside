import styles from "./Fantasma.module.css";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PostPreview } from "../components/PostPreview";
import fantasmaCollage from "../assets/fantasmaCollage.png";
import fantasma from "../assets/fantasma.png";
import rocks from "../assets/rocks.png";
import xenomorfo from "../assets/xenomorfo.png";

function Alien() {
  const user = localStorage.getItem("user");
  const [publis, setPublis] = useState([]);
  const [alertText, setAlertText] = useState("");

  const getPublis = async () => {
    try {
       const resp = await axios.get(`http://localhost:3001/publis-category/${"Leyendas"}`);
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

  useEffect(() => {
    getPublis();
  }, []);

  return (
    <div className={styles.body}>
      <Navbar></Navbar>
      <div className={styles.alien}>
        <div className={styles.fantasma__collage}>
          <img
            src={fantasmaCollage}
            alt="fantasmaCollage"
            className={styles.fantasma__image}
          />
        </div>
        <img src={fantasma} alt="fantasma" className={styles.fantasma} />

        <div className="container">
          <div className="topSection">
            <label className="subtitle">Tendencia</label>
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
        <div className="container">
          <div className="topSection">
            <label className="subtitle">Publicaciones recientes</label>
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
export default Alien;
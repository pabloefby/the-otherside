import styles from "./Misterio.module.css";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PostPreview } from "../components/PostPreview";
import misterioCollage from "../assets/misterioCollage.png";
import cabra from "../assets/cabra.png";
import rocks from "../assets/rocks.png";
import xenomorfo from "../assets/xenomorfo.png";

function Alien() {
  const user = localStorage.getItem("user");
  const [publis, setPublis] = useState([]);
  const [alertText, setAlertText] = useState("");

  const getPublis = async () => {
    try {
       const resp = await axios.get(`http://localhost:3001/publis-category/${"Misterio"}`);
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
        <div className={styles.misterio__collage}>
          <img
            src={misterioCollage}
            alt="misterioCollage"
            className={styles.misterio__image}
          />
        </div>
        <img src={cabra} alt="cabra" className={styles.cabra} />

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

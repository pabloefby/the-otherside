import styles from "./Alien.module.css";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
//import { useNavigate } from "react-router-dom";
import { PostPreview } from "../components/PostPreview";
import alienCollage from "../assets/alienCollage.png";
import glorp from "../assets/glorp.png";
import rocks from "../assets/rocks.png";
import xenomorfo from "../assets/xenomorfo.png";

function Alien() {
  //const user = localStorage.getItem("user");
  const [publis, setPublis] = useState([]);
  const [publisTrend, setPublisTrend] = useState([]);
  const [alertText, setAlertText] = useState("");

    const getPublisTrend = async () => {
    try {
      const resp = await axios.get(`http://localhost:3001/publis-category-trend/${"Aliens"}`);
      if (resp.data.msg === "Error BD") {
        alert("Error con la BD");
      } else if (resp.data.msg === "Vacio") {
        setAlertText("Aun no hay publicaciones");
        setPublisTrend([]);
      } else {
        setPublisTrend(resp.data);
        console.log(resp.data);
      }
    } catch (error) {
      console.log(error);
      alert("Error en la peticion al obtener publicaciones");
    }
  };

  const getPublis = async () => {
    try {
      const resp = await axios.get(`http://localhost:3001/publis-category/${"Aliens"}`);
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
    getPublisTrend(); 
  }, []);

  return (
    <div className={styles.body}>
      <Navbar></Navbar>
      <div className={styles.alien}>
        <div className={styles.alien__collage}>
          <img
            src={alienCollage}
            alt="alienCollage"
            className={styles.alien__image}
          />
        </div>
        <img src={glorp} alt="glorp" className={styles.glorp} />
         <img src={rocks} alt="rocks" className={styles.rocks} />
          <img src={xenomorfo} alt="xenomorfo" className={styles.xenomorfo} />

        <div className="container">
          <div className="topSection">
            <label className="subtitle">Tendencia</label>
          </div>
          <div className="content">
            {publisTrend.map((publi) => {
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

import styles from "./NewPost.module.css";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import calacasViendoArriba from "../assets/calacasViendoArriba.png";

function NewPost() {
  const [categoria, SetCategoria] = useState("");
  const [etiqueta, SetEtiqueta] = useState("");
  const [titulo, SetTitulo] = useState("");
  const [contenido, SetContenido] = useState("");
  const [imagen, SetImagen] = useState(null);
  const [imagenUpdate, setImagenUpdate] = useState(null);
  const [estado, SetEstado] = useState("");
  const [municipio, SetMunicipio] = useState("");
  const [alertText, setAlertText]= useState(null);

  const autor = localStorage.getItem("user");

  const [listCategorias, setListCategorias] = useState([]);
  const [listEstados, setListEstados] = useState([]);
  const [listMunicipios, setListMunicipios] = useState([]);

  const navigate = useNavigate();

  const getCategorias = async () => {
    try {
      const resp = await axios.get("http://localhost:3001/get-categories");

      if (resp.data.msg === "Error DB") {
        alert("Error en la db");
      } else {
        setListCategorias(resp.data);
        console.log(listCategorias);
      }
    } catch (error) {
      alert("error en la peticion");
    }
  };

  const getEstados = async () => {
    try {
      const resp = await axios.get("http://localhost:3001/get-estados");

      if (resp.data.msg === "Error DB") {
        alert("Error en la db");
      } else {
        setListEstados(resp.data);
        console.log(listEstados);
      }
    } catch (error) {
      alert("error en la peticion");
    }
  };

  const getMunicipios = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:3001/get-municipios/${estado}`
      );

      if (resp.data.msg === "ErrorDB") {
        alert("Error al obtener los municipios");
      } else {
        setListMunicipios(resp.data);
      }
    } catch (error) {
      alert("error en la peticion");
    }
  };


  function validateCampos(categoria, etiqueta, titulo, contenido, municipio) {
    const errores = [];

    if (categoria === null || categoria === undefined || categoria === "") {
      errores.push("La categoría es obligatoria.");
    }

    if (etiqueta === null || etiqueta === undefined || etiqueta.trim() === "") {
      errores.push("La etiqueta no puede estar vacía. ");
    }

    if(etiqueta.length>=50){
      errores.push("La etiqueta no puede tener mas de 50 caracteres. ");
    }

     if(titulo.length>=255){
      errores.push("El titulo no puede tener mas de 255 caracteres. ");
    }

    if (titulo === null || titulo === undefined || titulo.trim() === "") {
      errores.push("El título es obligatorio. ");
    }

    if (
      contenido === null ||
      contenido === undefined ||
      contenido.trim() === ""
    ) {
      errores.push("El contenido no puede estar vacío. ");
    }

    if (municipio === null || municipio === undefined || municipio === "") {
      errores.push("El municipio es obligatorio. ");
    }

    return errores;
  }

  const sendPublicacion = async (e) => {
    e.preventDefault();

    const errores = validateCampos(
      categoria,
      etiqueta,
      titulo,
      contenido,
      municipio
    );

    if(imagen === null || imagen === undefined){
      setAlertText("Agrega imagen");
      return;
    }

    if (errores.length > 0) {
      setAlertText(errores);
      return;
    }

    const frmPubli = new FormData();
    frmPubli.append("categoria", categoria);
    frmPubli.append("etiqueta", etiqueta);
    frmPubli.append("titulo", titulo);
    frmPubli.append("contenido", contenido);
    frmPubli.append("municipio", municipio);
    frmPubli.append("autor", autor);
    frmPubli.append("imagen", imagen);

    try {
      const respuesta = await axios.post(
        "http://localhost:3001/new-post",
        frmPubli,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (respuesta.data.msg === "ErrorDB") {
        alert("Error al publicar con la db");
      } else if (respuesta.data.msg === "Publicado") {
        
        navigate("/Home");
      }else if(respuesta.data.msg==="CREDENCIALES MALAS"){
         setAlertText("Sus credenciales son incorrectas, intentalo nuevamente"); 
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCategorias();
    getEstados();
  }, []);

  useEffect(() => {
    if (estado) {
      getMunicipios();
    }
  }, [estado]);

  return (
    <div className={styles.body}>
      <Navbar></Navbar>
      <div className={styles.newPost}>
        <img
          src={calacasViendoArriba}
          alt="calacasVuiendoArriba"
          className={styles.calacasViendoArriba}
        />
        <div className="container">
          <form className={styles.register__form} onSubmit={sendPublicacion}>
            <div className={styles.newPost__header}>
              <label className="subtitle">Crear publicación</label>
              <div className={styles.category_selector}>
                <label className={styles.newPost__label}>Categoria</label>
                <select
                  className={styles.newPost__selectCategory}
                  onChange={(e) => {
                    SetCategoria(e.target.value);
                  }}
                >
                  <option value="">Selecciona una categoria</option>
                  {listCategorias.map((categoria) => {
                    return (
                      <option
                        key={categoria.Categoria_id}
                        value={categoria.Categoria_id}
                      >
                        {categoria.NombreC}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
             <h3 className={styles.register__alert} id="register-alerts" > {alertText} </h3>
            <input
              className={styles.newPost__tag}
              placeholder="Etiqueta"
              onChange={(e) => SetEtiqueta(e.target.value)}
            ></input>
            <input
              className={styles.newPost__title}
              onChange={(e) => SetTitulo(e.target.value)}
              placeholder="Título de la publicación"
            ></input>

            <textarea
              className={styles.newPost__content}
              onChange={(e) => SetContenido(e.target.value)}
              placeholder="Escribe tu publicación"
            ></textarea>
            <div className={styles.newPost__media}>

                  {imagen && (
                    <div className={styles.post__image}>
                      <img
                        src={imagen}
                        alt="pastelImage"
                        className={styles.post__postImage}
                      />
                    </div>
                  )}

              <label className={styles.newPost__labelMedia}>
                <i class="fa-solid fa-image"></i> Agregar imagen
              </label>

               <input
                              className={styles.newPost__inputMedia}
                              type="file"
                              name="imagen"
                              accept=".jpg, .jpeg, .png"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setImagenUpdate(e.target.files[0]);
                                if(file){
                                  const reader = new FileReader();
                                  reader.onloadend = () =>{
                                    SetImagen(reader.result);
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }
                              }/>
            </div>
            <div className={styles.newPost__location}>
              <label className={styles.newPost__label}>Estado</label>
              <select
                className={styles.newPost__estado}
                onChange={(e) => {
                  SetEstado(e.target.value);
                }}
              >
                <option value="">Selecciona un Estado</option>
                {listEstados.map((estado) => {
                  return (
                    <option key={estado.Estado_id} value={estado.Estado_id}>
                      {estado.NombreE}
                    </option>
                  );
                })}
                ;
              </select>
              <label className={styles.newPost__label}>Ciudad</label>
              <select
                className={styles.newPost__ciudad}
                onChange={(e) => {
                  SetMunicipio(e.target.value);
                }}
              >
                <option value="">Selecciona un municipio</option>
                {listMunicipios.map((municipio) => (
                  <option
                    key={municipio.Municipio_id}
                    value={municipio.Municipio_id}
                  >
                    {municipio.NombreM}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={styles.newPost__button}>
              <i class="fa-solid fa-plus"></i>
              Publicar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPost;

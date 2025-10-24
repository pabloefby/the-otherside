import styles from "./NewPost.module.css";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewPost() {
  const [categoria, SetCategoria] = useState("");
  const [etiqueta, SetEtiqueta] = useState("");
  const [titulo, SetTitulo] = useState("");
  const [contenido, SetContenido] = useState("");
  const [imagen, SetImagen] = useState(null);
  const [estado, SetEstado] = useState("");
  const [municipio, SetMunicipio] = useState("");

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

      const resp = await axios.get(`http://localhost:3001/get-municipios/${estado}`);

      if(resp.data.msg==="ErrorDB"){
        alert("Error al obtener los municipios");
      }else{
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
    errores.push("La etiqueta no puede estar vacía.");
  }

  if (titulo === null || titulo === undefined || titulo.trim() === "") {
    errores.push("El título es obligatorio.");
  }

  if (contenido === null || contenido === undefined || contenido.trim() === "") {
    errores.push("El contenido no puede estar vacío.");
  }

  if (municipio === null || municipio === undefined || municipio === "") {
    errores.push("El municipio es obligatorio.");
  }

  return errores;
}


  const sendPublicacion = async (e) => {
    e.preventDefault();

    const errores = validateCampos(categoria, etiqueta, titulo, contenido, municipio);

    if(errores.length>0){
      alert(errores);
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
      const respuesta = await axios.post("http://localhost:3001/new-post", frmPubli, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if(respuesta.data.msg==="ErrorDB"){
        alert("Error al publicar con la db");
      } else if(respuesta.data.msg==="Publicado"){
        alert("Publicado");
        navigate("/Home");

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
            <input
              className={styles.newPost__tag}
              placeholder="Etiqueta"
              onChange={(e) => SetEtiqueta(e.target.value)}
            ></input>
            <label className={styles.newPost__label}>
              Título de la publicación
            </label>
            <input
              className={styles.newPost__title}
              onChange={(e) => SetTitulo(e.target.value)}
            ></input>
            <label className={styles.newPost__label}>
              Contenido de la publicación
            </label>
            <input
              className={styles.newPost__content}
              onChange={(e) => SetContenido(e.target.value)}
            ></input>
            <div className={styles.newPost__media}>
              <label className={styles.newPost__labelMedia}>
                <i class="fa-solid fa-image"></i> Agregar imagen
              </label>
              <input
                className={styles.newPost__inputMedia}
                type="file"
                name="imagen"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => SetImagen(e.target.files[0])}
              ></input>
            </div>
            <label className={styles.newPost__label}>Estado</label>
            <select
              className={styles.newPost__selectEstado}
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
              className={styles.newPost__selectEstado}
              onChange={(e) => {
                SetMunicipio(e.target.value);
              }}
            >
              <option value="">Selecciona un Estado</option>
              {listMunicipios.map((municipio) => (
                <option
                  key={municipio.Municipio_id}
                  value={municipio.Municipio_id}
                >
                  {municipio.NombreM}
                </option>
              ))}
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

import styles from "./UpdatePost.module.css";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UpdatePost() {
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
      errores.push("La etiqueta no puede estar vacía.");
    }

    if (titulo === null || titulo === undefined || titulo.trim() === "") {
      errores.push("El título es obligatorio.");
    }

    if (
      contenido === null ||
      contenido === undefined ||
      contenido.trim() === ""
    ) {
      errores.push("El contenido no puede estar vacío.");
    }

    if (municipio === null || municipio === undefined || municipio === "") {
      errores.push("El municipio es obligatorio.");
    }

    return errores;
  }
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
      <div className={styles.updatePost}>
        <div className="container">
          <form className={styles.register__form} onSubmit={""}>
            <div className={styles.updatePost__header}>
              <label className="subtitle">Actualizar publicación</label>
              <div className={styles.category_selector}>
                <label className={styles.updatePost__label}>Categoria</label>
                <select
                  className={styles.updatePost__selectCategory}
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
              className={styles.updatePost__tag}
              placeholder="Etiqueta"
              onChange={(e) => SetEtiqueta(e.target.value)}
            ></input>
            <input
              className={styles.updatePost__title}
              onChange={(e) => SetTitulo(e.target.value)}
              placeholder="Título de la publicación"
            ></input>

            <textarea
              className={styles.updatePost__content}
              onChange={(e) => SetContenido(e.target.value)}
              placeholder="Escribe tu publicación"
            ></textarea>
            <div className={styles.updatePost__media}>
              <label className={styles.newPost__labelMedia}>
                <i class="fa-solid fa-image"></i> Cambiar imagen
              </label>
              <input
                className={styles.updatePost__inputMedia}
                type="file"
                name="imagen"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => SetImagen(e.target.files[0])}
              ></input>
            </div>
            <div className={styles.updatePost__location}>
              <label className={styles.updatePost__label}>Estado</label>
              <select
                className={styles.updatePost__estado}
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
              <label className={styles.updatePost__label}>Ciudad</label>
              <select
                className={styles.updatePost__ciudad}
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
            <button type="submit" className={styles.updatePost__button}>
              <i class="fa-solid fa-pen"></i>
              Actualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default UpdatePost;

import styles from "./UpdatePost.module.css";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePost() {
  const autor = localStorage.getItem("user");
  const { id } = useParams();

  const [categoria, SetCategoria] = useState("");
  const [alertText, setAlertText]= useState(null);
  const [etiqueta, SetEtiqueta] = useState("");
  const [titulo, SetTitulo] = useState("");
  const [contenido, SetContenido] = useState("");
  const [imagen, SetImagen] = useState(null);
  const [imagenUpdate, setImagenUpdate] = useState(null);
  const [estado, SetEstado] = useState("");
  const [municipio, SetMunicipio] = useState("");

  const [listCategorias, setListCategorias] = useState([]);
  const [listEstados, setListEstados] = useState([]);
  const [listMunicipios, setListMunicipios] = useState([]);

  //const [thisPost, setThisPost] = useState(null);

  const navigate = useNavigate();

  const getCategorias = async () => {
    try {
      const resp = await axios.get("http://localhost:3001/get-categories");

      if (resp.data.msg === "Error DB") {
        alert("Error en la db");
      } else {
        setListCategorias(resp.data);
        //console.log(listCategorias);
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
        //console.log(listEstados);
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

  const getPost = async () => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3001/get-one-post-edit/${id}`
      );

      if (respuesta.data.msg === "ERROR") {
        alert("ERROR EN LA BD");
      } else {
        SetCategoria(respuesta.data[0].Categoria);
        SetEtiqueta(respuesta.data[0].Etiqueta);
        SetTitulo(respuesta.data[0].Titulo);
        SetContenido(respuesta.data[0].TextoPubli);
        SetImagen("data:image/png;base64," +respuesta.data[0].Imagen);
        SetEstado(respuesta.data[0].Estado);
        SetMunicipio(respuesta.data[0].Municipio);
        
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();

    console.log(imagenUpdate)

     const errores = validateCampos(
      categoria,
      etiqueta,
      titulo,
      contenido,
      municipio
    );
    
    if (errores.length > 0) {
      setAlertText(errores);
      return;
    }


    const frmPubli = new FormData();
    frmPubli.append("idPubli",id)
    frmPubli.append("categoria", categoria);
    frmPubli.append("etiqueta", etiqueta);
    frmPubli.append("titulo", titulo);
    frmPubli.append("contenido", contenido);
    frmPubli.append("municipio",municipio);
    frmPubli.append("imagen", imagenUpdate);

    try {
      const respuesta = await axios.patch("http://localhost:3001/updatePost",
        frmPubli,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if(respuesta.data.msg==="ERRORDB"){
        alert("Un error inesperado ocurrio en la bd");
      }else if(respuesta.data.msg==="CREDENCIALES MALAS"){
         setAlertText("Sus credenciales son incorrectas, intentalo nuevamente"); 
      }else if(respuesta.data.msg==="UPDATED"){
        //alert("Se ha actualizado la publicacion");
        navigate(`/Post/${id}`);
        
      }
      
    } catch (error) {
      
    }


    console.log("por si acaso esto no se ejecuta")

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
  useEffect(() => {
    getCategorias();
    getEstados();
    getPost();
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
          <form className={styles.register__form} onSubmit={updatePost}>
            <div className={styles.updatePost__header}>
              <label className="subtitle">Actualizar publicación</label>
              <div className={styles.category_selector}>
                <label className={styles.updatePost__label}>Categoria</label>
                <select
                  className={styles.updatePost__selectCategory}
                  onChange={(e) => {
                    SetCategoria(e.target.value);
                  }}
                  value={categoria}
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
              className={styles.updatePost__tag}
              placeholder="Etiqueta"
              onChange={(e) => SetEtiqueta(e.target.value)}
              value={etiqueta}
            />
            <input
              className={styles.updatePost__title}
              onChange={(e) => SetTitulo(e.target.value)}
              placeholder="Título de la publicación"
              value={titulo}
            />

            <textarea
              className={styles.updatePost__content}
              onChange={(e) => SetContenido(e.target.value)}
              placeholder="Escribe tu publicación"
              value={contenido}
            ></textarea>
            <div className={styles.updatePost__media}>
              
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
                <i className="fa-solid fa-image"></i> Cambiar imagen
              </label>
              <input
                className={styles.updatePost__inputMedia}
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
            <div className={styles.updatePost__location}>
              <label className={styles.updatePost__label}>Estado</label>
              <select
                className={styles.updatePost__estado}
                onChange={(e) => {
                  SetEstado(e.target.value);
                }}
                value={estado}
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
                value={municipio}
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
              <i className="fa-solid fa-pen"></i>
              Actualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default UpdatePost;

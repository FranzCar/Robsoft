import "./App.css";
import { URL_API } from "./Servicios/const.js";
import BotonesHeader from "./Componentes/BotonesHeader";
import Logos from "./Componentes/Logos";
import Menu from "./Componentes/Menu";
import Evento from "./Paginas/Evento";
import Inicio from "./Paginas/Inicio";
import Reporte from "./Paginas/Reporte";
import CrearEvento from "./Paginas/CrearEvento";
import EliminarEvento from "./Paginas/EliminarEvento";
import EditarEvento from "./Paginas/EditarEvento";
import Participante from "./Paginas/Participante";
import DetalleEvento from "./Paginas/DetalleEvento";
import Actividades from "./Paginas/Actividades";
import { Route, Routes, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button, Input, Layout, Form, message } from "antd";
import IconoUsuario from "./Imagenes/icono-usuario3.png";
import axios from "axios";
import Login from "./Paginas/Login.jsx";

const { Header, Footer, Content } = Layout;

function App() {
  const [form] = Form.useForm();
  const [mostrarHome, setMostrarHome] = useState(true);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  //Valores para mostrar las opciones del menu q se requiere
  const [mostrarInscripciones, setMostrarIncripciones] = useState(true);
  const [mostrarListaEventos, setMostrarListaEventos] = useState(false);
  const [mostrarGestionEventos, setMostrarGestionEventos] = useState(false);
  const [mostrarReportes, setMostrarReportes] = useState(false);
  const [mostrarAdministrador, setMostrarAdministrador] = useState(false);

  const iniciado = localStorage.getItem("sesion");
  const usuario = localStorage.getItem("usuario");

  //Estado de las tareas que se puedes realizar, almacenadas en localStorage. True o false
  const estadoListaEventos = localStorage.getItem("listaEventos", true);
  const estadoGestionEventos = localStorage.getItem("gestionEventos", false);
  const estadoReportes = localStorage.getItem("reportes", false);
  const estadoAdministrador = localStorage.getItem("administrador", false);

  useEffect(() => {
    if (localStorage.getItem("listaEventos") === "true") {
      setMostrarListaEventos(true);
    } else if (localStorage.getItem("listaEventos") === "false") {
      setMostrarListaEventos(false);
    }
    if (localStorage.getItem("gestionEventos") === "true") {
      setMostrarGestionEventos(true);
    } else if (localStorage.getItem("gestionEventos") === "false") {
      setMostrarGestionEventos(false);
    }
    if (localStorage.getItem("reportes") === "true") {
      setMostrarReportes(true);
    } else if (localStorage.getItem("reportes") === "false") {
      setMostrarReportes(false);
    }
    if (localStorage.getItem("administrador") === "true") {
      setMostrarAdministrador(true);
    } else if (localStorage.getItem("administrador") === "false") {
      setMostrarAdministrador(false);
    }
    if (location.pathname === "/adminUMSS") {
      setMostrarContenido(false);
    } else {
      setMostrarContenido(true);
    }
  }, []);

  //Validar usuario y contraseña
  const validarUsuario = (values) => {
    const datos = {
      username: values.usuario,
      password: values.password,
    };
    axios
      .post(`${URL_API}/login-usuario`, datos)
      .then((response) => {
        //Asignamos el id del usuario para obtener las tareas que tiene
        axios
          .get(`${URL_API}/tareas_de_usuario/${response.data.id_usuario}`)
          .then((response) => {
            asignarTareas(response.data);
            setMostrarHome(true);
            setMostrarLogin(false);
            setNombreUsuario(datos.username);
            if (datos.username === "root") {
              //localStorage.setItem("administrador", true);
            }
            form.resetFields();
          })
          .catch((error) => {
            console.error(error);
          });
        message.success(response.data.message);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };

  const asignarTareas = (lista) => {
    for (let i = 0; i < lista.length; i++) {
      switch (lista[i].id_tarea) {
        case 1:
          setMostrarIncripciones(lista[i].asignado);
          break;
        case 2:
          setMostrarListaEventos(lista[i].asignado);
          break;
        case 3:
          setMostrarGestionEventos(lista[i].asignado);
          break;
        case 4:
          setMostrarReportes(lista[i].asignado);
          break;
        case 5:
          setMostrarAdministrador(lista[i].asignado);
          break;
      }
    }
  };

  //Salir de la vista de inicio de sesion
  const cerrarLogin = () => {
    setMostrarLogin(false);
    setMostrarHome(true);
  };

  // valores q se manda desde botones
  const handleLoginClick = (valor) => {
    setMostrarLogin(valor);
    setMostrarHome(!valor);
  };

  //
  const cerrarSesion = () => {
    setNombreUsuario("");
    setMostrarIncripciones(true);
    setMostrarListaEventos(false);
    setMostrarGestionEventos(false);
    setMostrarReportes(false);
    setMostrarAdministrador(false);
    localStorage.setItem("inscripciones", true);
    localStorage.setItem("listaEventos", false);
    localStorage.setItem("gestionEventos", false);
    localStorage.setItem("reportes", false);
    localStorage.setItem("administrador", false);
    window.location.reload();
  };

  //nueva version
  const [mostrarContenido, setMostrarContenido] = useState(true);
  const location = useLocation();

  return (
    <div>
      {mostrarHome && (
        <Layout className="principal">
          <Routes>
            <Route path="/adminUMSS" element={<Login />} />
          </Routes>
          {mostrarContenido && (
            <>
              <Header className="header">
                <div className="header-botones">
                  <BotonesHeader
                    onLoginClick={handleLoginClick}
                    onClickCerrar={cerrarSesion}
                    administrador={false}
                    usuario={nombreUsuario}
                  />
                </div>
                <Logos />
                <Menu
                  inicio={true}
                  inscripciones={mostrarInscripciones}
                  listaEventos={mostrarListaEventos}
                  gestionEventos={mostrarGestionEventos}
                  reportes={mostrarReportes}
                  administrador={mostrarAdministrador}
                />
              </Header>

              <Content className="content">
                <Routes>
                  <Route path="/" element={<Participante />} />
                </Routes>

                {mostrarListaEventos && (
                  <Routes>
                    <Route path="/evento" element={<Evento />} />
                  </Routes>
                )}
                {mostrarGestionEventos && (
                  <Routes>
                    <Route path="/crearEvento" element={<CrearEvento />} />
                    <Route
                      path="/eliminarEvento"
                      element={<EliminarEvento />}
                    />
                    <Route path="/editarEvento" element={<EditarEvento />} />
                    <Route path="/detalleEvento" element={<DetalleEvento />} />
                    <Route path="/actividades" element={<Actividades />} />
                  </Routes>
                )}
                {mostrarReportes && (
                  <Routes>
                    <Route path="/Reporte" element={<Reporte />} />
                  </Routes>
                )}
              </Content>

              <Footer className="footer">
                Universidad Mayor de San Simon © {new Date().getFullYear()}
              </Footer>
            </>
          )}
        </Layout>
      )}
    </div>
  );
}

export default App;

import "./App.css";
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
import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Layout,
  Form,
  message,
  Tabs,
  Table,
  Checkbox,
} from "antd";
import Column from "antd/es/table/Column";

const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;

function App() {
  const [form] = Form.useForm();
  const [mostrarHome, setMostrarHome] = useState("");
  const [mostrarLogin, setMostrarLogin] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  //Valores para mostrar las opciones del menu q se requiere
  const [mostrarInscripciones, setMostrarIncripciones] = useState("");
  const [mostrarListaEventos, setMostrarListaEventos] = useState("");
  const [mostrarGestionEventos, setMostrarGestionEventos] = useState(false);
  const [mostrarReportes, setMostrarReportes] = useState("");
  const [mostrarAdministrador, setMostrarAdministrador] = useState(false);

  const iniciado = localStorage.getItem("sesion");
  const usuario = localStorage.getItem("usuario");

  //Estado de las tareas que se puedes realizar, almacenadas en localStorage. True o false
  const estadoInscripcion = localStorage.getItem("inscripciones");
  const estadoListaEventos = localStorage.getItem("listaEventos");
  const estadoGestionEventos = localStorage.getItem("gestionEventos");
  const estadoReportes = localStorage.getItem("reportes");
  const estadoAdministrador = localStorage.getItem("administrador");
  const estadoCerrarSesion = localStorage.getItem("cerrarSesion");

  useEffect(() => {
    console.log("usuario: ", usuario);
    console.log("sesion: ", estadoCerrarSesion);
    console.log ("inscripciones", estadoInscripcion)
    // sesionIniciado();
    menuInscripciones();
    menuGestionEventos();
    menuCerrarSesion();
  }, []);

  const menuCerrarSesion = () => {
    if (estadoCerrarSesion === "true") {
      setMostrarHome(estadoCerrarSesion);
      setMostrarAdministrador(!estadoCerrarSesion);
      setMostrarGestionEventos(!estadoCerrarSesion);
      setMostrarIncripciones(!estadoCerrarSesion);
      setMostrarListaEventos(!estadoCerrarSesion);
      setMostrarLogin(!estadoCerrarSesion);
      setMostrarReportes(!estadoCerrarSesion);
      setMostrarIncripciones(!estadoCerrarSesion)
    }
  };

  const menuInscripciones = () => {
    setMostrarHome(estadoInscripcion);
    setMostrarLogin(!estadoInscripcion);
    setMostrarIncripciones(estadoInscripcion);
    setMostrarGestionEventos(!estadoInscripcion);
  };

  const menuGestionEventos = () => {
    setMostrarGestionEventos(estadoGestionEventos);
    setMostrarHome(estadoGestionEventos);
    setMostrarLogin(!estadoGestionEventos);
    setMostrarAdministrador(estadoGestionEventos);
  };

  // const sesionIniciado = () => {
  //   console.log("iniciado ", iniciado);
  //   switch (iniciado) {
  //     case null:
  //       setMostrarMenu(false);
  //       setMostrarHome(true);
  //       setMostrarLogin(false);
  //       setMostrarAdministrador(false);
  //       setNombreUsuario("");
  //       break;
  //     case "false":
  //       setMostrarMenu(false);
  //       setMostrarHome(true);
  //       setMostrarLogin(false);
  //       setMostrarAdministrador(false);
  //       setNombreUsuario("");
  //       break;
  //     case "login":
  //       setMostrarMenu(false);
  //       setMostrarHome(false);
  //       setMostrarLogin(true);
  //       setMostrarAdministrador(false);
  //       break;
  //     case "root":
  //       setMostrarHome(true);
  //       setMostrarLogin(false);
  //       setMostrarAdministrador(true);
  //       break;
  //     case "otro":
  //       setMostrarMenu(true);
  //       setMostrarHome(true);
  //       setMostrarLogin(false);
  //       setMostrarAdministrador(false);
  //       break;
  //     case "cerrarLogin":
  //       setMostrarHome(true);
  //       setMostrarLogin(false);
  //       break;
  //     default:
  //       message.error("Error de designacion de roles");
  //   }
  // };

  const handleLoginClick = (valor) => {
    // Maneja la lógica relacionada con el clic en "Mostrar Login"
    console.log("Se hizo clic en Mostrar Login. Valor recibido:", valor);
    setMostrarGestionEventos(!valor);
    setMostrarHome(!valor);
    setMostrarLogin(valor);
    setMostrarAdministrador(false);
    localStorage.setItem("sesion", "login");
  };

  const validarUsuario = (values) => {
    console.log("values usuario ", values);
    if (values.usuario === "root" && values.password === "root") {
      setMostrarGestionEventos(true);
      setMostrarHome(true);
      setMostrarLogin(false);
      setMostrarAdministrador(true);
      setNombreUsuario(values.usuario);
      localStorage.setItem("usuario", values.usuario);
      localStorage.setItem("sesion", "root");
      form.resetFields();
    } else if (
      values.usuario === "humberto" &&
      values.password === "humberto"
    ) {
      setMostrarHome(true);
      setMostrarLogin(false);
      setMostrarIncripciones(true)
      setMostrarAdministrador(false);
      setMostrarGestionEventos(false)
      setNombreUsuario(values.usuario);
      localStorage.setItem("usuario", values.usuario);
      localStorage.setItem("cerrarSesion", false)
      localStorage.setItem("inscripciones", true)
      form.resetFields();
    } else if (values.usuario === "nuevo" && values.password === "nuevo") {
      // si tarea es igual a getion de eventos
      setMostrarHome(true);
      setMostrarAdministrador(true);
      setMostrarIncripciones(true);
      setMostrarGestionEventos(true);
      setMostrarLogin(false);
      localStorage.setItem("inscripciones", true);
      localStorage.setItem("cerrarSesion", false);
      localStorage.setItem("usuario", values.usuario);
    } else {
      message.error("El nombre de usuario o contraseña son incorrectos");
    }
  };

  const cerrarSesion = (valor) => {
    console.log("cerramos sesion");

    setMostrarHome(true);
    setMostrarGestionEventos(false);
    setMostrarAdministrador(false);
    setMostrarIncripciones(false)
    setNombreUsuario("");
    localStorage.setItem("sesion", false);
    localStorage.setItem("usuario", "");
    localStorage.setItem("inscripciones", false);
    localStorage.setItem("gestionEventos", false);
    localStorage.setItem("cerrarSesion", true);
  };

  const cerrarLogin = () => {
    if (usuario === "root") {
      setMostrarGestionEventos(true);
      setMostrarHome(true);
      setMostrarLogin(false);
      setMostrarAdministrador(true);
      localStorage.setItem("sesion", "root");
      form.resetFields();
    } else {
      //buscamos si usuario === lista de usuarios, obtener las tareas que tienq e ir asignando, administrador
      //tareas gestionar eventos = true, administrador = true
    }
    setMostrarHome(true);
    setMostrarLogin(false);
    localStorage.setItem("sesion", "cerrarLogin");
  };

  return (
    <div>
      {mostrarLogin && (
        <Content>
          <Form form={form} onFinish={validarUsuario}>
            <Form.Item name="usuario">
              <Input placeholder="Nombre de usuario" />
            </Form.Item>
            <Form.Item name="password">
              <Input placeholder="Contraseña" />
            </Form.Item>
            <Button htmlType="submit">Ingresar</Button>
            <Button onClick={cerrarLogin}>Salir</Button>
          </Form>
        </Content>
      )}
      {mostrarHome && (
        <Layout className="principal">
          <Header className="header">
            <div className="header-botones">
              <BotonesHeader
                onLoginClick={handleLoginClick}
                onClickCerrar={cerrarSesion}
                usuario={usuario}
              />
            </div>

            <Logos />

            <Menu administrador={mostrarAdministrador} />
          </Header>
          <Content className="content">
            <Routes>
              <Route path="/" element={<Inicio />} />
            </Routes>
            {(mostrarInscripciones && estadoInscripcion)  && (
              <Routes>
                <Route path="/Participante" element={<Participante />} />
              </Routes>
            )}
            {mostrarListaEventos && (
              <Routes>
                <Route path="/evento" element={<Evento />} />
              </Routes>
            )}
            {mostrarGestionEventos && (
              <Routes>
                <Route path="/crearEvento" element={<CrearEvento />} />
                <Route path="/eliminarEvento" element={<EliminarEvento />} />
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

          <Footer className="footer">Universidad Mayor de San Simon</Footer>
        </Layout>
      )}
    </div>
  );
}

export default App;

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
import { Button, Input, Layout, Form, message } from "antd";
import axios from "axios";

const { Header, Footer, Content } = Layout;

function App() {
  const [form] = Form.useForm();
  const [mostrarHome, setMostrarHome] = useState(true);
  const [mostrarLogin, setMostrarLogin] = useState(false);
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

  useEffect(() => {}, []);

  //Validar usuario y contraseña
  const validarUsuario = (values) => {
    console.log("usuario: ", values);
    const datos = {
      username: values.usuario,
      password: values.password,
    };
    console.log("enviar los datos ", datos);
    axios
      .post("http://localhost:8000/api/login-usuario", datos)
      .then((response) => {
        message.success(response.data.message);
        setMostrarHome(true)
        setMostrarLogin(false)
        setNombreUsuario(datos.username)
        form.resetFields()
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };

  //Salir de la vista de inicio de sesion
  const cerrarLogin = () => {
    setMostrarLogin(false);
    setMostrarHome(true);
  };

  // valores q se manda desde botones
  const handleLoginClick = (valor) => {
    console.log("el valor q pasa botones ", valor);
    setMostrarLogin(valor);
    setMostrarHome(!valor);
  };

  //
  const cerrarSesion = () => {};

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
                usuario={nombreUsuario}
              />
            </div>

            <Logos />

            <Menu administrador={estadoAdministrador} />
          </Header>
          <Content className="content">
            <Routes>
              <Route path="/" element={<Inicio />} />

              <Route path="/Participante" element={<Participante />} />

              <Route path="/evento" element={<Evento />} />

              <Route path="/crearEvento" element={<CrearEvento />} />
              <Route path="/eliminarEvento" element={<EliminarEvento />} />
              <Route path="/editarEvento" element={<EditarEvento />} />
              <Route path="/detalleEvento" element={<DetalleEvento />} />
              <Route path="/actividades" element={<Actividades />} />
              <Route path="/Reporte" element={<Reporte />} />

              <Route path="/Reporte" element={<Reporte />} />
            </Routes>
          </Content>

          <Footer className="footer">Universidad Mayor de San Simon</Footer>
        </Layout>
      )}
    </div>
  );
}

export default App;

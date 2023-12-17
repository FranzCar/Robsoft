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
import IconoUsuario from "./Imagenes/icono-usuario3.png";
import axios from "axios";

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
  const estadoInscripcion = localStorage.getItem("inscripciones");
  const estadoListaEventos = localStorage.getItem("listaEventos");
  const estadoGestionEventos = localStorage.getItem("gestionEventos");
  const estadoReportes = localStorage.getItem("reportes");
  const estadoAdministrador = localStorage.getItem("administrador");
  const estadoCerrarSesion = localStorage.getItem("cerrarSesion");

  useEffect(() => {}, []);

  //Validar usuario y contraseña
  const validarUsuario = (values) => {
    const datos = {
      username: values.usuario,
      password: values.password,
    };
    axios
      .post("http://localhost:8000/api/login-usuario", datos)
      .then((response) => {
        //Asignamos el id del usuario para obtener las tareas que tiene
        axios
          .get(
            `http://localhost:8000/api/tareas_de_usuario/${response.data.id_usuario}`
          )
          .then((response) => {
            asignarTareas(response.data);
            setMostrarHome(true);
            setMostrarLogin(false);
            setNombreUsuario(datos.username);
            if (datos.username === "root") {
              localStorage.setItem("administrador", true);
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
    console.log("el valor q pasa botones ", valor);
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
    window.location.reload();
  };

  return (
    <div>
      {mostrarLogin && (
        <Content className="login">
          <Form
            form={form}
            onFinish={validarUsuario}
            className="formulario-login"
          >
            <img className="icono-usuario" src={IconoUsuario}></img>

            <div className="campos-formulario">
              <Form.Item
                name="usuario"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese el nombre de usuario",
                  },
                  {
                    pattern: /^[^\s]+$/,
                    message:
                      "No se permite espacios en blanco",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el nombre de usuario"
                  maxLength={30}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese la contraseña",
                  },
                  {
                    pattern: /^[^\s]+$/,
                    message:
                      "No se permite espacios en blanco",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Ingrese la contraseña"
                  maxLength={30}
                  allowClear
                />
              </Form.Item>

              <div className="botones-login">
                <Button className="boton-ingresar-login" htmlType="submit">
                  Ingresar
                </Button>
                <Button className="boton-salir-login" onClick={cerrarLogin}>
                  Atrás
                </Button>
              </div>
            </div>
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
              <Route path="/" element={<Inicio />} />
            </Routes>
            {mostrarInscripciones && (
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

import "../App.css";

import { URL_API } from "../Servicios/const.js";
import React, { useState, useEffect } from "react";
import { Button, Input, Form, Layout, message } from "antd";
import IconoUsuario from "../Imagenes/icono-usuario3.png";
import { Link } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

export default function Login() {
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
        console.log("/....")
        localStorage.setItem('inscripciones',"true")
        localStorage.setItem('listaEventos',"true")
        localStorage.setItem('gestionEventos',"true")
        localStorage.setItem('reportes',"true")
        localStorage.setItem('administrador',"true")
        window.location.href = "/";

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
    localStorage.setItem("inscripciones", true);
    localStorage.setItem("listaEventos", mostrarListaEventos);
    localStorage.setItem("gestionEventos", mostrarGestionEventos);
    localStorage.setItem("reportes", mostrarReportes);
    localStorage.setItem("administrador", mostrarAdministrador);
  };

  return (
    <div>
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
                  message: "No se permite espacios en blanco",
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
                  message: "No se permite espacios en blanco",
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
              <Link to="/">
                <Button className="boton-salir-login">Atrás</Button>
              </Link>
            </div>
          </div>
        </Form>
      </Content>
    </div>
  );
}

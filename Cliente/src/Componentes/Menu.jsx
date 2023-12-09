import "../App.css";

import { Link, useLocation } from "react-router-dom";
import { Dropdown, Modal, Form, Table, Input, Select, Checkbox, Alert } from "antd";
import { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import axios from "axios";

const { Column } = Table;

const items = [
  {
    key: "1",
    label: <Link to="/crearEvento">CREAR EVENTO</Link>,
  },
  {
    key: "2",
    label: <Link to="/editarEvento">EDITAR EVENTO</Link>,
  },
  {
    key: "3",
    label: <Link to="/eliminarEvento">ELIMINAR EVENTO</Link>,
  },
  {
    key: "4",
    label: <Link to="/detalleEvento">DETALLES DE EVENTO</Link>,
  },
  {
    key: "5",
    label: <Link to="/actividades">ACTIVIDADES DE EVENTO</Link>,
  },
];

export default function Menu({ administrador }) {
  const location = useLocation();
  const [claseBotones, setClaseBotones] = useState("");
  const [mostrarModalRoles, setMostrarRoles] = useState(false);
  const [mostrarModalTareas, setMostrarModalTareas] = useState(false);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaRoles, setListaRoles] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [alertaUsuario, setAlertaUsuario] = useState(null);

  useEffect(() => {
    obtenerListaUsuarios(ontenerListaRoles());
  }, []);

  const obtenerListaUsuarios = () => {
    axios
      .get("http://localhost:8000/api/lista-usuarios")
      .then((response) => {
        console.log("Los usuarios son ", response.data);
        setListaUsuarios(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const ontenerListaRoles = () => {
    axios
      .get("http://localhost:8000/api/lista-roles")
      .then((response) => {
        console.log("Los roles son ", response.data);
        setListaRoles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const mostrarRoles = () => {
    setMostrarRoles(true);
  };

  const onCancel = () => {
    setMostrarRoles(false);
  };

  const mostrarTareas = () => {
    setMostrarModalTareas(true);
  };

  const onCancelTareas = () => {
    setMostrarModalTareas(false);
  };

  const admin = [
    {
      key: "6",
      label: <Link onClick={mostrarRoles}>ASIGNAR ROLES</Link>,
    },
    {
      key: "7",
      label: <Link onClick={mostrarTareas}>ASIGNAR TAREAS</Link>,
    },
  ];

  useEffect(() => {
    verificarAdministrador();
  }, [administrador]);

  const verificarAdministrador = () => {
    if (administrador) {
      setClaseBotones("botones-inicio-con-administrador");
    } else {
      setClaseBotones("botones-inicio-sin-administrador");
    }
  };

  const listaTareas = [
    {
      value: "Crear evento",
      label: "Crear evento",
    },
    {
      value: "Editar evento",
      label: "Editar evento",
    },
    {
      value: "Reportes",
      label: "Reportes",
    },
  ];

  const handleBuscarParticipante = (setUsuario, setAlertaUsuario) => {
    // Supongo que `listaUsuarios` es tu lista de usuarios
    const usuarioEncontrado = listaUsuarios.find(
      (usuario) => usuario.username === usuario
    );
  
    if (usuarioEncontrado) {
      setAlertaUsuario({
        type: "success",
        message: `${usuarioEncontrado.username}`,
      });
      // Puedes usar 'usuarioEncontrado' para lo que necesites en tu lógica
    } else {
      setAlertaUsuario({
        type: "error",
        message: "Usuario no encontrado",
      });
    }
  };

  
  const handleInputChangeParticipante = (
    event,
    setUsuario,
    setAlertaUsuario
  ) => {
    const value = event.target.value;
    setUsuario(value);
    // Limpiar la alerta cuando el usuario comienza a escribir
    setAlertaUsuario(null);
  };


  return (
    <div className="header-acciones">
      <div className="parte-superior-menu" />

      <div className="titulos-menu">
        <div className={claseBotones}>
          <Link
            to="/"
            className={`boton-inicio ${
              location.pathname === "/" ? "activo" : ""
            }`}
          >
            INICIO
          </Link>

          <Link
            to="/Participante"
            className={`boton-inicio ${
              location.pathname === "/Participante" ? "activo" : ""
            }`}
          >
            INSCRIPCIONES
          </Link>

          <Link
            to="/Evento"
            className={`boton-inicio ${
              location.pathname === "/Evento" ? "activo" : ""
            }`}
          >
            EVENTOS
          </Link>

          <Dropdown
            menu={{
              items: items.map((item) => ({
                key: item.key,
                label: item.label,
              })),
              selectable: true,
            }}
            placement="bottom"
            arrow={{
              pointAtCenter: true,
            }}
          >
            <Link className="boton-administracion">GESTIÓN DE EVENTOS</Link>
          </Dropdown>

          <Link
            to="/Reporte"
            className={`boton-inicio ${
              location.pathname === "/Reporte" ? "activo" : ""
            }`}
          >
            REPORTES
          </Link>
          {administrador && (
            <Dropdown
              menu={{
                items: admin.map((item) => ({
                  key: item.key,
                  label: item.label,
                })),
                selectable: true,
              }}
              placement="bottom"
              arrow={{
                pointAtCenter: true,
              }}
            >
              <Link className="boton-administracion">ADMINISTRACIÓN</Link>
            </Dropdown>
          )}
        </div>
      </div>

      <Modal title="Asignar roles" open={mostrarModalRoles} onCancel={onCancel}>
        <Form>
          <Form.Item label="Seleccionar usuario">
            <Input.Search
              placeholder="Ingresa el carnet de identidad"
              value={usuario}
              onChange={(event) =>
                handleInputChangeParticipante(
                  event,
                  setUsuario,
                  setAlertaUsuario
                )
              }
              onSearch={() =>
                handleBuscarParticipante(setUsuario, setAlertaUsuario, 1)
              }
            />
            {alertaUsuario && (
              <Alert
                message={alertaUsuario.message}
                type={alertaUsuario.type}
                showIcon
                style={{ height: 28 }}
              />
            )}
          </Form.Item>
          <label>Lista de roles</label>
          <Table
            dataSource={listaRoles}
            maskClosable={false}
            keyboard={false}
            closable={false}
            pagination={false}
            centered
          >
            <Column title="Rol" dataIndex="nombre_rol
" />
            <Column title="Asignar" render={(text, record) => <Checkbox />} />
          </Table>
        </Form>
      </Modal>

      <Modal
        title="Asignar tareas"
        open={mostrarModalTareas}
        onCancel={onCancelTareas}
      >
        <Form>
          <Form.Item label="Seleccionar rol">
            <Select allowClear options={listaRoles} />
          </Form.Item>
          <Form.Item label="Lista de tareas">
            <Select mode="multiple" allowClear options={listaTareas} />
          </Form.Item>
          <Form.Item>
            <Content className="border-content">
              <label>Detalles</label>
              <br />
              <label>Rol: Organizador</label>
              <label>
                Tareas asignadas: Crear Evento, Caracteristicas de evento{" "}
              </label>
            </Content>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

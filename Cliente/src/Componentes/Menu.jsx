import "../App.css";

import { Link, useLocation } from "react-router-dom";
import {
  Dropdown,
  Modal,
  Form,
  Table,
  Input,
  Select,
  Checkbox,
  Alert,
  Button,
  message,
} from "antd";
import { SettingOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import axios from "axios";

const { Column } = Table;
const { confirm } = Modal;

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

export default function Menu() {
  const location = useLocation();
  const administrador = true;
  const [formRoles] = Form.useForm();
  const [claseBotones, setClaseBotones] = useState("");
  const [mostrarModalRoles, setMostrarRoles] = useState(false);
  const [mostrarModalTareas, setMostrarModalTareas] = useState(false);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaRoles, setListaRoles] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [alertaUsuario, setAlertaUsuario] = useState(null);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState("");
  const [checksSeleccionados, setChecksSeleccionados] = useState([]);
  const [listaRolesAsignados, setListaRolesAsignados] = useState([]);
  //Asigncion de tareas a los roles
  const [listaRolesTareas, setListaRolesTareas] = useState([]);
  const [listaTareaIncripciones, setListaTareaIncripciones] = useState([]);
  const [listaTareaEventos, setListaTareaEventos] = useState([]);
  const [listaTareaGestion, setListaTareaGestion] = useState([]);
  const [listaTareaReportes, setListaTareaReportes] = useState([]);
  const [listaTareaAdministracion, setListaTareaAdministracion] = useState([]);
  const [listaCombinada, setListaCombinada] = useState([]);

  useEffect(() => {
    verificarAdministrador();
    obtenerListaUsuarios();
    ontenerListaRoles();
    obtenerRolesConTareas();
    asignarTareas();
  }, []);

  //Obtenemos las listas de las bases de datos
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

  const obtenerRolesConTareas = () => {
    axios
      .get("http://localhost:8000/api/lista-roles-tareas")
      .then((response) => {
        console.log("Las tareas de los roles son", response.data);
        setListaRolesTareas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Asignamos las tareas a sus listas correspondientes

  const asignarTareaIncripciones = () => {
    const nuevaLista = listaRolesTareas.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 1),
    }));

    setListaTareaIncripciones(nuevaLista);
  };

  const asignarTareaEventos = () => {
    const nuevaLista = listaRolesTareas.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 2),
    }));

    setListaTareaEventos(nuevaLista);
  };

  const asignarTareaGestion = () => {
    const nuevaLista = listaRolesTareas.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 3),
    }));

    setListaTareaGestion(nuevaLista);
  };

  const asignarTareaReportes = () => {
    const nuevaLista = listaRolesTareas.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 4),
    }));

    setListaTareaReportes(nuevaLista);
  };

  const asignarTareaAdministracion = () => {
    const nuevaLista = listaRolesTareas.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 5),
    }));

    setListaTareaAdministracion(nuevaLista);
  };

  const asignarTareas = () => {
    asignarTareaIncripciones();
    asignarTareaEventos();
    asignarTareaGestion();
    asignarTareaReportes();
    asignarTareaAdministracion();
  };

  const combinarListas = () => {
    // Crear una nueva lista combinada
    const listaCombinada = [];

    // Iterar sobre la lista de roles
    listaRoles.forEach((rol, index) => {
      // Crear un objeto para el elemento actual en listaRoles
      const combinedItem = {
        rol: rol.nombre_rol,
        id_rol: rol.id_roles,
        asignados: [],
      };

      // Determinar la lista a utilizar según la posición
      let listaTareas;
      switch (index) {
        case 0:
          listaTareas = listaTareaIncripciones;
          break;
        case 1:
          listaTareas = listaTareaEventos;
          break;
        case 2:
          listaTareas = listaTareaGestion;
          break;
        case 3:
          listaTareas = listaTareaReportes;
          break;
        case 4:
          listaTareas = listaTareaAdministracion;
          break;
        default:
          listaTareas = [];
      }

      // Iterar sobre la lista de tareas e incluir solo las tareas correspondientes al rol actual
      listaTareas.forEach((item) => {
        combinedItem.asignados.push({
          asignado: item.asignado,
          // Puedes incluir otros campos necesarios aquí
        });
      });

      // Agregar el objeto combinado a la lista
      listaCombinada.push(combinedItem);
    });

    // Devolver la lista combinada
    setListaCombinada(listaCombinada);
  };

  const mostrarRoles = () => {
    setMostrarRoles(true);
  };

  const onCancelRol = () => {
    setAlertaUsuario(null);
    setUsuario("");
    setUsuarioEncontrado("");
    setChecksSeleccionados([]);
    setListaRolesAsignados([]);
    setMostrarRoles(false);
    formRoles.resetFields();
  };

  const mostrarTareas = () => {
    // Al abrir el modal, se asignan los valores de las tareas a sus respectivas listas
    asignarTareas();

    // Se combina la lista después de asignar las tareas
    combinarListas();

    // Se imprime la lista combinada en la consola para propósitos de depuración
    console.log("lista combinada ", listaCombinada);

    // Si la lista combinada tiene una longitud igual a 0, se vuelve a llamar a la función combinarListas
    if (listaCombinada.length === 0) {
      combinarListas();
    } else {
      // Si la lista combinada no es igual a 0, se establece mostrarModalTareas en true
      setMostrarModalTareas(true);
    }
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

  const verificarAdministrador = () => {
    if (administrador) {
      setClaseBotones("botones-inicio-con-administrador");
    } else {
      setClaseBotones("botones-inicio-sin-administrador");
    }
  };

  const handleBuscarUsuario = (usuario, setAlertaUsuario) => {
    // Supongo que `listaUsuarios` es tu lista de usuarios
    const usuarioEncontrado = listaUsuarios.find(
      (user) => user.username === usuario
    );

    if (usuarioEncontrado) {
      setAlertaUsuario({
        type: "success",
        message: `${usuarioEncontrado.username}`,
      });
      setUsuarioEncontrado(usuarioEncontrado);
      axios
        .get(
          `http://localhost:8000/api/roles_de_usuario/${usuarioEncontrado.id_usuario}`
        )
        .then((response) => {
          console.log("Los roles son ", response.data);
          setListaRolesAsignados(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setAlertaUsuario({
        type: "error",
        message: "Usuario no encontrado",
      });
    }
  };

  const handleInputChangeUsuario = (event, setUsuario, setAlertaUsuario) => {
    const value = event.target.value;
    setUsuario(value);
    // Limpiar la alerta cuando el usuario comienza a escribir
    setAlertaUsuario(null);
    if (value !== usuario) {
      setUsuarioEncontrado("");
    }
  };

  const showConfirmRoles = (values) => {
    confirm({
      title: "¿Está seguro de actualizar los roles?",
      icon: <ExclamationCircleFilled />,
      content: "Los nuevos roles se asignaran al usuario ",
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        guardarRoles(values);
      },
      onCancel() {},
    });
  };

  const showConfirmTareas = (values) => {
    confirm({
      title: "¿Está seguro de actualizar las tareas?",
      icon: <ExclamationCircleFilled />,
      content: "Las nuevas tareas se asignarán a los roles ",
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        guardarTareas();
      },
      onCancel() {},
    });
  };

  const showCancelRoles = () => {
    confirm({
      title: "¿Está seguro de cancelar?",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        onCancelRol();
      },
      onCancel() {},
    });
  };

  const showCancelTareas = () => {
    confirm({
      title: "¿Está seguro de cancelar?",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        onCancelTareas();
      },
      onCancel() {},
    });
  };

  const guardarRoles = () => {
    if (usuarioEncontrado.id_usuario === undefined) {
      message.error("Tiene que seleccionar un usuario");
    } else if (checksSeleccionados.length === 0) {
      message.error("El usuario debe tener almenos un rol");
    } else {
      const datos = {
        id_usuario: usuarioEncontrado.id_usuario,
        roles: checksSeleccionados,
      };
      console.log("Los datos a enviar son ", datos);
      axios
        .post("http://localhost:8000/api/usuarios-actualizar-roles", datos)
        .then((response) => {
          message.success("Los roles se asignaron correctamente");
          onCancelRol();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const isRolAsignado = (idRol) => {
    // Verifica si el rol está asignado en la lista de roles asignados
    const rolAsignado = listaRolesAsignados.find(
      (rol) => rol.id_roles === idRol
    );
    if (rolAsignado && rolAsignado.asignado === true) {
      // Verificar si el rol ya está en la lista antes de agregarlo
      if (!checksSeleccionados.includes(rolAsignado.id_roles)) {
        setChecksSeleccionados((listaPrevia) => [
          ...listaPrevia,
          rolAsignado.id_roles,
        ]);
      }
    } else {
      // Verificar si el rol está en la lista antes de intentar removerlo
      if (checksSeleccionados.includes(idRol)) {
        setChecksSeleccionados((listaPrevia) =>
          listaPrevia.filter((rolId) => rolId !== idRol)
        );
      }
    }
    return rolAsignado ? rolAsignado.asignado : false;
  };

  const handleCheckChange = (idRol, isChecked) => {
    // Actualizar el estado de roles asignados según el cambio de checkbox
    setListaRolesAsignados((prevRoles) =>
      prevRoles.map((rol) =>
        rol.id_roles === idRol ? { ...rol, asignado: isChecked } : rol
      )
    );

    // Actualizar la lista de checks seleccionados
    setChecksSeleccionados((prevChecks) => {
      if (isChecked) {
        // Si el checkbox se marca, agregar el id_roles a la lista
        return [...prevChecks, idRol];
      } else {
        // Si el checkbox se desmarca, quitar el id_roles de la lista
        return prevChecks.filter((check) => check !== idRol);
      }
    });
  };

  const guardarTareas = () => {
    const datos = [];

    let id = 1;

    for (let i = 0; i < listaCombinada.length; i++) {
      let tareasAsignadas = [];

      for (let j = 0; j < 5; j++) {
        const tareaAsignada = listaCombinada[j].asignados[i].asignado;

        if (tareaAsignada) {
          tareasAsignadas.push(j + 1);
        }
      }

      if (tareasAsignadas.length > 0) {
        datos.push({
          id_roles: id,
          tareas: tareasAsignadas,
        });
      }

      id++;

      if (id > 7) {
        id = 1;
      }
    }
    axios
      .post("http://localhost:8000/api/roles-actualizar-tareas", datos)
      .then((response) => {
        message.success("Las tareas han sido modificadas correctamente");
        obtenerRolesConTareas();
        setListaCombinada([]);

        setMostrarModalTareas(false);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Datos guardados:", datos);
  };

  const handleCheckChangeInscripciones = (index, isChecked, columna) => {
    // Clona la lista para evitar mutar el estado directamente
    const nuevaLista = listaCombinada.map((item, i) => {
      if (i === columna) {
        // Solo actualiza la primera fila
        return {
          ...item,
          asignados: item.asignados.map((asignado, j) =>
            j === index ? { ...asignado, asignado: isChecked } : asignado
          ),
        };
      }
      return item;
    });

    // Realiza cualquier otra operación que necesites con la nueva lista
    // ...

    // Actualiza el estado con la nueva lista
    setListaCombinada(nuevaLista);
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

      {/* Modal para asignar los roles a un usuario */}
      <Modal
        title="Asignar roles"
        open={mostrarModalRoles}
        onCancel={showCancelRoles}
        footer={[
          <Form form={formRoles} onFinish={showConfirmRoles}>
            <Button onClick={showCancelRoles}>Cancelar</Button>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form>,
        ]}
      >
        <Form form={formRoles}>
          <Form.Item label="Buscar usuario" name="usuario">
            <Input.Search
              placeholder="Ingresa el nombre de usuario"
              value={usuario}
              onChange={(event) =>
                handleInputChangeUsuario(event, setUsuario, setAlertaUsuario)
              }
              onSearch={() => handleBuscarUsuario(usuario, setAlertaUsuario)}
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
            scroll={{ y: 220 }}
            maskClosable={false}
            keyboard={false}
            closable={false}
            pagination={false}
            centered
            locale={{
              emptyText: (
                <div style={{ padding: "70px", textAlign: "center" }}>
                  No hay roles
                </div>
              ),
            }}
          >
            <Column title="Rol" dataIndex="nombre_rol" />
            <Column
              title="Asignar"
              render={(text, record) => (
                <Checkbox
                  checked={isRolAsignado(record.id_roles)}
                  onChange={(e) =>
                    handleCheckChange(record.id_roles, e.target.checked)
                  }
                />
              )}
            />
          </Table>
        </Form>
      </Modal>

      {/* Modal para asignar las tareas a los roles */}
      <Modal
        title="Asignar tareas"
        open={mostrarModalTareas}
        onCancel={showCancelTareas}
        width={1000}
        footer={[
          <Form form={formRoles} onFinish={showConfirmTareas}>
            <Button onClick={showCancelTareas}>Cancelar</Button>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form>,
        ]}
      >
        <Form>
          <Form.Item>
            <Table
              dataSource={listaCombinada}
              scroll={{ y: 200 }}
              maskClosable={false}
              keyboard={false}
              closable={false}
              pagination={false}
              centered
              locale={{
                emptyText: (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    No hay roles con sus tareas
                  </div>
                ),
              }}
            >
              <Column title="Roles" dataIndex="rol" />
              <Column
                title="Inscripciones"
                dataIndex="asignados"
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[0]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 0)
                    }
                  />
                )}
              />

              <Column
                title="Lista de eventos"
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[1]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 1)
                    }
                  />
                )}
              />
              <Column
                title="Gestión de eventos"
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[2]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 2)
                    }
                  />
                )}
              />
              <Column
                title="Reportes"
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[3]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 3)
                    }
                  />
                )}
              />
              <Column
                title="Administración"
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[4]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 4)
                    }
                  />
                )}
              />
            </Table>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

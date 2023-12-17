import "../App.css";
import { URL_API } from "../Servicios/const.js";
import { Link, useLocation } from "react-router-dom";
import {
  Dropdown,
  Modal,
  Form,
  Table,
  Input,
  Checkbox,
  Alert,
  Button,
  message,
  Tooltip,
  Space,
  Select,
} from "antd";
import {
  ExclamationCircleFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
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

export default function Menu({
  inicio,
  inscripciones,
  listaEventos,
  gestionEventos,
  reportes,
  administrador,
}) {
  const location = useLocation();
  const [formRoles] = Form.useForm();
  const [formCrearUsuario] = Form.useForm();
  const [claseBotones, setClaseBotones] = useState("");
  const [mostrarModalRoles, setMostrarRoles] = useState(false);
  const [mostrarModalTareas, setMostrarModalTareas] = useState(false);
  const [mostrarModalCrearUsuario, setMostrarModalCrearUsuario] =
    useState(false);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaRoles, setListaRoles] = useState([]);
  const [listaRolesMostrar, setListaRolesMostrar] = useState([]);
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
  const [bloquearRoot, setBloquearRoot] = useState(false);

  useEffect(() => {
    mostrarMenu();
    obtenerListaUsuarios();
    ontenerListaRoles();
    obtenerRolesConTareas();
  }, []);

  //Obtenemos las listas de las bases de datos
  const obtenerListaUsuarios = () => {
    axios
      .get(`${URL_API}/lista-usuarios`)
      .then((response) => {
        setListaUsuarios(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const ontenerListaRoles = () => {
    axios
      .get(`${URL_API}/lista-roles`)
      .then((response) => {
        console.log("la lista de roles es ", response.data);
        setListaRoles(response.data);
        formatoListaRoles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const obtenerRolesConTareas = () => {
    axios
      .get(`${URL_API}/lista-roles-tareas`)
      .then((response) => {
        setListaRolesTareas(response.data);
        asignarTareaIncripciones(response.data);
        asignarTareaEventos(response.data);
        asignarTareaGestion(response.data);
        asignarTareaReportes(response.data);
        asignarTareaAdministracion(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatoListaRoles = (lista) => {
    setListaRolesMostrar(
      lista.map((rol) => ({
        value: rol.id_roles,
        label: rol.nombre_rol,
      }))
    );
  };

  //Asignamos las tareas a sus listas correspondientes
  const asignarTareaIncripciones = (lista) => {
    console.log("se asignan las tareas de incripciones", lista);
    const nuevaLista = lista.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 1),
    }));

    setListaTareaIncripciones(nuevaLista);
  };

  const asignarTareaEventos = (lista) => {
    const nuevaLista = lista.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 2),
    }));

    setListaTareaEventos(nuevaLista);
  };

  const asignarTareaGestion = (lista) => {
    const nuevaLista = lista.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 3),
    }));

    setListaTareaGestion(nuevaLista);
  };

  const asignarTareaReportes = (lista) => {
    const nuevaLista = lista.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 4),
    }));

    setListaTareaReportes(nuevaLista);
  };

  const asignarTareaAdministracion = (lista) => {
    const nuevaLista = lista.map((rol) => ({
      asignado: rol.tareas.some((tarea) => tarea.id_tarea === 5),
    }));

    setListaTareaAdministracion(nuevaLista);
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
    setBloquearRoot(false);
    formRoles.resetFields();
  };

  const mostrarTareas = () => {
    combinarListas();
    setMostrarModalTareas(true);
  };

  const onCancelTareas = () => {
    setMostrarModalTareas(false);
  };

  const mostrarModalUsuario = () => {
    setMostrarModalCrearUsuario(true);
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
    {
      key: "8",
      label: <Link onClick={mostrarModalUsuario}>CREAR USUARIO</Link>,
    },
  ];

  const mostrarMenu = () => {
    let contador = 0;
    const listaPrivilegios = [
      { valor: inicio },
      { valor: inscripciones },
      { valor: listaEventos },
      { valor: gestionEventos },
      { valor: reportes },
      { valor: administrador },
    ];
    for (let i = 0; i < listaPrivilegios.length; i++) {
      if (listaPrivilegios[i].valor === true) {
        contador++;
      }
    }
    console.log("el contador es ", contador);
    setClaseBotones(`botones-menu-columnas-${contador}`);
    return contador;
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
        .get(`${URL_API}/roles_de_usuario/${usuarioEncontrado.id_usuario}`)
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

  const showConfirmRolesCrearUsuario = (values) => {
    confirm({
      title: "Confirmar creación de usuario",
      icon: <ExclamationCircleFilled />,
      content: "¿Está seguro de que desea crear el nuevo usuario?",
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        guardarUsuario(values);
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

  const showCancelCrearUsuario = () => {
    confirm({
      title: "¿Está seguro de cancelar?",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        setMostrarModalCrearUsuario(false);
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
        .post(`${URL_API}/usuarios-actualizar-roles`, datos)
        .then((response) => {
          message.success("Los roles se asignaron correctamente");
          setBloquearRoot(false);
          onCancelRol();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const guardarUsuario = (datos) => {
    const usuariosMinusculas = listaUsuarios.map((usuario) =>
      usuario.username.toLowerCase()
    );
    const nuevoUsuarioMinusculas = datos.username.toLowerCase();

    if (usuariosMinusculas.includes(nuevoUsuarioMinusculas)) {
      message.error("El nombre de usuario ya existe. Por favor, elige otro.");
    } else {
      axios
        .post(`${URL_API}/crear-usuario`, datos)
        .then((response) => {
          setMostrarModalCrearUsuario(false);
          message.success("El usuario se creó correctamente");
          formCrearUsuario.resetFields();
        })
        .catch((error) => {
          message.error(error);
        });
    }
  };

  const isRolAsignado = (record) => {
    // Si el nombre de rol es 'root', se bloquea el checkbox
    if (usuario === "root") {
      setBloquearRoot(true);
    } else {
      setBloquearRoot(false);
    }

    const rolAsignado = listaRolesAsignados.find(
      (rol) => rol.id_roles === record.id_roles
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
      if (checksSeleccionados.includes(record.id_roles)) {
        setChecksSeleccionados((listaPrevia) =>
          listaPrevia.filter((rolId) => rolId !== record.id_roles)
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
    console.log("Datos guardados:", datos);

    if (datos.length !== 7) {
      message.error("Cada rol debe tener por lomenos una tarea");
    } else {
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
    }
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
          {inicio && (
            <Link
              to="/"
              className={`boton-inicio ${
                location.pathname === "/" ? "activo" : ""
              }`}
            >
              INICIO
            </Link>
          )}

          {inscripciones && (
            <Link
              to="/Participante"
              className={`boton-inicio ${
                location.pathname === "/Participante" ? "activo" : ""
              }`}
            >
              INSCRIPCIONES
            </Link>
          )}

          {listaEventos && (
            <Link
              to="/Evento"
              className={`boton-inicio ${
                location.pathname === "/Evento" ? "activo" : ""
              }`}
            >
              EVENTOS
            </Link>
          )}

          {gestionEventos && (
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
          )}

          {reportes && (
            <Link
              to="/Reporte"
              className={`boton-inicio ${
                location.pathname === "/Reporte" ? "activo" : ""
              }`}
            >
              REPORTES
            </Link>
          )}
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
        maskClosable={false}
        keyboard={false}
        closable={false}
        pagination={false}
        centered
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
            pagination={false}
            centered
            bordered
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
              render={(text, record, index) => (
                <Checkbox
                  checked={isRolAsignado(record)}
                  onChange={(e) =>
                    handleCheckChange(record.id_roles, e.target.checked)
                  }
                  disabled={index === 0 && bloquearRoot}
                />
              )}
            />
          </Table>
        </Form>
      </Modal>

      {/* Modal para asignar las tareas a los roles */}
      <Modal
        title="Asignar módulos"
        open={mostrarModalTareas}
        onCancel={showCancelTareas}
        width={1000}
        maskClosable={false}
        keyboard={false}
        closable={false}
        pagination={false}
        centered
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
              scroll={{ y: 220 }}
              maskClosable={false}
              keyboard={false}
              closable={false}
              pagination={false}
              bordered
              locale={{
                emptyText: (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    No hay roles con sus tareas
                  </div>
                ),
              }}
            >
              <Column
                dataIndex="rol"
                key="rol"
                title={
                  <Space size="middle">
                    Roles
                    <Tooltip title={`Roles que tiene cada usuario`}>
                      <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
              />
              <Column
                dataIndex="asignados"
                key="inscripciones"
                title={
                  <Space size="middle">
                    Inscripciones
                    <Tooltip
                      title={`El usuario puede acceder a todos los eventos disponibles y, además,
                      tiene la capacidad de inscribir a otras personas en dichos eventos, brindándole un control completo sobre la participación.`}
                    >
                      <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      index === 0 ||
                      listaCombinada[0]?.asignados[index]?.asignado ||
                      false
                    }
                    onChange={(e) =>
                      index !== 0 &&
                      handleCheckChangeInscripciones(index, e.target.checked, 0)
                    }
                    disabled={index === 0}
                  />
                )}
              />

              <Column
                title={
                  <Space size="middle">
                    Lista de eventos
                    <Tooltip
                      title={`El usuario tiene la capacidad de acceder a información detallada de los eventos,
                      permitiéndole obtener una visión completa de cada experiencia planificada.`}
                    >
                      <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[1]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 1)
                    }
                    disabled={index === 0}
                  />
                )}
              />
              <Column
                title={
                  <Space size="middle">
                    Gestión de eventos
                    <Tooltip
                      title={`El usuario cuenta con la capacidad de crear, editar, eliminar, detallar y asignar actividades a eventos`}
                    >
                      <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[2]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 2)
                    }
                    disabled={index === 0}
                  />
                )}
              />
              <Column
                title={
                  <Space size="middle">
                    Reportes
                    <Tooltip
                      title={`El usuario tendrá acceso a ver los reportes de cada evento, así como reportes generales y específicos,
                      ofreciendo una visión completa de la información relacionada con los eventos.`}
                    >
                      <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[3]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 3)
                    }
                    disabled={index === 0}
                  />
                )}
              />
              <Column
                title={
                  <Space size="middle">
                    Administración
                    <Tooltip
                      title={`El usuario puede asignar roles, gestionar tareas y crear nuevos usuarios,
                      teniendo así el control total sobre la organización y participación en el sistema.`}
                    >
                      <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                render={(text, record, index) => (
                  <Checkbox
                    checked={
                      listaCombinada[4]?.asignados[index]?.asignado || false
                    }
                    onChange={(e) =>
                      handleCheckChangeInscripciones(index, e.target.checked, 4)
                    }
                    disabled={index === 0}
                  />
                )}
              />
            </Table>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para mostrar el formulario de creacion de usuario */}
      <Modal
        title="Crear usuario"
        open={mostrarModalCrearUsuario}
        onCancel={showCancelCrearUsuario}
        maskClosable={false}
        keyboard={false}
        closable={false}
        pagination={false}
        width={450}
        centered
        footer={[
          <Form form={formCrearUsuario} onFinish={showConfirmRolesCrearUsuario}>
            <Button onClick={showCancelCrearUsuario}>Cancelar</Button>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form>,
        ]}
      >
        <Form form={formCrearUsuario} layout="vertical">
          <Form.Item
            label="Nombre de usuario"
            name="username" // Agrega un nombre al campo para la validación
            rules={[
              {
                required: true,
                message: "Por favor, ingrese el nombre de usuario",
              },
              {
                min: 4,
                message: "El nombre de usuario debe tener mínimo 4 caracteres",
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
            label="Contraseña"
            name="password" // Agrega un nombre al campo para la validación
            rules={[
              { required: true, message: "Por favor, ingrese la contraseña" },
              {
                min: 6,
                message: "La contraseña debe tener mínimo 6 caracteres",
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
              minLength={6}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="Rol"
            name="id_roles" // Agrega un nombre al campo para la validación
            rules={[
              {
                required: true,
                message: "Por favor, selecciona el rol del usuario",
              },
            ]}
          >
            <Select
              placeholder="Selecciona el rol del usuario"
              options={listaRolesMostrar}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

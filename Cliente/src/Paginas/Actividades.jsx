import "../App.css";
import { URL_API } from "../Servicios/const.js";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Radio,
  DatePicker,
  Select,
  Input,
  message,
  Tabs,
  TimePicker,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  SettingOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Column } = Table;
const { confirm } = Modal;

export default function Actividades() {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [data, setData] = useState([]);
  const [modalActividades, setModalActividades] = useState(false);
  const [listaEtapas, setListaEtapas] = useState([]);
  const [idEvento, setIdEvento] = useState(null);
  const [valueModalidad, setValueModalidad] = useState(1);
  const [mostrarUbicacion, setMostrarUbicacion] = useState(false);
  const [obtenerUbicaciones, setObtenerUbicaciones] = useState([]);
  const [mostrarInputURL, setMostrarInputURL] = useState(false);
  const [listaUbicacion, setListaUbicacion] = useState(null);
  const [fechaInicioBD, setFechaInicioBD] = useState(null);
  const [fechaFinBD, setFechaFinBD] = useState(null);
  const [tituloBD, setTituloBD] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [horafin, setHoraFin] = useState(null);
  const [estadoHoraInicio, setEstadoHoraInicio] = useState(false);
  const [estadoHoraFin, setEstadoHoraFin] = useState(false);

  //Obtener datos de la base de datos
  useEffect(() => {
    obtenerDatos();
    obtenerListaUbicaciones();
  }, []);

  const obtenerDatos = () => {
    axios
      .get(`${URL_API}/eventos-modificables`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const obtenerListaUbicaciones = () => {
    axios
      .get(`${URL_API}/lista-ubicaciones`)
      .then((response) => {
        const listaConFormato = response.data.map((element) => ({
          id: element.id_ubicacion,
          nombre: element.nombre_ambiente,
          value: element.nombre_ambiente,
          label: element.nombre_ambiente,
        }));
        setObtenerUbicaciones(listaConFormato);
        console.log("lista de ubicaciones ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Mensaje de confirmacion al dar guardar en la parte de registro de los detalles
  const showConfirmActividad = (values) => {
    let contenido = "";
    if (listaEtapas.length === 0) {
      contenido =
        "Para guardar esta actividad se usarán los datos de creación del evento";
    }
    confirm({
      title: "¿Está seguro de guardar las actividades de este evento?",
      icon: <ExclamationCircleFilled />,
      content: contenido,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        guardarActividad(values, idEvento);
      },
      onCancel() {},
    });
  };

  const formularioActividades = (record) => {
    axios
      .get(`${URL_API}/evento-con-etapas/${record.id_evento}`)
      .then((response) => {
        const conDetalles = response.data.tieneEtapas;

        if (conDetalles === false) {
          setTituloBD(record.TITULO);
          setFechaInicioBD(record.FECHA_INICIO);
          setFechaFinBD(record.FECHA_FIN);
          setIdEvento(record.id_evento);
          setModalActividades(true);
        } else {
          message.info("El evento ya tiene etapas");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelActividades = () => {
    setListaEtapas([]);
    setModalActividades(false);
  };

  const registrarActividad = (values) => {
    const dato1 = form.getFieldValue("MODALIDAD_ETAPA")
    const dato2 = form.getFieldValue("UBICACION_ETAPA")
    console.log("datos ", dato1, " ", dato2)
    showConfirmActividad(values);
  };

  const verificarUbicacion = (ubicacion) => {
    if (ubicacion === "Auditorio 1") return 1;
    if (ubicacion === "Auditorio 2") return 2;
    if (ubicacion === "Laboratorio 1") return 3;
    if (ubicacion === "Laboratorio 2") return 4;
    if (ubicacion === "Laboratorio 3") return 5;
    if (ubicacion === "Laboratorio 4") return 6;
  };

  const guardarActividad = (values, id) => {
    if (listaEtapas.length === 0) {
      console.log("dato enciar vacio ", values)
      const fechaHoraInicio = fechaInicioBD + " " + "08:00";
      const fechaHoraFin = fechaFinBD + " " + "20:00";
      let modalidad = form.getFieldValue("MODALIDAD_ETAPA")
      let ubicacion = form.getFieldValue("UBICACION_ETAPA")
      let id_ubic = null
      let url = null
      let modalidadEnviar = null

      if (modalidad === 1){
        modalidadEnviar = "En linea"
        url = ubicacion
      }else{
        modalidadEnviar = "Presencial"
        id_ubic = verificarUbicacion(ubicacion)
      }
      const datosActividades = {
        nombre_etapa: tituloBD,
        modalidad_ubicacion: modalidadEnviar,
        id_ubicacion: id_ubic,
        fecha_hora_inicio: fechaHoraInicio,
        fecha_hora_fin: fechaHoraFin,
        url_etapa: url,
      };

      axios
        .post(`${URL_API}/guardar-etapa/${id}`, datosActividades)
        .then((response) => {
          message.success("La actividad del evento se guardó correctamente");
          form.resetFields();
          setModalActividades(false);
          setListaEtapas([]);
          setMostrarInputURL(false);
          setMostrarUbicacion(false);
          setEstadoHoraInicio(false);
          setEstadoHoraFin(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const ultimaFechaLista =
        listaEtapas[listaEtapas.length - 1].fecha_hora_fin;
      const soloFecha = ultimaFechaLista.split(" ")[0];
      if (soloFecha === fechaFinBD) {
        let mostrar = 0;
        for (let i = 0; i < listaEtapas.length; i++) {
          let datosEtapas = listaEtapas[i];
          let nuevoIdUbicacion = verificarUbicacion(datosEtapas.id_ubicacion);

          let nuevosDatosEtapas = {
            nombre_etapa: datosEtapas.nombre_etapa,
            modalidad_ubicacion: datosEtapas.modalidad_ubicacion,
            id_ubicacion: nuevoIdUbicacion,
            fecha_hora_inicio: datosEtapas.fecha_hora_inicio,
            fecha_hora_fin: datosEtapas.fecha_hora_fin,
            url_etapa: datosEtapas.url_etapa,
          };
          axios
            .post(
              `${URL_API}/guardar-etapa/${id}`,
              nuevosDatosEtapas
            )
            .then((response) => {
              mostrar++;
              if (mostrar === listaEtapas.length) {
                message.success(
                  "Las actividades del evento se guardaron correctamente"
                );
                form.resetFields();
                setModalActividades(false);
                setListaEtapas([]);
                setMostrarInputURL(false);
                setMostrarUbicacion(false);
                setEstadoHoraInicio(false);
                setEstadoHoraFin(false);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        message.error("Tiene que completar la fechas faltantes");
      }
    }
  };

  const validarMinimo = (_, value, callback) => {
    if (!value) {
      callback("");
    } else if (value.trim() !== value) {
      callback("No se permiten espacios en blanco al inicio ni al final");
    } else if (value.replace(/\s/g, "").length < 5) {
      callback("Ingrese al menos 5 caracteres");
    } else {
      callback();
    }
  };

  //validacion de caracteres permitidos en nombre de etapa
  const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚ0-9 ]+$/;
  function validarCaracteresPermitidos(_, value) {
    if (value && !caracteresPermitidos.test(value)) {
      return Promise.reject("Este campo no acepta caracteres especiales");
    }
    return Promise.resolve();
  }
  const onChangeModalidad = (e) => {
    if (e.target.value === 1) {
      // Verificar si UBICACION_ETAPA tiene un valor y borrarlo
      if (form.getFieldValue("UBICACION_ETAPA")) {
        form.setFieldValue("UBICACION_ETAPA", ""); // Establecer el valor a una cadena vacía
      }

      setMostrarInputURL(true);
      setMostrarUbicacion(false);
    } else {
      // Verificar si UBICACION_ETAPA tiene un valor y borrarlo
      if (form.getFieldValue("UBICACION_ETAPA")) {
        form.setFieldValue("UBICACION_ETAPA", ""); // Establecer el valor a una cadena vacía
      }

      setMostrarInputURL(false);
      setMostrarUbicacion(true);
    }
    setValueModalidad(e.target.value);
  };

  const handleChangeUbicaciones = (value) => {
    let idUbicacion = null;
    for (let i = 0; i < obtenerUbicaciones.length; i++) {
      if (obtenerUbicaciones[i].nombre === value) {
        idUbicacion = obtenerUbicaciones[i].id;
        break;
      }
    }

    console.log("ID de ubicación: ", idUbicacion);

    // Usa la función de devolución de llamada para realizar acciones después de la actualización del estado
    setListaUbicacion(idUbicacion);
  };

  const onChange = (value, dateString) => {
    // Verificar si dateString tiene un valor antes de intentar dividirlo
    if (dateString) {
      setFechaInicio(dateString);
      setEstadoHoraInicio(true);
    } else {
      // Si dateString es undefined, establecer las variables de estado como cadenas vacías
      setFechaFin(null);
      setHoraFin(null);
      setFechaInicio(null);
      setHoraInicio(null);
      setEstadoHoraInicio(false);
      setEstadoHoraFin(false);
      form.setFieldsValue({ HORA_INICIO: null });
      form.setFieldsValue({ HORA_FIN: null });
      form.setFieldsValue({ FECHA_FIN: null });
    }
  };

  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  const disabledDate = (current) => {
    let minDate, maxDate;
  
    if (listaEtapas.length === 0) {
      // Si no hay etapas, las fechas disponibles van desde la fecha de inicio del evento
      minDate = moment(fechaInicioBD, "YYYY-MM-DD");
      maxDate = moment(fechaFinBD, "YYYY-MM-DD");
    } else {
      // Si hay etapas, la fecha mínima es el día después de la última etapa
      const ultimaFechaLista = listaEtapas[listaEtapas.length - 1].fecha_hora_fin;
      minDate = moment(ultimaFechaLista, "YYYY-MM-DD").add(1, 'days');
      maxDate = moment(fechaFinBD, "YYYY-MM-DD");
    }
  
    // Permitir fechas dentro del rango [minDate, maxDate] inclusive
    return current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day');
  };

  const onChange2 = (value, dateString) => {
    // Verificar si dateString tiene un valor antes de intentar dividirlo
    if (dateString) {
      setFechaFin(dateString);
      console.log("la hora inicio es ", horaInicio);
      if (horaInicio === null) {
        setEstadoHoraFin(false);
      } else {
        setEstadoHoraFin(true);
      }
    } else {
      setEstadoHoraFin(false);
      setFechaFin(null);
      setHoraFin(null);
      form.setFieldsValue({ HORA_FIN: null });
    }
  };

  const onOk2 = (value) => {
    console.log("onOk: ", value);
  };

  const disabledDate2 = (current) => {
    // Verificamos si fechaInicio está vacío
    if (!fechaInicio) {
      // Si fechaInicio está vacío, deshabilitamos todas las fechas
      return true;
    }

    // Convertimos fechaInicio y fechaFinBD a objetos de Moment para la comparación
  const minDate = moment(fechaInicio, "YYYY-MM-DD");
  const maxDate = moment(fechaFinBD, "YYYY-MM-DD");

  // Comparamos si la fecha actual está antes de la fecha mínima o después de la fecha máxima
  // El uso de 'day' como segundo argumento compara solo las fechas, sin tener en cuenta la hora
  return current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day');
};

  const disabledTimeInicio = (now) => {
    const currentHour = now.hour();

    // Deshabilitar las horas antes de las 8 y después de las 20
    const disabledHours = () => {
      const hours = [];
      for (let i = 0; i < 8; i++) {
        hours.push(i);
      }
      for (let i = 21; i < 24; i++) {
        hours.push(i);
      }
      return hours;
    };

    // Deshabilitar los minutos si la hora seleccionada es 20
    const disabledMinutes = (selectedHour) => {
      if (selectedHour === 20) {
        const minutes = [];
        for (let i = 1; i < 60; i++) {
          minutes.push(i);
        }
        return minutes;
      }
      return [];
    };

    return {
      disabledHours,
      disabledMinutes,
    };
  };

  const onChangeHoraInicio = (time, timeString) => {
    console.log("LA hora es ", timeString);
    setHoraInicio(timeString);
    if (fechaFin !== null && timeString) {
      setEstadoHoraFin(true);
    } else {
      setEstadoHoraFin(false);
      form.setFieldsValue({ HORA_FIN: null });
    }
  };

  const onChangeHoraFin = (time, timeString) => {
    setHoraFin(timeString);
  };

  const disabledTimeFin = (now) => {
    if (fechaInicio === fechaFin) {
      // Convertir horaInicio a un objeto de fecha
      const newHoraInicio = moment(horaInicio, "HH:mm").add(1, "hour");
      const inicioMinutes = newHoraInicio.minutes();
      // Deshabilitar las horas antes de la nueva hora de inicio y después de las 20:00
      const disabledHours = () => {
        const hours = [];
        for (let i = 0; i < newHoraInicio.hour(); i++) {
          hours.push(i);
        }
        for (let i = 21; i < 24; i++) {
          hours.push(i);
        }
        return hours;
      };

      // Deshabilitar los minutos si la nueva hora de inicio es 20:00
      const disabledMinutes = (selectedHour) => {
        if (selectedHour === 20) {
          const minutes = [];
          for (let i = 1; i < 60; i++) {
            minutes.push(i);
          }
          return minutes;
        }
        return [];
      };

      return {
        disabledHours,
        disabledMinutes,
      };
    } else {
      // Lógica actual para fechas diferentes
      const currentHour = now.hour();
      const disabledHours = () => {
        const hours = [];
        for (let i = 0; i < 8; i++) {
          hours.push(i);
        }
        for (let i = 21; i < 24; i++) {
          hours.push(i);
        }
        return hours;
      };

      const disabledMinutes = (selectedHour) => {
        if (selectedHour === 20) {
          const minutes = [];
          for (let i = 1; i < 60; i++) {
            minutes.push(i);
          }
          return minutes;
        }
        return [];
      };

      return {
        disabledHours,
        disabledMinutes,
      };
    }
  };

  const showCancelActividad = () => {
    confirm({
      title: "¿Estás seguro de que deseas cancelar?",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: true,
      onOk() {
        setModalActividades(false);
        form.resetFields();
        setListaEtapas([]);
      },
      onCancel() {},
    });
  };

  const aniadirActividades = () => {
    const titulo = form.getFieldValue("TITULO_ETAPA");
    const modalidad = form.getFieldValue("MODALIDAD_ETAPA");
    const ubicacion = form.getFieldValue("UBICACION_ETAPA");
    const fechaInicio = form.getFieldValue("FECHA_INICIO");
    const fechaFin = form.getFieldValue("FECHA_FIN");
    const nuevaFechaInicio = fechaInicio
      ? fechaInicio.format("YYYY-MM-DD")
      : null;
    const nuevaFechaFin = fechaFin ? fechaFin.format("YYYY-MM-DD") : null;
    const modalidadNueva = modalidad === 1 ? "En linea" : "Presencial";
    // Validar que los campos obligatorios no estén vacíos
    if (!titulo || !modalidad || !ubicacion || !fechaInicio || !fechaFin) {
      // Mostrar un mensaje de error indicando campos vacíos
      message.error("Por favor, complete todos los campos obligatorios");
      return;
    }
    const fechaHoraInicio = nuevaFechaInicio + " " + horaInicio;
    const fechaHoraFin = nuevaFechaFin + " " + horafin;
    console.log("la fecha inicio es ", fechaHoraInicio);
    // Crear un nuevo objeto con la información de la etapa
    const nuevaEtapa = {
      nombre_etapa: titulo,
      modalidad_ubicacion: modalidadNueva,
      id_ubicacion: ubicacion,
      fecha_hora_inicio: fechaHoraInicio,
      fecha_hora_fin: fechaHoraFin,
      url_etapa: ubicacion,
    };
    console.log("los datos de las actividades son: ", nuevaEtapa);

    // Verificar si la etapa ya existe en la lista
    const etapaExistente = listaEtapas.find(
      (etapa) => etapa.nombre_etapa === nuevaEtapa.nombre_etapa
    );

    if (etapaExistente) {
      // Mostrar un mensaje indicando que la etapa ya existe
      message.error("La actividad ya se encuentra añadida");
    } else {
      // Actualizar el estado con la nueva lista de etapas
      setListaEtapas([...listaEtapas, nuevaEtapa]);
      form.resetFields();
      setMostrarInputURL(false);
      setMostrarUbicacion(false);
      setFechaFin(null)
      setEstadoHoraInicio(false);
      setEstadoHoraFin(false);
    }
  };

  return (
    <div>
      <div className="tabla-descripcion-editarEv">
        <p>ACTIVIDADES DE LOS EVENTOS</p>
      </div>
      <Table
        className="tabla-eventos"
        scroll={{ y: 350 }}
        dataSource={data}
        pagination={false}
        locale={{
          emptyText: (
            <div style={{ padding: "130px", textAlign: "center" }}>
              No hay datos registrados.
            </div>
          ),
        }}
      >
        <Column title="T&iacute;tulo" dataIndex="TITULO" key="titulo" />
        <Column title="Tipo" dataIndex="NOMBRE_TIPO_EVENTO" key="tipo_evento" />
        <Column title="Estado" dataIndex="ESTADO" key="estado" />
        <Column
          title="Fecha inicio"
          dataIndex="FECHA_INICIO"
          key="fecha-inicio"
        />
        <Column
          align="center"
          title="Detalles"
          key="accion"
          render={(record) => (
            <Space size="middle">
              {/* Boton para mostrar detalle  */}
              <Button type="link">
                <SettingOutlined
                  onClick={() => formularioActividades(record)}
                  style={{ fontSize: "25px", color: "#3498DB" }}
                />
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title="Actividades"
        open={modalActividades}
        onCancel={handleCancelActividades}
        centered
        width={1000}
        footer={[
          <Form form={form1} onFinish={registrarActividad}>
            <Button
              onClick={showCancelActividad}
              className="boton-cancelar-detalle"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="boton-guardar-detalle"
            >
              Guardar
            </Button>
          </Form>,
        ]}
      >
        <Form form={form} className="formEtapas" onFinish={aniadirActividades}>
          <div className="etapas-hora">
            <div className="etapas-columna1">
              <Form.Item
                label="Nombre de la actividad"
                name="TITULO_ETAPA"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese un nombre",
                  },
                  { validator: validarMinimo },
                  { validator: validarCaracteresPermitidos },
                ]}
              >
                <Input
                  minLength={5}
                  maxLength={25}
                  placeholder="Ingrese el nombre de la etapa"
                />
              </Form.Item>

              <Form.Item
                label="Modalidad"
                name="MODALIDAD_ETAPA"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione una etapa",
                  },
                ]}
              >
                <Radio.Group
                  onChange={onChangeModalidad}
                  value={valueModalidad}
                >
                  <Radio value={1}>En linea</Radio>
                  <Radio value={2}>Presencial</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Ubicación"
                name="UBICACION_ETAPA"
                className="etapa-ubicacion"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione una ubicacion",
                  },
                ]}
              >
                {mostrarUbicacion && (
                  <Select
                    allowClear
                    style={{
                      width: "100%",
                    }}
                    placeholder="Selecione una ubicación"
                    onChange={handleChangeUbicaciones}
                    options={obtenerUbicaciones}
                  />
                )}
                {mostrarInputURL && <Input maxLength={64} />}
              </Form.Item>
            </div>
            <div className="etapas-columna2">
              <div className="columna-fechas">
                <Form.Item
                  label="Fecha y hora de inicio"
                  name="FECHA_INICIO"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione una fecha",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Seleccione una fecha"
                    className="etapa-fecha"
                    format="YYYY-MM-DD"
                    onChange={onChange}
                    onOk={onOk}
                    disabledDate={disabledDate}
                    showNow={false}
                    inputReadOnly="false"
                  />
                </Form.Item>
                <Form.Item
                  label="Fecha y hora de fin"
                  name="FECHA_FIN"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione una hora",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Seleccione una fecha"
                    className="etapa-fecha"
                    format="YYYY-MM-DD"
                    onChange={onChange2}
                    onOk={onOk2}
                    disabledDate={disabledDate2}
                    showNow={false}
                    inputReadOnly="false"
                  />
                </Form.Item>
              </div>
              <div className="columna-horas">
                <Form.Item
                  name="HORA_INICIO"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione una hora",
                    },
                  ]}
                >
                  <TimePicker
                    placeholder="Hora inicio"
                    disabledTime={disabledTimeInicio}
                    onChange={onChangeHoraInicio}
                    format="HH:mm"
                    showNow={false}
                    inputReadOnly="false"
                    disabled={!estadoHoraInicio}
                  />
                </Form.Item>

                <Form.Item
                  name="HORA_FIN"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione una hora",
                    },
                  ]}
                >
                  <TimePicker
                    placeholder="Hora fin"
                    disabledTime={disabledTimeFin}
                    onChange={onChangeHoraFin}
                    format="HH:mm"
                    showNow={false}
                    inputReadOnly="false"
                    disabled={!estadoHoraFin}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  className="boton_aniadir_etapa"
                  htmlType="submit"
                >
                  Añadir actividad
                </Button>
              </div>
            </div>
          </div>

          <Table
            className="tabla-etapas"
            scroll={{ y: 180 }}
            dataSource={listaEtapas}
            pagination={false}
            locale={{
              emptyText: (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  No hay actividades registrados
                </div>
              ),
            }}
          >
            <Column title="Título" dataIndex="nombre_etapa" />
            <Column title="Fecha hora inicio" dataIndex="fecha_hora_inicio" />
            <Column title="Fecha hora fin" dataIndex="fecha_hora_fin" />
            <Column title="Ubicación" dataIndex="id_ubicacion" />
          </Table>
        </Form>
      </Modal>
    </div>
  );
}

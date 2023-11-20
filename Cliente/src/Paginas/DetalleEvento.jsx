import "../App.css";

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
  Slider,
  message,
  Upload,
  Tabs,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  SettingOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { TabPane } = Tabs;
const { Column } = Table;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function DetalleEvento() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState(1);
  const [value2, setValue2] = useState(1);
  const [value3, setValue3] = useState(1);
  const [value4, setValue4] = useState(1);
  const [value5, setValue5] = useState(1);
  const [value6, setValue6] = useState(1);
  const handleCancelIMG = () => setPreviewOpen(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [verHoraReserva, setVerHoraReserva] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [mostrarPestanias, setMostrarPestanias] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [mostrarFormICPC, setMostrarFormICPC] = useState(false);
  const [mostrarFormLibre, setMostrarFormLibre] = useState(false);
  const [mostrarFormTaller, setMostrarFormTaller] = useState(false);
  const [mostrarFormEntrenamiento, setMostrarFormEntrenamiento] =
    useState(false);
  const [mostrarFormReclutamiento, setMostrarFormReclutamiento] =
    useState(false);
  const [mostrarFormTorneo, setMostrarFormTorneo] = useState(false);
  const [mostrarFormOtro, setMostrarFormOtro] = useState(false);
  const [valueParticipacion, setValueParticipacion] = useState(1);
  const [valueModalidad, setValueModalidad] = useState(1);
  const [form] = Form.useForm();
  const [formActividades] = Form.useForm();
  const [obtenerUbicaciones, setObtenerUbicaciones] = useState([]);
  const [listaUbicacion, setListaUbicacion] = useState(null);
  const [listaEtapas, setListaEtapas] = useState([]);
  const [horaReservada, setHoraReservada] = useState(null);
  const [listaHorarios, setListaHorarios] = useState([]);
  const [fechaInicioBD, setFechaInicioBD] = useState(null);
  const [requisitos, setRequisitos] = useState([]);
  const [mostrarInputURL, setMostrarInputURL] = useState(false);
  const [mostrarUbicacion, setMostrarUbicacion] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [horafin, setHoraFin] = useState(null);
  //Kevin
  const [form2] = Form.useForm();
  //Solo permitir numeros en los input
  function onlyNumbers(event) {
    const key = event.key;

    if (!key.match(/[0-9]/)) {
      event.preventDefault();
    }
  }
  const showCancelDetalle = () => {
    confirm({
      title: "¿Estás seguro de que deseas cancelar los detalles del evento?",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: true,
      onOk() {
        setMostrarPestanias(false);
        setMostrarFormEntrenamiento(false);
        setMostrarFormICPC(false);
        setMostrarFormLibre(false);
        setMostrarFormOtro(false);
        setMostrarFormReclutamiento(false);
        setMostrarFormTaller(false);
        setMostrarFormTorneo(false);
        setListaEtapas([]);
        setHoraReservada(null);
        setFechaInicioBD(null);
        setFechaInicio(null);
        setFechaFin(null);
        setHoraInicio(null);
        setHoraFin(null);
        form.resetFields();
        formActividades.resetFields();
      },
      onCancel() {},
    });
  };
  //Guardar datos del formulario Detalle
  const registrarDetalle = (values) => {
    console.log("Lista de actividades ", listaEtapas);
    if (listaEtapas.length === 0) {
      message.error("Tiene que añadir uno o más actividades");
    } else {
      showConfirmDetalle(values);
      console.log("Los valores de los datos del detalle son ", values);
    }
  };
  //Mensaje de confirmacion al dar guardar en la parte de registro de los detalles
  const showConfirmDetalle = (values) => {
    confirm({
      title: "¿Está seguro de guardar los detalles de este evento?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        guardarDetalle(values);
      },
      onCancel() {},
    });
  };

  //Guardar DetalleEvento
  const guardarDetalle = (values) => {
    message.success("Los detalles del evento se registraron correctamente");

    navigate("/evento");
  };
  const navigate = useNavigate();
  //
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const customRequest = ({ fileList, onSuccess }) => {
    onSuccess();
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Subir documento
      </div>
    </div>
  );

  //Obtener datos de la base de datos
  useEffect(() => {
    obtenerDatos();
    obtenerListaUbicaciones();
  }, []);
  const obtenerDatos = () => {
    axios
      .get("http://localhost:8000/api/eventos-modificables")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //validar minimo
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

  //Se agrega los forms a la segunda pestaña dependiendo del tipo de evento
  const showDetalle = (record) => {
    console.log("El record es ", record.FECHA_INICIO);
    setFechaInicioBD(record.FECHA_INICIO);
    const tipoEvento = record.TIPO_EVENTO;
    console.log("El tipo de evento es ", tipoEvento);
    setMostrarPestanias(true);
    if (tipoEvento === "Competencia estilo ICPC") {
      setMostrarFormICPC(true);
    } else if (tipoEvento === "Competencia estilo libre") {
      setMostrarFormLibre(true);
    } else if (tipoEvento === "Taller de Programacion") {
      setMostrarFormTaller(true);
    } else if (tipoEvento === "Entrenamiento") {
      setMostrarFormEntrenamiento(true);
    } else if (tipoEvento === "Reclutamiento") {
      setMostrarFormReclutamiento(true);
    } else if (tipoEvento === "Torneo") {
      setMostrarFormTorneo(true);
    } else if (tipoEvento === "Otro") {
      setMostrarFormOtro(true);
    }
  };

  const onChangeICPC = (e) => {
    const requisito = e.target.value;

    // Divide los requisitos actuales en un array
    if (requisito === 1) {
      // Agrega "Código SIS" solo si no está presente
      setRequisitos((prevRequisitos) =>
        prevRequisitos.includes("- Código SIS")
          ? prevRequisitos
          : prevRequisitos + "- Código SIS"
      );
    } else if (requisito === 2) {
      // Verifica si prevRequisitos es una cadena antes de llamar a replace
      setRequisitos((prevRequisitos) => {
        if (typeof prevRequisitos === "string") {
          return prevRequisitos.replace("- Código SIS", "");
        }
        // Si prevRequisitos no es una cadena, puedes manejarlo según tus necesidades
        console.error("prevRequisitos no es una cadena:", prevRequisitos);
        return prevRequisitos;
      });
    }

    // Actualiza el valor
    setValue(e.target.value);
  };

  const onChangeLibre = (e) => {
    setValue2(e.target.value);
  };

  const onChangeTaller = (e) => {
    setValue3(e.target.value);
  };

  const onChangeEntrenamiento = (e) => {
    setValue4(e.target.value);
  };

  const onChangeTorneo = (e) => {
    setValue5(e.target.value);
  };

  const onChangeOtros = (e) => {
    setValue6(e.target.value);
  };

  const onChangeParticipacion = (e) => {
    setValueParticipacion(e.target.value);
  };
  const onChangeModalidad = (e) => {
    if (e.target.value === 1) {
      // Verificar si UBICACION_ETAPA tiene un valor y borrarlo
      if (formActividades.getFieldValue("UBICACION_ETAPA")) {
        formActividades.setFieldValue("UBICACION_ETAPA", ""); // Establecer el valor a una cadena vacía
      }

      setMostrarInputURL(true);
      setMostrarUbicacion(false);
    } else {
      // Verificar si UBICACION_ETAPA tiene un valor y borrarlo
      if (formActividades.getFieldValue("UBICACION_ETAPA")) {
        formActividades.setFieldValue("UBICACION_ETAPA", ""); // Establecer el valor a una cadena vacía
      }

      setMostrarInputURL(false);
      setMostrarUbicacion(true);
    }
    setValueModalidad(e.target.value);
  };

  // Configuración de las opciones del componente Upload
  const uploadProps = {
    name: "file",
    beforeUpload: (file) => {
      if (!isImage(file)) {
        message.error("Solo se permiten archivos de tipo (pdf)");
        return Upload.LIST_IGNORE; // Impedir la carga del archivo y no lo añade a la lista
      }
      return isImage(file); // Permitir la carga del archivo solo si es una imagen
    },
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  //Validacion de los tipos de imagenes

  const isImage = (file) => {
    const imageExtensions = ["pdf"];
    const extension = file.name.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  const mostrarHorarios = (data) => {
    // Definir la lista de horarios
    const horarios = [
      { key: 1, hora: "8:00 - 8:30 AM", estado: "Libre" },
      { key: 2, hora: "8:30 - 9:00 AM", estado: "Libre" },
      { key: 3, hora: "9:00 - 9:30 AM", estado: "Libre" },
      { key: 4, hora: "9:30 - 10:00 AM", estado: "Libre" },
      { key: 5, hora: "10:00 - 10:30 AM", estado: "Libre" },
      { key: 6, hora: "10:30 - 11:00 AM", estado: "Libre" },
      { key: 7, hora: "11:00 - 11:30 AM", estado: "Libre" },
      { key: 8, hora: "11:30 - 12:00 PM", estado: "Libre" },
      { key: 9, hora: "12:00 - 12:30 PM", estado: "Libre" },
      { key: 10, hora: "12:30 - 1:00 PM", estado: "Libre" },
      { key: 11, hora: "1:00 - 1:30 PM", estado: "Libre" },
      { key: 12, hora: "1:30 - 2:00 PM", estado: "Libre" },
      { key: 13, hora: "2:00 - 2:30 PM", estado: "Libre" },
      { key: 14, hora: "2:30 - 3:00 PM", estado: "Libre" },
      { key: 15, hora: "3:00 - 3:30 PM", estado: "Libre" },
      { key: 16, hora: "3:30 - 4:00 PM", estado: "Libre" },
      { key: 17, hora: "4:00 - 4:30 PM", estado: "Libre" },
      { key: 18, hora: "4:30 - 5:00 PM", estado: "Libre" },
      { key: 19, hora: "5:00 - 5:30 PM", estado: "Libre" },
      { key: 20, hora: "5:30 - 6:00 PM", estado: "Libre" },
      { key: 21, hora: "6:00 - 6:30 PM", estado: "Libre" },
      { key: 22, hora: "6:30 - 7:00 PM", estado: "Libre" },
      { key: 23, hora: "7:00 - 7:30 PM", estado: "Libre" },
      { key: 24, hora: "7:30 - 8:00 PM", estado: "Libre" },
    ];

    console.log("Los horarios ocupados de la base de datos son ", data.length);

    // Verificar si la lista de data está vacía
    if (data.length === 0) {
      // Si está vacía, devolver la lista completa de horarios
      setListaHorarios(horarios);
    } else {
      // Obtener la lista de horarios ocupados
      const horariosOcupados = data.map((item) => item.id_horario);

      // Filtrar la lista de horarios para excluir los ocupados
      const horariosDisponibles = horarios.filter(
        (horario) => !horariosOcupados.includes(horario.key)
      );

      // Devolver la lista filtrada
      console.log("Los horarios disponibles son ", horariosDisponibles);
      setListaHorarios(horariosDisponibles);
    }
  };

  // Puedes seguir agregando más objetos a la lista según tus necesidades

  function onChangeTabs(key) {
    setActiveTab(key);
  }

  const handleCanceDetalle = () => {
    confirm({
      title: "¿Estás seguro de que quieres cancelar?",
      icon: <ExclamationCircleFilled />,
      content: "Los cambios se perderán.",
      okText: "Si",
      cancelText: "No",
      centered: true,
      onOk() {
        setMostrarPestanias(false);
        setMostrarFormEntrenamiento(false);
        setMostrarFormICPC(false);
        setMostrarFormLibre(false);
        setMostrarFormOtro(false);
        setMostrarFormReclutamiento(false);
        setMostrarFormTaller(false);
        setMostrarFormTorneo(false);
        setFechaInicioBD(null);
        form.resetFields();
      },
      onCancel() {},
    });
  };

  /*Parte de las etapas*/

  const obtenerListaUbicaciones = () => {
    axios
      .get("http://localhost:8000/api/lista-ubicaciones")
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

  const handleChangeUbicaciones = (value) => {
    let idUbicacion = null;
    console.log("El valor de la ubicación es ", value);

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

  const aniadirEtapa = () => {
    const titulo = formActividades.getFieldValue("TITULO_ETAPA");
    const modalidad = formActividades.getFieldValue("MODALIDAD_ETAPA");
    const ubicacion = formActividades.getFieldValue("UBICACION_ETAPA");
    const fechaInicio = formActividades.getFieldValue("FECHA_INICIO");
    const fechaFin = formActividades.getFieldValue("FECHA_FIN");
    const nuevaFechaInicio = fechaInicio
      ? fechaInicio.format("YYYY-MM-DD HH:mm")
      : null;
    const nuevaFechaFin = fechaFin ? fechaFin.format("YYYY-MM-DD HH:mm") : null;

    const modalidadNueva = modalidad === 1 ? "En linea" : "Presencial";

    // Validar que los campos obligatorios no estén vacíos
    if (!titulo || !modalidad || !ubicacion || !fechaInicio || !fechaFin) {
      // Mostrar un mensaje de error indicando campos vacíos
      message.error("Por favor, complete todos los campos obligatorios");
      return;
    }
    // Crear un nuevo objeto con la información de la etapa
    const nuevaEtapa = {
      nombre_etapa: titulo,
      modalidad_ubicacion: modalidadNueva,
      id_ubicacion: ubicacion,
      fecha_inicio: nuevaFechaInicio,
      fecha_fin: nuevaFechaFin,
    };

    // Verificar si la etapa ya existe en la lista
    const etapaExistente = listaEtapas.find(
      (etapa) => etapa.nombre_etapa === nuevaEtapa.nombre_etapa
    );

    if (etapaExistente) {
      // Mostrar un mensaje indicando que la etapa ya existe
      message.error("La etapa ya se encuentra añadida");
    } else {
      // Actualizar el estado con la nueva lista de etapas
      setListaEtapas([...listaEtapas, nuevaEtapa]);
      formActividades.resetFields();
      setHoraReservada(null);
    }
  };

  const validacionFechaLimite = (current) => {
    // Obtenemos la fecha actual
    const today = new Date();

    // Establecemos la fecha mínima como 1 día antes de la fecha actual
    const minDate = new Date();
    minDate.setDate(today.getDate() - 1);

    // Establecemos la fecha máxima como fechaInicioBD - 1 día
    const maxDate = new Date(fechaInicioBD);
    maxDate.setDate(maxDate.getDate() - 0);

    // Comparamos si la fecha actual está antes de la fecha mínima o después de la fecha máxima
    return current < minDate || current > maxDate;
  };

  const insertarRequisitos = (value) => {
    if (value === "1") {
      // Si el valor es "1", quitar el texto "RUDE" si existe en requisitos
      setRequisitos((prevRequisitos) =>
        typeof prevRequisitos === "string"
          ? prevRequisitos.replace(/-?RUDE/g, "").trim()
          : prevRequisitos
      );

      // Agregar "Certificado de estudiante" al estado de requisitos
      setRequisitos((prevRequisitos) =>
        typeof prevRequisitos === "string"
          ? (prevRequisitos.endsWith("-")
              ? prevRequisitos
              : prevRequisitos + " - ") + "Certificado de estudiante"
          : "Certificado de estudiante"
      );
    } else if (value === "2") {
      // Si el valor es "2", quitar el texto "Certificado de estudiante" si existe en requisitos
      setRequisitos((prevRequisitos) =>
        typeof prevRequisitos === "string"
          ? prevRequisitos.replace(/-?Certificado de estudiante/g, "").trim()
          : prevRequisitos
      );

      // Agregar "RUDE" al estado de requisitos
      setRequisitos((prevRequisitos) =>
        typeof prevRequisitos === "string"
          ? (prevRequisitos.endsWith("-")
              ? prevRequisitos
              : prevRequisitos + " - ") + "RUDE"
          : "RUDE"
      );
    } else {
      // Verificar si hay datos en requisitos antes de realizar alguna acción
      if (requisitos) {
        // Eliminar ambos campos si existen en requisitos
        const nuevoRequisitos =
          typeof requisitos === "string"
            ? requisitos
                .replace(/-?Certificado de estudiante/g, "")
                .replace(/-?RUDE/g, "")
                .trim()
            : requisitos;
        setRequisitos(nuevoRequisitos);
      }
      // Puedes agregar más lógica aquí según sea necesario
    }
  };

  const disabledDate = (current) => {
    // Establecemos la fecha mínima como la fecha de inicio proveniente de la base de datos
    const minDate = new Date(fechaInicioBD);
    minDate.setDate(minDate.getDate());
  
    // Establecemos la fecha máxima como 180 días después de la fecha de inicio
    const maxDate = new Date(minDate);
    maxDate.setDate(maxDate.getDate() + 180);
  
    // Solo permitimos fechas dentro del rango [minDate, maxDate]
    return current < minDate || current > maxDate;
  };
  

  //4to sprint

  const onChange = (value, dateString) => {
    // Verificar si dateString tiene un valor antes de intentar dividirlo
    if (dateString) {
      var partesFecha = dateString.split(" ");

      // Almacenar la fecha y la hora en variables separadas
      var fechaInicio = partesFecha[0];
      var horaInicio = partesFecha[1];

      setFechaInicio(fechaInicio);
      setHoraInicio(horaInicio);
    } else {
      // Si dateString es undefined, establecer las variables de estado como cadenas vacías
      setFechaFin(null);
      setHoraFin(null);
      setFechaInicio(null);
      setHoraInicio(null);
      formActividades.setFieldsValue({ FECHA_FIN: null });
    }
  };

  const onChange2 = (value, dateString) => {
    // Verificar si dateString tiene un valor antes de intentar dividirlo
    if (dateString) {
      var partesFecha = dateString.split(" ");

      // Almacenar la fecha y la hora en variables separadas
      var fechaFin = partesFecha[0];
      var horaFin = partesFecha[1];

      setFechaFin(fechaFin);
      setHoraFin(horaFin);
    } else {
      console.error(
        "dateString es undefined. Asegúrate de que estás recibiendo la fecha correctamente."
      );
      setFechaFin(null);
      setHoraFin(null);
    }
  };
  const onOk = (value) => {
    console.log("onOk: ", value);
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

    // Establecemos la fecha mínima como la fecha de inicio proveniente del campo de fecha inicio
    const minDate = new Date(fechaInicio);

    // Establecemos la fecha máxima como 180 días después de la fecha actual
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 180);

    // Comparamos si la fecha actual está antes de la fecha mínima o después de la fecha máxima
    return current < minDate || current > maxDate;
  };

  const obtenerHorasHabilitadas = () => {
    const horasHabilitadas = [];
  console.log("fecha inicio es ", fechaInicio, " fecha fin es ", fechaFin)
    // Verificar si fechaInicio es igual a fechaFin
    if (fechaInicio === fechaFin) {
      if (horaInicio) {
        const horaInicioArray = horaInicio.split(":");
        const horaInicioNum = parseInt(horaInicioArray[0], 10);
  
        if (!isNaN(horaInicioNum)) {
          const horaFinBloqueo = 20; // Hora de fin del bloqueo hasta las 20:00
  
          for (let i = horaInicioNum + 1; i <= horaFinBloqueo; i++) {
            horasHabilitadas.push(i);
          }
        } else {
          console.log("La hora de inicio no es un número válido.");
        }
      } else {
        console.log("La hora de inicio no está definida. Asegúrate de establecerla correctamente.")
      }
    } else {
      // Si fechaInicio es diferente de fechaFin, habilitar las horas desde las 08:00 hasta las 20:00
      for (let i = 8; i <= 20; i++) {
        horasHabilitadas.push(i);
      }
    }
  
    return horasHabilitadas;
  };
  
  
  
  

  return (
    <div>
      {/*Apartado de la tabla de los eventos creados */}
      <div className="tabla-descripcion-editarEv">
        <p>DETALLES DE LOS EVENTOS REGISTRADOS</p>
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
        <Column title="Tipo" dataIndex="TIPO_EVENTO" key="tipo_evento" />
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
              {/* Boton para editar  */}
              <Button type="link">
                <SettingOutlined
                  onClick={() => showDetalle(record)}
                  style={{ fontSize: "25px", color: "#3498DB" }}
                />
              </Button>
            </Space>
          )}
        />
      </Table>

      {/*Modal para mostrar las pestañas */}
      <Modal
        open={mostrarPestanias}
        onCancel={handleCanceDetalle}
        width={1000}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form form={form} onFinish={registrarDetalle}>
            <Button
              onClick={showCancelDetalle}
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
        <Tabs
          onChange={onChangeTabs}
          className="pestanias"
          width={1000}
          activeKey={activeTab}
        >
          <TabPane
            tab={<span style={{ color: "black" }}>Actividades</span>}
            key="2"
            className="tab1"
          >
            <div className={`contenido ${activeTab === "1" ? "color1" : ""}`}>
              <Form
                form={formActividades}
                className="formEtapas"
                onFinish={aniadirEtapa}
              >
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
                      {mostrarInputURL && <Input></Input>}
                    </Form.Item>
                  </div>
                  <div className="etapas-columna2">
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
                        showTime={{
                          defaultValue: moment("08:00", "HH:mm"),
                          format: "HH:mm", // Muestra solo horas y minutos
                          minuteStep: 1,
                          disabledHours: () => {
                            const currentHour = new Date().getHours();
                            // Deshabilita las horas antes de las 8 y después de las 20
                            return Array.from({ length: 24 }, (_, i) =>
                              i < 8 || i > 20 ? i : null
                            );
                          },
                          disabledMinutes: (selectedHour) => {
                            // Si la hora seleccionada es 20, deshabilita los minutos que no son 00
                            if (selectedHour === 20) {
                              return Array.from({ length: 60 }, (_, i) =>
                                i !== 0 ? i : null
                              );
                            }
                          },
                        }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={onChange}
                        onOk={onOk}
                        disabledDate={disabledDate}
                        showNow={false}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Fecha y hora de fin"
                      name="FECHA_FIN"
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
                        showTime={{
                          format: "HH:mm",
                          minuteStep: 1,
                          disabledHours: () => {
                            return Array.from({ length: 24 }, (_, i) =>
                              obtenerHorasHabilitadas().indexOf(i) === -1
                                ? i
                                : null
                            );
                          },
                          disabledMinutes: (selectedHour) => {
                            if (selectedHour === 20) {
                              return Array.from({ length: 60 }, (_, i) =>
                                i !== 0 ? i : null
                              );
                            }
                          },
                        }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={onChange2}
                        onOk={onOk2}
                        disabledDate={disabledDate2}
                        showNow={false}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button className="boton_aniadir_etapa" htmlType="submit">
                        Añadir etapa
                      </Button>
                    </Form.Item>
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
                  <Column title="Fecha inicio" dataIndex="fecha_inicio" />
                  <Column title="Fecha fin" dataIndex="fecha_fin" />
                  <Column title="Ubicación" dataIndex="id_ubicacion" />
                </Table>
              </Form>
            </div>
          </TabPane>
          <TabPane
            tab={<span style={{ color: "black" }}>Detalles</span>}
            key="1"
          >
            <div className={`contenido ${activeTab === "2" ? "color2" : ""}`}>
              {mostrarFormICPC && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
                  footer={[
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        margin: "10px",
                      }}
                    >
                      <Button
                        onClick={showCancelDetalle}
                        style={{
                          margin: "10px",
                        }}
                        className="boton-cancelar-detalle"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={showConfirmDetalle}
                        htmlType="submit"
                        type="primary"
                        style={{
                          margin: "10px",
                        }}
                        className="boton-guardar-detalle"
                      >
                        Guardar
                      </Button>
                    </div>,
                  ]}
                >
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item
                        label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
                            message:
                              "Por favor, seleccione un tipo de participacion",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeParticipacion}
                          value={valueParticipacion}
                        >
                          <Radio value={1}>Grupal</Radio>
                          <Radio value={2}>Individual</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione un tipo de modalidad",
                          },
                        ]}
                      >
                        <Radio.Group onChange={onChangeICPC} value={value}>
                          <Radio value={1}>Cerrado</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        name="dirigido a"
                        className="icpc-dirigido"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione una opcion",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          onChange={insertarRequisitos}
                          options={[
                            {
                              value: "1",
                              label: "Universitarios",
                            },
                            {
                              value: "2",
                              label: "Colegios",
                            },
                            {
                              value: "3",
                              label: "Profesionales",
                            },
                            {
                              value: "4",
                              label: "Técnico",
                            },
                            {
                              value: "5",
                              label: "Todo público",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Bases del evento reglas y premios"
                        name="bases"
                      >
                        <Upload
                          {...uploadProps}
                          customRequest={customRequest}
                          listType="picture-card"
                          onPreview={handlePreview}
                          onChange={handleChange}
                          fileList={fileList}
                          maxCount={1}
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                          open={previewOpen}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancelIMG}
                        >
                          <img
                            alt="example"
                            style={{
                              width: "auto",
                              height: "300px",
                            }}
                            src={previewImage}
                          />
                        </Modal>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item label="Costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea disabled={true} value={requisitos}></TextArea>
                      </Form.Item>
                      <Table
                        className="tabla-etapas"
                        scroll={{ y: 180 }}
                        dataSource={listaEtapas}
                        pagination={false}
                        locale={{
                          emptyText: (
                            <div
                              style={{ padding: "40px", textAlign: "center" }}
                            >
                              No hay actividades registrados
                            </div>
                          ),
                        }}
                      >
                        <Column title="Título" dataIndex="nombre_etapa" />
                        <Column title="Fecha inicio" dataIndex="fecha_inicio" />
                        <Column title="Fecha fin" dataIndex="fecha_fin" />
                        <Column title="Ubicación" dataIndex="id_ubicacion" />
                      </Table>
                    </div>
                  </div>
                </Form>
              )}
              {mostrarFormLibre && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
                  footer={[
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        margin: "10px",
                      }}
                    >
                      <Button
                        onClick={showCancelDetalle}
                        style={{
                          margin: "10px",
                        }}
                        className="boton-cancelar-detalle"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={showConfirmDetalle}
                        htmlType="submit"
                        type="primary"
                        style={{
                          margin: "10px",
                        }}
                        className="boton-guardar-detalle"
                      >
                        Guardar
                      </Button>
                    </div>,
                  ]}
                >
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item
                        label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione un tipo de participacion",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeParticipacion}
                          value={valueParticipacion}
                        >
                          <Radio value={1}>Grupal</Radio>
                          <Radio value={2}>Individual</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione un tipo de modalidad",
                          },
                        ]}
                      >
                        <Radio.Group onChange={onChangeLibre} value={value2}>
                          <Radio value={1}>Cerrado</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione una opcion",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Universitarios",
                            },
                            {
                              value: "2",
                              label: "Colegio",
                            },
                            {
                              value: "3",
                              label: "Profesionales",
                            },
                            {
                              value: "4",
                              label: "Técnico",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Bases del evento reglas y premios"
                        name="bases"
                      >
                        <Upload
                          {...uploadProps}
                          customRequest={customRequest}
                          listType="picture-card"
                          onPreview={handlePreview}
                          onChange={handleChange}
                          fileList={fileList}
                          maxCount={1}
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                          open={previewOpen}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancelIMG}
                        >
                          <img
                            alt="example"
                            style={{
                              width: "auto",
                              height: "300px",
                            }}
                            src={previewImage}
                          />
                        </Modal>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item label="Costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea showCount></TextArea>
                      </Form.Item>
                      <Form.Item label="Cronograma" labelCol={{ span: 24 }}>
                        <Table
                          //dataSource={horarios}
                          pagination={false}
                          locale={{
                            emptyText: (
                              <div
                                style={{ padding: "30px", textAlign: "center" }}
                              >
                                No hay etapas
                              </div>
                            ),
                          }}
                        >
                          <Column title="Etapa" dataIndex="etapa" key="etapa" />
                          <Column
                            title="Ubicación"
                            dataIndex="ubicacion"
                            key="ubicacion"
                          />
                          <Column
                            title="Horario"
                            dataIndex="horario"
                            key="horario"
                          />
                        </Table>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              )}
              {mostrarFormTaller && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
                  footer={[
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        margin: "10px",
                      }}
                    >
                      <Button
                        onClick={showCancelDetalle}
                        style={{
                          margin: "10px",
                        }}
                        className="boton-cancelar-detalle"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={showConfirmDetalle}
                        htmlType="submit"
                        type="primary"
                        style={{
                          margin: "10px",
                        }}
                        className="boton-guardar-detalle"
                      >
                        Guardar
                      </Button>
                    </div>,
                  ]}
                >
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item
                        label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione un tipo de participacion",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeParticipacion}
                          value={valueParticipacion}
                        >
                          <Radio value={1}>Grupal</Radio>
                          <Radio value={2}>Individual</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione un tipo de modalidad",
                          },
                        ]}
                      >
                        <Radio.Group onChange={onChangeTaller} value={value3}>
                          <Radio value={1}>Cerrado</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Facilitador"
                        className="icpc-dirigido"
                        name="facilitador"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione un facilitador",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Santos",
                            },
                            {
                              value: "2",
                              label: "Simon",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione una opcion",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Universitarios",
                            },
                            {
                              value: "2",
                              label: "Colegio",
                            },
                            {
                              value: "3",
                              label: "Profesionales",
                            },
                            {
                              value: "4",
                              label: "Técnico",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item label="Contenido del taller">
                        <Upload
                          {...uploadProps}
                          customRequest={customRequest}
                          listType="picture-card"
                          onPreview={handlePreview}
                          onChange={handleChange}
                          fileList={fileList}
                          maxCount={1}
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                          open={previewOpen}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancelIMG}
                        >
                          <img
                            alt="example"
                            style={{
                              width: "auto",
                              height: "300px",
                            }}
                            src={previewImage}
                          />
                        </Modal>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item label="Costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea showCount></TextArea>
                      </Form.Item>
                      <Form.Item label="Cronograma" labelCol={{ span: 24 }}>
                        <Table
                          //dataSource={horarios}
                          pagination={false}
                          locale={{
                            emptyText: (
                              <div
                                style={{ padding: "30px", textAlign: "center" }}
                              >
                                No hay etapas
                              </div>
                            ),
                          }}
                        >
                          <Column title="Etapa" dataIndex="etapa" key="etapa" />
                          <Column
                            title="Ubicación"
                            dataIndex="ubicacion"
                            key="ubicacion"
                          />
                          <Column
                            title="Horario"
                            dataIndex="horario"
                            key="horario"
                          />
                        </Table>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              )}
              {mostrarFormEntrenamiento && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
                  footer={[
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        margin: "10px",
                      }}
                    >
                      <Button
                        onClick={showCancelDetalle}
                        style={{
                          margin: "10px",
                        }}
                        className="boton-cancelar-detalle"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={showConfirmDetalle}
                        htmlType="submit"
                        type="primary"
                        style={{
                          margin: "10px",
                        }}
                        className="boton-guardar-detalle"
                      >
                        Guardar
                      </Button>
                    </div>,
                  ]}
                >
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item
                        label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione un tipo de participacion",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeParticipacion}
                          value={valueParticipacion}
                        >
                          <Radio value={1}>Grupal</Radio>
                          <Radio value={2}>Individual</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione un tipo de modalidad",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeEntrenamiento}
                          value={value5}
                        >
                          <Radio value={1}>Cerrado</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Entrenador"
                        className="icpc-dirigido"
                        name="entrenador"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione un entrenador",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Santos",
                            },
                            {
                              value: "2",
                              label: "Simon",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione una opcion",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Universitarios",
                            },
                            {
                              value: "2",
                              label: "Colegio",
                            },
                            {
                              value: "3",
                              label: "Profesionales",
                            },
                            {
                              value: "4",
                              label: "Técnico",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item label="Contenido del entrenamiento">
                        <Upload
                          {...uploadProps}
                          customRequest={customRequest}
                          listType="picture-card"
                          onPreview={handlePreview}
                          onChange={handleChange}
                          fileList={fileList}
                          maxCount={1}
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                          open={previewOpen}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancelIMG}
                        >
                          <img
                            alt="example"
                            style={{
                              width: "auto",
                              height: "300px",
                            }}
                            src={previewImage}
                          />
                        </Modal>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item label="Costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea showCount></TextArea>
                      </Form.Item>
                      <Form.Item label="Cronograma" labelCol={{ span: 24 }}>
                        <Table
                          //dataSource={horarios}
                          pagination={false}
                          locale={{
                            emptyText: (
                              <div
                                style={{ padding: "30px", textAlign: "center" }}
                              >
                                No hay etapas
                              </div>
                            ),
                          }}
                        >
                          <Column title="Etapa" dataIndex="etapa" key="etapa" />
                          <Column
                            title="Ubicación"
                            dataIndex="ubicacion"
                            key="ubicacion"
                          />
                          <Column
                            title="Horario"
                            dataIndex="horario"
                            key="horario"
                          />
                        </Table>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              )}
              {mostrarFormReclutamiento && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
                  footer={[
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        margin: "10px",
                      }}
                    >
                      <Button
                        onClick={showCancelDetalle}
                        style={{
                          margin: "10px",
                        }}
                        className="boton-cancelar-detalle"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={showConfirmDetalle}
                        htmlType="submit"
                        type="primary"
                        style={{
                          margin: "10px",
                        }}
                        className="boton-guardar-detalle"
                      >
                        Guardar
                      </Button>
                    </div>,
                  ]}
                >
                  <div className="form-reclutamiento">
                    <div className="columna1-reclutamiento">
                      <Form.Item
                        label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione una modalidad",
                          },
                        ]}
                      >
                        <Radio.Group onChange={onChangeTorneo} value={value4}>
                          <Radio value={1}>Cerrado</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione una opcion",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Universitarios",
                            },
                            {
                              value: "2",
                              label: "Colegio",
                            },
                            {
                              value: "3",
                              label: "Profesionales",
                            },
                            {
                              value: "4",
                              label: "Técnico",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea showCount></TextArea>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        label="Facilitador"
                        name="facilitador"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione un facilitador",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Universitarios",
                            },
                            {
                              value: "2",
                              label: "Colegio",
                            },
                            {
                              value: "3",
                              label: "Profesionales",
                            },
                            {
                              value: "4",
                              label: "Técnico",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item label="Cronograma" labelCol={{ span: 24 }}>
                        <Table
                          //dataSource={horarios}
                          pagination={false}
                          locale={{
                            emptyText: (
                              <div
                                style={{ padding: "30px", textAlign: "center" }}
                              >
                                No hay etapas
                              </div>
                            ),
                          }}
                        >
                          <Column title="Etapa" dataIndex="etapa" key="etapa" />
                          <Column
                            title="Ubicación"
                            dataIndex="ubicacion"
                            key="ubicacion"
                          />
                          <Column
                            title="Horario"
                            dataIndex="horario"
                            key="horario"
                          />
                        </Table>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              )}
              {mostrarFormTorneo && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
                  footer={[
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        margin: "10px",
                      }}
                    >
                      <Button
                        onClick={showCancelDetalle}
                        style={{
                          margin: "10px",
                        }}
                        className="boton-cancelar-detalle"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={showConfirmDetalle}
                        htmlType="submit"
                        type="primary"
                        style={{
                          margin: "10px",
                        }}
                        className="boton-guardar-detalle"
                      >
                        Guardar
                      </Button>
                    </div>,
                  ]}
                >
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item
                        label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione un tipo de participacion",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeParticipacion}
                          value={valueParticipacion}
                        >
                          <Radio value={1}>Grupal</Radio>
                          <Radio value={2}>Individual</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione una modalidad",
                          },
                        ]}
                      >
                        <Radio.Group onChange={onChangeTorneo} value={value5}>
                          <Radio value={1}>Cerrado</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione una opcion",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Universitarios",
                            },
                            {
                              value: "2",
                              label: "Colegio",
                            },
                            {
                              value: "3",
                              label: "Profesionales",
                            },
                            {
                              value: "4",
                              label: "Técnico",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Bases del evento reglas y premios"
                        name="bases"
                      >
                        <Upload
                          {...uploadProps}
                          customRequest={customRequest}
                          listType="picture-card"
                          onPreview={handlePreview}
                          onChange={handleChange}
                          fileList={fileList}
                          maxCount={1}
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                          open={previewOpen}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancelIMG}
                        >
                          <img
                            alt="example"
                            style={{
                              width: "auto",
                              height: "300px",
                            }}
                            src={previewImage}
                          />
                        </Modal>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item label="Costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea></TextArea>
                      </Form.Item>
                      <Form.Item label="Cronograma" labelCol={{ span: 24 }}>
                        <Table
                          //dataSource={horarios}
                          pagination={false}
                          locale={{
                            emptyText: (
                              <div
                                style={{ padding: "30px", textAlign: "center" }}
                              >
                                No hay etapas
                              </div>
                            ),
                          }}
                        >
                          <Column title="Etapa" dataIndex="etapa" key="etapa" />
                          <Column
                            title="Ubicación"
                            dataIndex="ubicacion"
                            key="ubicacion"
                          />
                          <Column
                            title="Horario"
                            dataIndex="horario"
                            key="horario"
                          />
                        </Table>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              )}
              {mostrarFormOtro && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
                  footer={[
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        margin: "10px",
                      }}
                    >
                      <Button
                        onClick={showCancelDetalle}
                        style={{
                          margin: "10px",
                        }}
                        className="boton-cancelar-detalle"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={showConfirmDetalle}
                        htmlType="submit"
                        type="primary"
                        style={{
                          margin: "10px",
                        }}
                        className="boton-guardar-detalle"
                      >
                        Guardar
                      </Button>
                    </div>,
                  ]}
                >
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item
                        label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
                            message:
                              "Por favor, seleccione un tipo de participacion",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeParticipacion}
                          value={valueParticipacion}
                        >
                          <Radio value={1}>Grupal</Radio>
                          <Radio value={2}>Individual</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                            message:
                              "Por favor, seleccione un tipo de modalidad",
                          },
                        ]}
                      >
                        <Radio.Group onChange={onChangeOtros} value={value6}>
                          <Radio value={1}>Cerrado</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Responsable"
                        className="icpc-dirigido"
                        name="responsable"
                        rules={[
                          {
                            required: true,
                            message: "Porfavor, seleccione un responsable",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Santos",
                            },
                            {
                              value: "2",
                              label: "Simon",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione una opcion",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          options={[
                            {
                              value: "1",
                              label: "Universitarios",
                            },
                            {
                              value: "2",
                              label: "Colegio",
                            },
                            {
                              value: "3",
                              label: "Profesionales",
                            },
                            {
                              value: "4",
                              label: "Técnico",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item label="Contenido del evento">
                        <Upload
                          {...uploadProps}
                          customRequest={customRequest}
                          listType="picture-card"
                          onPreview={handlePreview}
                          onChange={handleChange}
                          fileList={fileList}
                          maxCount={1}
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                          open={previewOpen}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancelIMG}
                        >
                          <img
                            alt="example"
                            style={{
                              width: "auto",
                              height: "300px",
                            }}
                            src={previewImage}
                          />
                        </Modal>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item label="Costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea showCount></TextArea>
                      </Form.Item>
                      <Form.Item label="Cronograma" labelCol={{ span: 24 }}>
                        <Table
                          //dataSource={horarios}
                          pagination={false}
                          locale={{
                            emptyText: (
                              <div
                                style={{ padding: "30px", textAlign: "center" }}
                              >
                                No hay etapas
                              </div>
                            ),
                          }}
                        >
                          <Column title="Etapa" dataIndex="etapa" key="etapa" />
                          <Column
                            title="Ubicación"
                            dataIndex="ubicacion"
                            key="ubicacion"
                          />
                          <Column
                            title="Horario"
                            dataIndex="horario"
                            key="horario"
                          />
                        </Table>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

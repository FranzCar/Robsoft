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
  TimePicker,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  SettingOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";

const { TabPane } = Tabs;
const { Column } = Table;
const { confirm } = Modal;
const formatoHora = "HH:mm";
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
  const [valueEntrenador, setValueEntrenador] = useState(1);
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
  const [requisitos, setRequisitos] = useState("");
  const [mostrarInputURL, setMostrarInputURL] = useState(false);
  const [mostrarUbicacion, setMostrarUbicacion] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [horafin, setHoraFin] = useState(null);
  const [idEvento, setIdEvento] = useState(null);
  const [listaFacilitadores, setListaFacilitadores] = useState([]);
  const [estadoHoraInicio, setEstadoHoraInicio] = useState(false);
  const [estadoHoraFin, setEstadoHoraFin] = useState(false);
  const [estadoEntrenador, setEstadoEntrenador] = useState(false);
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
        setFileList([]);
        setHoraReservada(null);
        setFechaInicioBD(null);
        setFechaInicio(null);
        setFechaFin(null);
        setHoraInicio(null);
        setHoraFin(null);
        setMostrarInputURL(false);
        setMostrarUbicacion(false);
        form.resetFields();
        formActividades.resetFields();
      },
      onCancel() {},
    });
  };

  const verificarCategoria = (categoria) => {
    if (categoria === "1") return "Universitarios";
    if (categoria === "2") return "Colegios";
    if (categoria === "3") return "Profesionales";
    if (categoria === "4") return "Técnico";
  };

  //Guardar datos del formulario Detalle
  const registrarDetalle = async (values) => {
    showConfirmDetalle(values);
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
        guardarDetalles(values, idEvento);
      },
      onCancel() {},
    });
  };

  const verificarUbicacion = (ubicacion) => {
    if (ubicacion === "Auditorio 1") return 1;
    if (ubicacion === "Auditorio 2") return 2;
    if (ubicacion === "Laboratorio 1") return 3;
    if (ubicacion === "Laboratorio 2") return 4;
    if (ubicacion === "Laboratorio 3") return 5;
    if (ubicacion === "Laboratorio 4") return 6;
  };

  //Guardamos los detalles del evento y las actividades q se tiene
  const guardarDetalles = async (values, id) => {
    console.log("Lista de actividades ", listaEtapas);
    console.log("detalles del formulario ", values);
    if (listaEtapas.length === 0) {
      message.error("Tiene que añadir uno o más actividades");
    } else {
      //Obtenemos los datos de los formularios
      const formModalidad = form.getFieldValue("modalidad");
      const formParticipacion = form.getFieldValue("participacion");
      const formCategoria = form.getFieldValue("categoria");
      const formCosto = form.getFieldValue("costo");
      const formCupos = form.getFieldValue("cupos");
      const formRequisitos = form.getFieldValue("requisitos");
      const formEntrenador = form.getFieldValue("entrenador");

      let base64Image = null;
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        base64Image = await getBase64(file); // Convertir el archivo a Base64
      }
      // le damos el valor que se requiere guardar dependiendo del dato del formulario
      let modalidad = formModalidad === 1 ? "Cerrado" : "Abierto";
      let participacion = formParticipacion === 1 ? "Grupal" : "Individual";
      let categoria = verificarCategoria(formCategoria);
      let costoNuevo = parseFloat(formCosto);
      console.log("el formato del costo es ", costoNuevo);
      let entrenador = formEntrenador === 1 ? true : false;
      const datos = {
        caracteristica_1: modalidad,
        caracteristica_2: participacion,
        caracteristica_3: categoria,
        caracteristica_4: costoNuevo,
        caracteristica_6: formCupos,
        caracteristica_7: base64Image,
        caracteristica_8: formRequisitos,
        caracteristica_10: entrenador,
      };
      console.log("Los datos a enviar a la base de datos son ", datos);

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
            `http://localhost:8000/api/guardar-etapa/${id}`,
            nuevosDatosEtapas
          )
          .then((response) => {})
          .catch((error) => {
            console.log(error);
          });
      }

      axios
        .post(`http://localhost:8000/api/detallar-evento/${id}`, datos)
        .then((response) => {
          message.success("Los detalles del evento se guardo correctamente");
          obtenerDatos();
          setMostrarPestanias(false);
          setMostrarFormEntrenamiento(false);
          setMostrarFormICPC(false);
          setMostrarFormLibre(false);
          setMostrarFormOtro(false);
          setMostrarFormReclutamiento(false);
          setMostrarFormTaller(false);
          setMostrarFormTorneo(false);
          setListaEtapas([]);
          setFileList([]);
          setHoraReservada(null);
          setFechaInicioBD(null);
          setFechaInicio(null);
          setFechaFin(null);
          setHoraInicio(null);
          setHoraFin(null);
          setMostrarInputURL(false);
          setMostrarUbicacion(false);
          form.resetFields();
          formActividades.resetFields();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

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
    obtenerListaFacilitadores();
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
    console.log("El record es ", record);
    setFechaInicioBD(record.FECHA_INICIO);
    setIdEvento(record.id_evento);
    const tipoEvento = record.TIPO_EVENTO;
    setMostrarPestanias(true);
    if (tipoEvento === 1) {
      setMostrarFormICPC(true);
    } else if (tipoEvento === 2) {
      setMostrarFormLibre(true);
    } else if (tipoEvento === 3) {
      setMostrarFormTaller(true);
    } else if (tipoEvento === 4) {
      setMostrarFormEntrenamiento(true);
    } else if (tipoEvento === 5) {
      setMostrarFormReclutamiento(true);
    } else if (tipoEvento === 6) {
      setMostrarFormTorneo(true);
    } else if (tipoEvento === 7) {
      setMostrarFormOtro(true);
    }
  };

  const onChangeICPC = (e) => {
    const requisito = e.target.value;
    const valorAnterior = form.getFieldValue("requisitos");
    if (valorAnterior === undefined) {
      if (requisito === 1) {
        form.setFieldValue("requisitos", "- Código SIS");
      } else {
        form.resetFields(["requisitos"]);
      }
    } else {
      if (valorAnterior.includes("- Certificado de estudiante")) {
        if (requisito === 1) {
          form.setFieldValue(
            "requisitos",
            "- Código SIS - Certificado de estudiante"
          );
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- Certificado de estudiante");
        }
      } else if (valorAnterior.includes("- RUDE")) {
        if (requisito === 1) {
          form.setFieldValue("requisitos", "- Código SIS - RUDE");
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- RUDE");
        }
      } else {
        form.resetFields(["requisitos"]);
      }
    }

    // Actualiza el valor del Radio.Group
    setValue(e.target.value);
  };

  const onChangeLibre = (e) => {
    const requisito = e.target.value;
    const valorAnterior = form.getFieldValue("requisitos");
    if (valorAnterior === undefined) {
      if (requisito === 1) {
        form.setFieldValue("requisitos", "- Código SIS");
      } else {
        form.resetFields(["requisitos"]);
      }
    } else {
      if (valorAnterior.includes("- Certificado de estudiante")) {
        if (requisito === 1) {
          form.setFieldValue(
            "requisitos",
            "- Código SIS - Certificado de estudiante"
          );
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- Certificado de estudiante");
        }
      } else if (valorAnterior.includes("- RUDE")) {
        if (requisito === 1) {
          form.setFieldValue("requisitos", "- Código SIS - RUDE");
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- RUDE");
        }
      } else {
        form.resetFields(["requisitos"]);
      }
    }

    setValue2(e.target.value);
  };

  const onChangeTaller = (e) => {
    const requisito = e.target.value;
    const valorAnterior = form.getFieldValue("requisitos");
    if (valorAnterior === undefined) {
      if (requisito === 1) {
        form.setFieldValue("requisitos", "- Código SIS");
      } else {
        form.resetFields(["requisitos"]);
      }
    } else {
      if (valorAnterior.includes("- Certificado de estudiante")) {
        if (requisito === 1) {
          form.setFieldValue(
            "requisitos",
            "- Código SIS - Certificado de estudiante"
          );
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- Certificado de estudiante");
        }
      } else if (valorAnterior.includes("- RUDE")) {
        if (requisito === 1) {
          form.setFieldValue("requisitos", "- Código SIS - RUDE");
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- RUDE");
        }
      } else {
        form.resetFields(["requisitos"]);
      }
    }

    setValue3(e.target.value);
  };

  const onChangeEntrenamiento = (e) => {
    const requisito = e.target.value;
    const valorAnterior = form.getFieldValue("requisitos");
    if (valorAnterior === undefined) {
      if (requisito === 1) {
        form.setFieldValue("requisitos", "- Código SIS");
      } else {
        form.resetFields(["requisitos"]);
      }
    } else {
      if (valorAnterior.includes("- Certificado de estudiante")) {
        if (requisito === 1) {
          form.setFieldValue(
            "requisitos",
            "- Código SIS - Certificado de estudiante"
          );
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- Certificado de estudiante");
        }
      } else if (valorAnterior.includes("- RUDE")) {
        if (requisito === 1) {
          form.setFieldValue("requisitos", "- Código SIS - RUDE");
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- RUDE");
        }
      } else {
        form.resetFields(["requisitos"]);
      }
    }

    setValue4(e.target.value);
  };

  const onChangeTorneo = (e) => {
    const requisito = e.target.value;
    const valorAnterior = form.getFieldValue("requisitos");
    if (valorAnterior === undefined) {
      if (requisito === 1) {
        form.setFieldValue("requisitos", "- Código SIS");
      } else {
        form.resetFields(["requisitos"]);
      }
    } else {
      if (valorAnterior.includes("- Certificado de estudiante")) {
        if (requisito === 1) {
          form.setFieldValue(
            "requisitos",
            "- Código SIS - Certificado de estudiante"
          );
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- Certificado de estudiante");
        }
      } else if (valorAnterior.includes("- RUDE")) {
        if (requisito === 1) {
          form.setFieldValue("requisitos", "- Código SIS - RUDE");
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- RUDE");
        }
      } else {
        form.resetFields(["requisitos"]);
      }
    }

    setValue5(e.target.value);
  };

  const onChangeOtros = (e) => {
    const requisito = e.target.value;
    const valorAnterior = form.getFieldValue("requisitos");
    if (valorAnterior === undefined) {
      if (requisito === 1) {
        form.setFieldValue("requisitos", "- Código SIS");
      } else {
        form.resetFields(["requisitos"]);
      }
    } else {
      if (valorAnterior.includes("- Certificado de estudiante")) {
        if (requisito === 1) {
          form.setFieldValue(
            "requisitos",
            "- Código SIS - Certificado de estudiante"
          );
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- Certificado de estudiante");
        }
      } else if (valorAnterior.includes("- RUDE")) {
        if (requisito === 1) {
          form.setFieldValue("requisitos", "- Código SIS - RUDE");
        } else if (requisito === 2) {
          form.setFieldValue("requisitos", "- RUDE");
        }
      } else {
        form.resetFields(["requisitos"]);
      }
    }

    setValue6(e.target.value);
  };

  const onChangeParticipacion = (e) => {
    const participacion = e.target.value;
    if (participacion === 1) {
      setEstadoEntrenador(true);
    } else {
      setEstadoEntrenador(false);
      form.resetFields(["entrenador"]);
    }
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

  const onChangeEntrenador = (e) => {
    setValueEntrenador(e.target.value);
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
      message.error("La etapa ya se encuentra añadida");
    } else {
      // Actualizar el estado con la nueva lista de etapas
      setListaEtapas([...listaEtapas, nuevaEtapa]);
      formActividades.resetFields();
      setMostrarInputURL(false);
      setMostrarUbicacion(false);
      setEstadoHoraInicio(false);
      setEstadoHoraFin(false);
    }
  };

  const insertarRequisitos = (value) => {
    const valorAnterior = form.getFieldValue("requisitos");

    if (valorAnterior === undefined) {
      if (value === "1") {
        form.setFieldValue("requisitos", "- Certificado de estudiante");
      } else if (value === "2") {
        form.setFieldValue("requisitos", "- RUDE");
      }
    } else {
      // Reemplaza la comparación con includes
      if (valorAnterior.includes("- Código SIS")) {
        if (value === "1") {
          form.setFieldValue(
            "requisitos",
            "- Código SIS - Certificado de estudiante"
          );
        } else if (value === "2") {
          form.setFieldValue("requisitos", "- Código SIS - RUDE");
        } else {
          form.setFieldValue("requisitos", "- Código SIS");
        }
      } else {
        if (value === "1") {
          form.setFieldValue("requisitos", "- Certificado de estudiante");
        } else if (value === "2") {
          form.setFieldValue("requisitos", "- RUDE");
        } else {
          // Lógica adicional si es necesario
        }
      }
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
      formActividades.setFieldsValue({ HORA_INICIO: null });
      formActividades.setFieldsValue({ HORA_FIN: null });
      formActividades.setFieldsValue({ FECHA_FIN: null });
    }
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
      formActividades.setFieldsValue({ HORA_FIN: null });
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

  const obtenerListaFacilitadores = () => {
    axios
      .get("http://localhost:8000/api/lista-facilitadores")
      .then((response) => {
        const listaConFormato = response.data.map((element) => ({
          id: element.id_rol_persona,
          nombre: element.nombre,
          value: element.nombre,
          label: element.nombre,
        }));
        setListaFacilitadores(listaConFormato);
      })
      .catch((error) => {
        console.error(error);
      });
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
      formActividades.setFieldsValue({ HORA_FIN: null });
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
        footer={null}
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
                        Añadir etapa
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
                  <Column title="Fecha inicio" dataIndex="fecha_hora_inicio" />
                  <Column title="Fecha fin" dataIndex="fecha_hora_fin" />
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
                        label="Entrenador requerido"
                        name="entrenador"
                        rules={[
                          {
                            required: estadoEntrenador,
                            message: "Por favor, seleccione una opción",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeEntrenador}
                          value={valueEntrenador}
                          disabled={!estadoEntrenador}
                        >
                          <Radio value={1}>Si</Radio>
                          <Radio value={2}>No</Radio>
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
                        name="categoria"
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
                    </div>
                    <div>
                      <Form.Item label="Costo" name="costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos" name="cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos" name="requisitos">
                        <TextArea value={requisitos} readOnly></TextArea>
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
                    <Column
                      title="Fecha inicio"
                      dataIndex="fecha_hora_inicio"
                    />
                    <Column title="Fecha fin" dataIndex="fecha_hora_fin" />
                    <Column title="Ubicación" dataIndex="id_ubicacion" />
                  </Table>
                  <div className="botones-detalle">
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
                  </div>
                </Form>
              )}
              {mostrarFormLibre && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
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
                        label="Entrenador requerido"
                        name="entrenador"
                        rules={[
                          {
                            required: estadoEntrenador,
                            message: "Por favor, seleccione una opción",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeEntrenador}
                          value={valueEntrenador}
                          disabled={!estadoEntrenador}
                        >
                          <Radio value={1}>Si</Radio>
                          <Radio value={2}>No</Radio>
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
                        name="categoria"
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
                    </div>
                    <div>
                      <Form.Item label="Costo" name="costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos" name="cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos" name="requisitos">
                        <TextArea value={requisitos} readOnly></TextArea>
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
                    <Column
                      title="Fecha inicio"
                      dataIndex="fecha_hora_inicio"
                    />
                    <Column title="Fecha fin" dataIndex="fecha_hora_fin" />
                    <Column title="Ubicación" dataIndex="id_ubicacion" />
                  </Table>
                  <div className="botones-detalle">
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
                  </div>
                </Form>
              )}
              {mostrarFormTaller && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
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
                        label="Entrenador requerido"
                        name="entrenador"
                        rules={[
                          {
                            required: estadoEntrenador,
                            message: "Por favor, seleccione una opción",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeEntrenador}
                          value={valueEntrenador}
                          disabled={!estadoEntrenador}
                        >
                          <Radio value={1}>Si</Radio>
                          <Radio value={2}>No</Radio>
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
                          placeholder="Seleccione un facilitador"
                          options={listaFacilitadores}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="categoria"
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
                    </div>
                    <div>
                      <Form.Item label="Costo" name="costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos" name="cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos" name="requisitos">
                        <TextArea value={requisitos} readOnly></TextArea>
                      </Form.Item>
                      <Form.Item label="Contenido del taller" name="bases">
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
                    <Column
                      title="Fecha inicio"
                      dataIndex="fecha_hora_inicio"
                    />
                    <Column title="Fecha fin" dataIndex="fecha_hora_fin" />
                    <Column title="Ubicación" dataIndex="id_ubicacion" />
                  </Table>
                  <div className="botones-detalle">
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
                  </div>
                </Form>
              )}
              {mostrarFormEntrenamiento && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
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
                        label="Entrenador requerido"
                        name="entrenador"
                        rules={[
                          {
                            required: estadoEntrenador,
                            message: "Por favor, seleccione una opción",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeEntrenador}
                          value={valueEntrenador}
                          disabled={!estadoEntrenador}
                        >
                          <Radio value={1}>Si</Radio>
                          <Radio value={2}>No</Radio>
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
                        name="facilitador"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione un entrenador",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          placeholder="Seleccione un entrenador"
                          options={listaFacilitadores}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="categoria"
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
                    </div>
                    <div>
                      <Form.Item label="Costo" name="costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos" name="cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos" name="requisitos">
                        <TextArea value={requisitos} readOnly></TextArea>
                      </Form.Item>
                      <Form.Item
                        label="Contenido del entrenamiento"
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
                    <Column
                      title="Fecha inicio"
                      dataIndex="fecha_hora_inicio"
                    />
                    <Column title="Fecha fin" dataIndex="fecha_hora_fin" />
                    <Column title="Ubicación" dataIndex="id_ubicacion" />
                  </Table>
                  <div className="botones-detalle">
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
                  </div>
                </Form>
              )}
              {mostrarFormReclutamiento && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
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
                        name="categoria"
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
                          placeholder="Seleccione un facilitador"
                          options={listaFacilitadores}
                        />
                      </Form.Item>
                      <Form.Item label="Requisitos" name="requisitos">
                        <TextArea value={requisitos} readOnly></TextArea>
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
                    <Column
                      title="Fecha inicio"
                      dataIndex="fecha_hora_inicio"
                    />
                    <Column title="Fecha fin" dataIndex="fecha_hora_fin" />
                    <Column title="Ubicación" dataIndex="id_ubicacion" />
                  </Table>
                  <div className="botones-detalle">
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
                  </div>
                </Form>
              )}
              {mostrarFormTorneo && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
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
                        label="Entrenador requerido"
                        name="entrenador"
                        rules={[
                          {
                            required: estadoEntrenador,
                            message: "Por favor, seleccione una opción",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeEntrenador}
                          value={valueEntrenador}
                          disabled={!estadoEntrenador}
                        >
                          <Radio value={1}>Si</Radio>
                          <Radio value={2}>No</Radio>
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
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="categoria"
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
                      <Form.Item label="Costo" name="costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos" name="cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos" name="requisitos">
                        <TextArea value={requisitos} readOnly></TextArea>
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
                    <Column
                      title="Fecha inicio"
                      dataIndex="fecha_hora_inicio"
                    />
                    <Column title="Fecha fin" dataIndex="fecha_hora_fin" />
                    <Column title="Ubicación" dataIndex="id_ubicacion" />
                  </Table>
                  <div className="botones-detalle">
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
                  </div>
                </Form>
              )}
              {mostrarFormOtro && (
                <Form
                  className="form-ICPC"
                  form={form}
                  onFinish={registrarDetalle}
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
                        label="Entrenador requerido"
                        name="entrenador"
                        rules={[
                          {
                            required: estadoEntrenador,
                            message: "Por favor, seleccione una opción",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeEntrenador}
                          value={valueEntrenador}
                          disabled={!estadoEntrenador}
                        >
                          <Radio value={1}>Si</Radio>
                          <Radio value={2}>No</Radio>
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

                      <Form.Item label="Contenido del evento" name="contenido">
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
                      <Form.Item
                        label="Responsable"
                        className="icpc-dirigido"
                        name="facilitador"
                        rules={[
                          {
                            required: true,
                            message: "Porfavor, seleccione un responsable",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          placeholder="Seleccione un facilitador"
                          options={listaFacilitadores}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Dirigido a"
                        className="icpc-dirigido"
                        name="categoria"
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
                      <Form.Item label="Costo" name="costo">
                        <Input
                          placeholder="Ingrese el costo"
                          onKeyPress={onlyNumbers}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos" name="cupos">
                        <Slider min={20} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos" name="requisitos">
                        <TextArea value={requisitos} readOnly></TextArea>
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
                    <Column
                      title="Fecha inicio"
                      dataIndex="fecha_hora_inicio"
                    />
                    <Column title="Fecha fin" dataIndex="fecha_hora_fin" />
                    <Column title="Ubicación" dataIndex="id_ubicacion" />
                  </Table>
                  <div className="botones-detalle">
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

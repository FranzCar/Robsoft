import "../App.css";
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Col,
  Row,
  Table,
  Card,
  Image,
  Alert,
  Divider,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  ExclamationCircleFilled,
  DeleteOutlined,
  DownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Column from "antd/es/table/Column";
import moment from "moment";

import { useNavigate } from "react-router-dom";

const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export default function Participante() {
  const [form] = Form.useForm();
  const [formNuevoEntrenador] = Form.useForm();
  const [formCodigoEntrenador] = Form.useForm();
  const [formCI] = Form.useForm();
  const [formCodigo] = Form.useForm();
  const [formGrupal] = Form.useForm();

  const [formNuevo] = Form.useForm();
  const [data, setData] = useState([]);
  const [listaParticipantesEvento, setListaParticipantesEvento] = useState([]);
  const [dataInscritos, setDataInscritos] = useState([]);
  const [indice, setIndice] = useState();
  const [visible, setVisible] = useState(false);
  const [disableFechaNacimento, setDisableFechaNacimiento] = useState(false);

  const showModal = () => {
    setVisible(true);
    setTipoParticipante(false);
  };

  const handleCancel = () => {
    setFileList([]);
    setFileList1([]);
    setVisible(false);
    form.resetFields();
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancelIMG = () => setPreviewOpen(false);
  const [datosEventos, setDatosEventos] = useState([]);
  const [estadoEntrenador, setEstadoEntrenador] = useState(false);

  useEffect(() => {
    obtenerParticipantes();
    obtenerEntrenadores();
    obtenerParticipantesCI();
    obtenerInstituciones();
    obtenerDatos();
  }, []);

  const obtenerDatos = () => {
    axios
      .get("http://localhost:8000/api/lista-evento-detallado")
      .then((response) => {
        setDatosEventos(response.data);
        console.log("Los datos ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //*Kevin
  const [tituloEvento, setTituloEvento] = useState("");
  const [correoVerificacion, setCorreoVerificacion] = useState("");
  const [verificado, setVerificado] = useState(false);
  const [ciEncontrado, setCiEncontrado] = useState(false);
  const [enviarCodigo, setEnviarCodigo] = useState(false);
  const datosUuid = (values) => {
    const datos = {
      uuid: uuid,
      codigo: values.CODIGOVERIFICACION,
    };
    return datos;
  };
  //Verificar CODIGO INGRESADO
  const verificarCodigo = (values) => {
    const datos = datosUuid(values);
    axios
      .post("http://localhost:8000/api/confirmar-codigo-verificacion", datos)
      .then((response) => {
        setEnviarCodigo(false);
        setVerificado(true);
        formCodigo.resetFields();
        message.success("Se verifico correctamente");
      })
      .catch((error) => {
        message.error("El codigo ingresado es incorrecto.");
      });
  };

  const [uuidEntrenador, setUuidEntrenador] = useState();

  const datosUuidEntrenador = (values) => {
    const datos = {
      uuid: uuidEntrenador,
      codigo: values.CODIGOVERIFICACION,
    };
    return datos;
  };

  const verificarCodigoEntrenador = (values) => {
    const datos = datosUuidEntrenador(values);
    axios
      .post("http://localhost:8000/api/confirmar-codigo-verificacion", datos)
      .then((response) => {
        setModalVerificarCodigoEntrenador(false);
        setEstadoRegistroEntrenador(true);
        setVerificadoEntrenador(true);
        formCodigoEntrenador.resetFields();
        message.success("Se verifico correctamente");
      })
      .catch((error) => {
        message.error("El codigo ingresado es incorrecto.");
      });
  };
  const [idEVENTO, setIdEVENTO] = useState();
  const [uuid, setUuid] = useState();
  const formatDatos = (values) => {
    const datos = {
      correo_electronico: values.CORREO,
      idEvento: idEVENTO,
    };
    return datos;
  };
  //Modal para mostrar enviar Codigo
  const showModalCodigo = (values) => {
    const datos = formatDatos(values);
    const duplicado = validarDuplicadoCI(values);
    const correoDuplicado = validarDuplicadoCorreo(values);
    if (
      duplicado === false ||
      ciEncontrado === true
    )
    {
      axios
        .post("http://localhost:8000/api/enviar-codigo-verificacion", datos)
        .then((response) => {
          setUuid(response.data);
        })
        .catch((error) => {
          message.error("Ocurrió un error al guardar el registro.");
        });
      setEnviarCodigo(true);
    } else {
      if (duplicado === true && ciEncontrado === false) {
        message.error("El carnet de identidad ya esta registrado.");
      }
      if (correoDuplicado === true && ciEncontrado === false) {
        message.error("El correo ya esta registrado.");
      }
      setVisible(true);
    }
  };
  const handleCancelCodigo = () => {
    setEnviarCodigo(false);
    setVerificado(false);
  };

  const handleCancelCodigoEntrenador = () => {
    setModalVerificarCodigoEntrenador(false);
  };
  const [tipoParticipante, setTipoParticipante] = useState(false);

  //Modal para mostrar enviar Codigo
  const showModalTipoParticipante = () => {
    setTipoParticipante(true);
  };
  const handleCancelTipoParticipante = () => {
    setTipoParticipante(false);
  };

  const navigate = useNavigate();

  //Validacion de los tipos de imagenes

  const isImage = (file) => {
    const imageExtensions = ["jpeg", "jpg", "png"];
    const extension = file.name.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };
  // Configuración de las opciones del componente Upload
  const uploadProps = {
    name: "file",
    beforeUpload: (file) => {
      if (!isImage(file)) {
        message.error("Solo se permiten archivos de imagen (JPEG, JPG, PNG)");
        return Upload.LIST_IGNORE; // Impedir la carga del archivo y no lo añade a la lista
      }
      return isImage(file); // Permitir la carga del archivo solo si es una imagen
    },
  };

  const [isInstitucionDisabled, setIsInstitucionDisabled] = useState(true);

  const onInstitutionChange = (value) => {
    if (value !== 1) {
      setIsInstitucionDisabled(true);
    } else {
      setIsInstitucionDisabled(false);
    }
  };
  const [instituciones, setInstituciones] = useState([]);

  //Obtener instituciones
  const obtenerInstituciones = () => {
    axios
      .get("http://localhost:8000/api/lista-instituciones")
      .then((response) => {
        const lista = response.data.map((element) => ({
          value: element.id_institucion,
          label: element.nombre_institucion,
        }));
        setInstituciones(lista);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const generos = [
    { value: "Femenino", label: "Femenino" },
    { value: "Masculino", label: "Masculino" },
  ];

  const optionsTallas = [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ];
  const options = [
    { value: "1er semestre", label: "1er semestre" },
    { value: "2do semestre", label: "2do semestre" },
    { value: "3er semestre", label: "3er semestre" },
    { value: "4to semestre", label: "4to semestre" },
    { value: "5to semestre", label: "5to semestre" },
    { value: "6to semestre", label: "6to semestre" },
    { value: "7mo semestre", label: "7mo semestre" },
    { value: "8vo semestre", label: "8vo semestre" },
    { value: "9no semestre", label: "9no semestre" },
    { value: "10mo semestre", label: "10mo semestre" },
    { value: "Otro", label: "Otro" },
  ];
  //Obtener participantes para validar
  const obtenerParticipantesCI = () => {
    axios
      .get("http://localhost:8000/api/lista-participantes")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const validarDuplicadoCI = (values) => {
    const carnet = values.CI;
    let resultado = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].ci === carnet) {
        resultado = true;
        break;
      }
    }

    return resultado;
  };
  const validarDuplicadoCorreo = (values) => {
    const correo = values.CORREO;
    console.log("correo validarCORR ", correo);
    let resultado = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].correo_electronico === correo) {
        console.log(
          `Se encontró un objeto con campo Objetivo igual a "${correo}" en el índice ${i}.`
        );
        resultado = true;
        break;
      }
    }
    return resultado;
  };
  //
  //Registrar Imagen 1
  const [fileList, setFileList] = useState([]);
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
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const customRequest = ({ fileList, onSuccess }) => {
    onSuccess();
  };
  const uploadButton = (
    <div>
      {" "}
      <PlusOutlined />
      <div style={{ marginTop: 10 }}>Subir certificado </div>
    </div>
  );
  // Registrar Imagen 2
  const [fileList1, setFileList1] = React.useState([]);

  //Restringir las fechas de 17 a 30 años a la fecha actual
  const disabledDate = (current) => {
    // Obtenemos la fecha actual
    const today = new Date();
    // Establecemos la fecha máxima como 6205 días después de la fecha actual
    const maxDate = new Date();
    maxDate.setDate(today.getDate() - 6205);

    // Establecemos la fecha mínima como 3 días después de la fecha actual
    const minDate = new Date();
    minDate.setDate(today.getDate() - 10957);

    // Comparamos si la fecha actual está antes de la fecha máxima
    return (current > maxDate) | (current < minDate);
  };
  //validar Nombre participante
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
  //validar carnet de identidad del participante
  const validarMinimoCI = (_, value, callback) => {
    if (!value) {
      callback("");
    } else if (value.trim() !== value) {
      callback("No se permiten espacios en blanco al inicio ni al final");
    } else if (value.replace(/\s/g, "").length < 7) {
      callback("Ingrese al menos 7 digitos del CI.");
    } else {
      callback();
    }
  };
  //Solo permitir numeros en los input
  function onlyNumbers(event) {
    const key = event.key;

    if (!key.match(/[0-9]/)) {
      event.preventDefault();
    }
  }

  //Solo permitir letras en los input
  function onlyLetters(event) {
    const key = event.key;

    if (!key.match(/[a-zA-Z\s]/)) {
      event.preventDefault();
    }
  }
  //validar telefono del participante
  const validarTelefono = (_, value, callback) => {
    if (!value) {
      callback("");
    } else if (!/^(6|7)/.test(value)) {
      callback("El número de teléfono debe comenzar con 6 o 7.");
    } else if (!value.match(/^[0-9]{8}$/)) {
      callback("El número de teléfono debe tener 8 dígitos.");
    } else {
      callback(); //sin error
    }
  };
  //validar CodigoSis
  const validarCodigoSis = (_, value, callback) => {
    if (isInstitucionDisabled === false) {
      const anoActual = new Date().getFullYear();

      // Obtener el año del código de estudiante
      const codsisValue = value.substring(0, 4);

      if (!value) {
        callback("");
      } else if (!/^(199|200|201|202)([0-9]{6}$)/.test(value)) {
        callback("El códigoSIS no es valido.");
      } else if (codsisValue > anoActual) {
        callback("El códigoSIS no existe.");
      } else {
        callback(); //sin error
      }
    } else {
      callback(); //sin error
    }
  };
  //Mensaje de confirmacion al dar guardar en la parte de modal del participante
  const showConfirm = (values) => {
    setCorreoVerificacion(values.CORREO);
    if (verificado) {
      confirm({
        title: "¿Está seguro de registrarse?",
        icon: <ExclamationCircleFilled />,
        content: "",
        okText: "Si",
        cancelText: "No",
        centered: "true",

        onOk() {
          confirmSave(values);
          obtenerParticipantesCI();
        },
        onCancel() {},
      });
    } else {
      showModalCodigo(values);
    }
  };
  //Mensaje al dar al boton cancelar del formulario de crear registro
  const showCancel = () => {
    confirm({
      title: "¿Está seguro de que desea cancelar su registro? ",
      icon: <ExclamationCircleFilled />,
      content: "Se perdera el progreso realizado.",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        formCI.resetFields();
        setVisible(false);
        setIsInstitucionDisabled(true);
        setFileList([]);
        setFileList1([]);
        obtenerParticipantesCI();
        form.resetFields();
        setVerificado(false);
        setCiEncontrado(false);
        setDisableFechaNacimiento(false);
      },
      onCancel() {
        setIsInstitucionDisabled(true);
      },
    });
  };

  const onFinish = (values) => {
    showConfirm(values);
  };
  const onFinishCI = (values) => {
    obtenerParticipantesEvento();
    console.log("idevento onFinish ", idEVENTO);
    buscarCi(values);
  };
  const onFinishCodigo = (values) => {
    verificarCodigo(values);
  };
  const onFinishCodigoEntrenador = (values) => {
    verificarCodigoEntrenador(values);
  };
  //BUscar al participante por el ci
  const buscarCi = (values) => {
    const carnet = values.CI;
    const participanteEncontrado = data.find(
      (participante) => participante.ci === carnet
    );

    if (participanteEncontrado) {
      console.log(dataInscritos);
      const encontrado = dataInscritos.find(
        (elemento) => elemento.ci === carnet
      );
      console.log("IF    en evento: ", encontrado);
      if (encontrado) {
        console.log("participanteEvento", encontrado);
        message.success(
          "El carnet de identidad ya esta registrado en el Evento."
        );
      } else {
        message.success("El carnet de identidad ya esta registrado.");

        const nuevaFecha = moment(
          participanteEncontrado.fecha_nacimiento,
          "YYYY-MM-DD"
        );
        const datos = {
          CI: values.CI,
          NOMBRE: participanteEncontrado.nombre,
          CORREO: participanteEncontrado.correo_electronico,
          TELEFONO: participanteEncontrado.telefono,
          GENERO: participanteEncontrado.genero,
          FECHA: nuevaFecha,
          INSTITUCION: participanteEncontrado.id_institucion,
          CODIGOSIS: participanteEncontrado.codigoSIS,
        };
        form.setFieldsValue(datos);
        setDisableFechaNacimiento(true);
        formCI.resetFields();
        setCiEncontrado(true);
        setVisible(true);
        setTipoParticipante(false);
      }
      setTipoParticipante(false);
      formCI.resetFields();
    } else {
      message.error("El carnet de identidad no se encuentra registrado.");
    }
  };
  //modelo participante
  const datosParticipante = (values) => {
    const fecha = values.FECHA;
    const NUEVAFECHA = fecha.format("YYYY-MM-DD");
    const datos = {
      nombre: values.NOMBRE,
      correo_electronico: values.CORREO,
      ci: values.CI,
      telefono: values.TELEFONO,
      genero: values.GENERO,
      semestre: values.SEMESTRE,
      id_institucion: values.INSTITUCION,
      fecha_nacimiento: NUEVAFECHA,
      talla_polera: values.TALLA_POLERA,
      codigoSIS: values.CODIGOSIS,
      foto: fileList1.length > 0 ? fileList1[0].thumbUrl : null,
      certificado_estudiante: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };
    if (values.INSTITUCION !== 1) {
      datos.codigoSIS = null;
    }
    return datos;
  };

  const confirmSave = (values) => {
    const datos = datosParticipante(values);
    console.log("Se guarda los datos en la BD");
    axios
      .post("http://localhost:8000/api/guardar-participante", datos)
      .then((response) => {
        console.log("Datos guardados con éxito", response.data);
        const datosPer = {
          id_evento: idEVENTO,
          id_persona: response.data.id,
        };
        console.log("datos per . ", datosPer);
        axios
          .post("http://localhost:8000/api/inscribir-individual", datosPer)
          .then((response) => {
            console.log("Datos guardados con éxito Evento", response.data);
            message.success(
              "El participante se registró correctamente al evento"
            );
          })
          .catch((error) => {
            if (error.response) {
              // El servidor respondió con un código de estado fuera del rango 2xx
              const errores = error.response.data.errors;
              for (let campo in errores) {
                message.error(errores[campo][0]); // Mostramos solo el primer mensaje de error de cada campo
              }
            } else {
              // Otros errores (problemas de red, etc.)
              message.error(
                "Ocurrió un error al guardar el registro al EVENTO."
              );
            }
          });
        message.success("El participante se registró correctamente");
        obtenerParticipantesCI();
        obtenerParticipantes();
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          const errores = error.response.data.errors;
          for (let campo in errores) {
            message.error(errores[campo][0]); // Mostramos solo el primer mensaje de error de cada campo
          }
        } else {
          // Otros errores (problemas de red, etc.)
          message.error("Ocurrió un error al guardar el registro.");
        }
      });
  };

  // Registro de un equipo
  const [verModalGrupal, setVerModalGrupal] = useState(false);
  const [buscarParticipante, setBuscarParticipante] = useState(false);
  const [integrante, setIntegrante] = useState([]);
  const [datoFiltrado, setDatoFiltrado] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [listaParticipante, setListaParticipante] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [nextID, setNextID] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [buscarEntrenador, setBuscarEntrenador] = useState(false);
  const [entrenador, setEntrenador] = useState([]);
  const [searchEntrenador, setSearchEntrenador] = useState("");
  const [datoFiltradoEntrenador, setDatoFiltradoEntrenador] = useState([]);
  const [nombreEntrenador, setNombreEntrenador] = useState("");
  const [estadoFormulario, setEstadoFormulario] = useState(false);
  const [listaID_Persona, setListaID_Persona] = useState([]);
  const [verModalEntrenadorNuevo, setVerModalEntrenadorNuevo] = useState(false);
  const [estadoRegistroEntrenador, setEstadoRegistroEntrenador] =
    useState(false);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // Actualiza el estado con las filas seleccionadas
      setSelectedRows(selectedRows);
    },
  };

  //Mensaje de confirmacion al dar guardar en la parte de registro grupal
  const showConfirmGrupal = (values) => {
    confirm({
      title: "¿Esta seguro de guardar este registro?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        guardarEquipo(values);
      },
      onCancel() {},
    });
  };

  //Mensaje al dar al boton cancelar del formulario de registrar equipo
  const showCancelGrupal = () => {
    confirm({
      title: "¿Estás seguro de que desea cancelar su registro? ",
      content: " Se perderá el progreso realizado",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        setNombreEntrenador("");
        setListaParticipante([]);
        setListaID_Persona([]);
        setVerModalGrupal(false);
        setBusquedaParticipante1("");
        setBusqueda("");
        setAlerta(null);
        setAlertaParticipante1(null);
        formGrupal.resetFields();
      },
      onCancel() {},
    });
  };

  //Modal para registro grupal
  const handleCancelGrupal = () => {
    form.resetFields();
    setNombreEntrenador("");
    setListaParticipante([]);
    setListaID_Persona([]);
    setVerModalGrupal(false);
  };

  const showModalGrupal = (data) => {
    duplicadoCiEvento();
    if (data.caracteristicas.Coach_obligatorio === 1) {
      setEstadoEntrenador(true);
    } else {
      setEstadoEntrenador(false);
    }
    setVerModalGrupal(true);
  };

  const aniadirPArticipante = () => {
    aniadirParticipante();
  };

  const handleCancelBuscador = () => {
    setBuscarParticipante(false);
  };

  //Guardar datos del formulario grupal
  const registrarGrupo = (values) => {
    showConfirmGrupal(values);
  };

  //Obtener los equipos registrados
  const obtenerGrupos = () => {
    axios
      .get("http://localhost:8000/api/lista-equipos")
      .then((response) => {
        setEquipos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const duplicadoCiEvento = () => {
    axios
      .get(`http://localhost:8000/api/inscritos-evento/${idEVENTO}`)
      .then((response) => {
        setListaParticipantesEvento(response.data);
        console.log("lista participante evento: ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [respon, setRespon] = useState();

  const datosGrupal = (values) => {
    if (entrenadorForm.id_persona) {
      setRespon(entrenadorForm.id_persona);
    } else {
      setRespon(participanteForm1.id_persona);
    }

    const datos = {
      nombre_equipo: values.EQUIPO,
      coach: entrenadorForm.id_persona, // este es el id_rol_persona que obtienes de la lista de coachs
      responsable: respon, // Este el id_persona, ya sea de coach o participante
      participantes: listaID_Persona, // id_persona de los participantes
      id_institucion: values.INSTITUCION,
    };
    return datos;
  };

  const validarDuplicadoGrupal = (values) => {
    const equipo = values.EQUIPO;
    let resultado = false;

    for (let i = 0; i < equipos.length; i++) {
      if (equipos[i].nombre_equipo === equipo) {
        resultado = true;
        break;
      }
    }

    return resultado;
  };

  const guardarEquipo = (values) => {
    const datos = datosGrupal(values);
    const duplicado = validarDuplicadoGrupal(values);
    console.log("los datos a guardar del equipo son  ", datos);
    if (listaParticipante.length !== 0 && listaParticipante.length === tamanioListaParticipantes) {
      if (duplicado === true) {
        message.error("Existe un equipo con el mismo nombre");
      } else {
        axios
          .post("http://localhost:8000/api/guardar-equipo", datos)
          .then((response) => {
            message.success("El grupo se registró correctamente");
            obtenerGrupos();
            form.resetFields();
            const datosEquipo = {
              id_evento: idEVENTO,
              id_equipo: response.data.id_equipo,
            };
            axios
              .post("http://localhost:8000/api/inscribir-equipo", datosEquipo)
              .then((response) => {
                console.log(
                  "El grupo se registró correctamente con éxito al evento",
                  response.data
                );
                message.success(
                  "El equipo se registró correctamente al evento"
                );
                formGrupal.resetFields();
                setEntrenadorForm(null);
                setListaParticipante([]);
                setAlerta(null);
                setAlertaParticipante1(null);
                setBusquedaParticipante1("");
                setBusqueda("");
              })
              .catch((error) => {
                if (error.response) {
                  // El servidor respondió con un código de estado fuera del rango 2xx
                  const errores = error.response.data.errors;
                  for (let campo in errores) {
                    message.error(errores[campo][0]); // Mostramos solo el primer mensaje de error de cada campo
                  }
                } else {
                  // Otros errores (problemas de red, etc.)
                  message.error(
                    "Ocurrió un error al guardar el registro del equipo al EVENTO."
                  );
                }
              });
          });
        setVerModalGrupal(false);
        setListaParticipante([]);
        setNombreEntrenador("");
      }
    } else {
      message.error(
        `Tiene que agregar ${tamanioListaParticipantes} participantes`
      );
    }
  };
  //obtener inscritos al evento
  const obtenerParticipantesEvento = (id) => {
    console.log("idEvento: ", idEVENTO);
    //Obtener participantes inscritos al evento para validar
    axios
      .get(`http://localhost:8000/api/inscritos-evento/${id}`)
      .then((response) => {
        console.log(response.data);
        setDataInscritos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //Obtener participantes
  const obtenerParticipantes = () => {
    axios
      .get("http://localhost:8000/api/lista-participantes")
      .then((response) => {
        setIntegrante(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Validar la lista de participantes añadidos
  const validarLista = (participante) => {
    let resultado = false;

    for (let i = 0; i < listaParticipante.length; i++) {
      if (
        listaParticipante[i].ci === participante.ci ||
        listaParticipante[i].nombre === participante.nombre
      ) {
        resultado = true;
        break;
      }
    }
    return resultado;
  };
  const [participante, setParticipante] = useState([]);
  const [tamanioListaParticipantes, setTamanioListaParticipantes] =
    useState(null);

  // Añadir participante a la tabla
  const aniadirParticipante = () => {
    const agregarParticipante = participante;
    const resultado = validarLista(agregarParticipante);
    if (agregarParticipante.length !== 0) {
      if (resultado === true) {
        message.error("El participante ya se encuentra añadido");
        setParticipante([]);
      } else {
        if (listaParticipante.length === tamanioListaParticipantes) {
          message.error(
            `Máximo ${tamanioListaParticipantes} participantes permitidos`
          );
        } else {
          const nuevoParticipante = {
            key: nextID,
            nombre: agregarParticipante.nombre,
            ci: agregarParticipante.ci,
          };

          setListaParticipante((listaParticipante) => [
            ...listaParticipante,
            nuevoParticipante,
          ]);
          aniadorIDPersona(agregarParticipante.id_persona);
          message.success("Se añadió al participante");
          setBusquedaParticipante1("");
          setAlertaParticipante1(null);
          setParticipante([]);
          setNextID(nextID + 1);
        }
      }
    }

    console.log("Lista de participantes ", listaParticipante);
  };

  const aniadorIDPersona = (id) => {
    setListaID_Persona((listaID_Persona) => [...listaID_Persona, id]);

    // Muestra el contenido actualizado de la lista al final
    console.log("El id de los participantes es", [...listaID_Persona, id]);
  };

  //Eliminar participantes de la tabla
  const eliminarParticipante = () => {
    const nuevaListaParticipante = listaParticipante.filter(
      (item) => !selectedRows.includes(item)
    );

    // Crear una nueva lista de IDs excluyendo los IDs de los participantes eliminados
    const nuevaListaID_Persona = listaID_Persona.filter(
      (id) => !selectedRows.map((item) => item.key).includes(id)
    );

    setListaParticipante(nuevaListaParticipante);
    setListaID_Persona(nuevaListaID_Persona);
  };

  //Obtener informacion de los entrenadores
  const obtenerEntrenadores = () => {
    axios
      .get("http://localhost:8000/api/lista-coach")
      .then((response) => {
        setEntrenador(response.data);
        console.log("los entreandores son ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Añadir entrenador en el input
  const aniadirEntrenador = () => {
    const regex = /^[0-9]+$/;

    if (!searchEntrenador || searchEntrenador.trim() === "") {
      message.error("Tiene que ingresar el CI del entrenador");
    } else if (!regex.test(searchEntrenador)) {
      message.error("El CI del entrenador debe contener solo números");
    } else {
      setNombreEntrenador(datoFiltradoEntrenador[0].nombre);
      console.log(
        "el id del entrenador ",
        datoFiltradoEntrenador[0].id_persona
      );
      setBuscarEntrenador(false);
      setSearchEntrenador("");
      message.success("Se agregó al entrenador");
    }
  };

  //
  const validarEntrenador = (rule, value, callback) => {
    // Realiza la validación personalizada aquí
    if (!nombreEntrenador === true) {
      callback("Por favor, añada un entrenador");
    } else {
    }
  };

  //Registro nuevo participante
  const [verModalParticipanteNuevo, setVerModalParticipanteNuevo] =
    useState(false);
  const [formNuevoParticipante] = Form.useForm();
  const [verificadoEntrenador, setVerificadoEntrenador] = useState(false);
  const [correoVerificacionEntrenador, setCorreoVerificacionEntrenador] =
    useState("");
  const [modalVerificarCodigoEntrenador, setModalVerificarCodigoEntrenador] =
    useState(false);

  const datosParticipanteRegistro = (values) => {
    const datos = {
      nombre: values.Nombre,
    };
  };

  const handleAbrirModalParticipanteNuevo = () => {
    setVerModalParticipanteNuevo(true);
    console.log("Modal abierto");
  };

  const handleCancelNuevoParticipante = () => {
    confirm({
      title: "¿Estas seguro de cancelar el registro?",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        setVerModalParticipanteNuevo(false);
        formNuevo.resetFields();
      },
    });
  };

  const handleCancelNuevoEntrenador = () => {
    confirm({
      title: "¿Estas seguro de cancelar el registro?",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        setVerificadoEntrenador(false);
        setEstadoRegistroEntrenador(false);
        formNuevoEntrenador.resetFields();
        cerrarModalNuevoEntrenador(false);
      },
    });
  };

  //guardar nuevo participante
  const confirmSaveNuevo = (values) => {
    const datos = datosParticipante(values);
    const duplicado = validarDuplicadoCI(values);
    const correoDuplicado = validarDuplicadoCorreo(values);
    if (
      (duplicado === false && correoDuplicado === false) ||
      ciEncontrado === true
    ) {
      axios
        .post("http://localhost:8000/api/guardar-participante", datos)
        .then((response) => {
          message.success("Se guardo correctamente");
          obtenerParticipantes();
          setVerModalParticipanteNuevo(false);
          obtenerParticipantesCI();
          formNuevo.resetFields();
        })
        .catch((error) => {
          message.error("Ocurrió un error al guardar el registro.");
        });
    } else {
      if (duplicado === true && ciEncontrado === false) {
        message.error("El carnet de identidad ya esta registrado.");
      }
      if (correoDuplicado === true && ciEncontrado === false) {
        message.error("El correo ya esta registrado.");
      }
    }
  };

  const showConfirmParticipante = (values) => {
    confirm({
      title: "¿Está seguro de registrar este participante?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        confirmSaveNuevo(values);
      },
      onCancel() {},
    });
  };

  const showConfirmEntrenador = (values) => {
    setCorreoVerificacionEntrenador(values.CORREO_ENTRENADOR);
    if (verificadoEntrenador) {
      confirm({
        title: "¿Está seguro de registrar este entrenador?",
        icon: <ExclamationCircleFilled />,
        content: "",
        okText: "Si",
        cancelText: "No",
        centered: "true",

        onOk() {
          guardarEntrenador(values);
        },
        onCancel() {},
      });
    } else {
      showModalCodigoEntrenador(values);
    }
  };

  const guardarEntrenador = (values) => {
    console.log("Los datos de dentrenador son ", values);
    const datosGuardar = {
      nombre: values.NOMBRE_ENTRENADOR,
      correo_electronico: values.CORREO_ENTRENADOR,
      telefono: values.TELEFONO_ENTRENADOR,
      ci: values.CI_ENTRENADOR,
      genero: values.GENERO_ENTRENADOR,
      id_tipo_per: 2,
    };
    axios
      .post("http://localhost:8000/api/guardar-coach", datosGuardar)
      .then((response) => {
        message.success("El entrenador se registró correctamente");
        setNombreEntrenador(values.NOMBRE_ENTRENADOR);
        setVerificadoEntrenador(false);
        setEstadoRegistroEntrenador(false);
        formNuevoEntrenador.resetFields();
        cerrarModalNuevoEntrenador(false);
        obtenerEntrenadores();
        console.log("entrenadores nuevo: ", entrenador);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const formatoDatos = (values) => {
    const datos = {
      correo_electronico: values.CORREO_ENTRENADOR,
      idEvento: idEVENTO,
    };
    return datos;
  };

  const validarDuplicadoCIEntreandor = (values) => {
    const carnet = values.CI_ENTRENADOR;
    let resultado = false;
    for (let i = 0; i < entrenador.length; i++) {
      if (entrenador[i].ci === carnet) {
        resultado = true;
        break;
      }
    }
    return resultado;
  };

  const validarDuplicadoCorreoEntrenador = (values) => {
    const carnet = values.CORREO_ENTRENADOR;
    let resultado = false;
    for (let i = 0; i < entrenador.length; i++) {
      if (entrenador[i].correo_electronico === carnet) {
        resultado = true;
        break;
      }
    }
    return resultado;
  };

  const showModalCodigoEntrenador = (values) => {
    const datos = formatoDatos(values);
    const duplicado = validarDuplicadoCIEntreandor(values);
    if (duplicado === false) {
      axios
        .post("http://localhost:8000/api/enviar-codigo-verificacion", datos)
        .then((response) => {
          setUuidEntrenador(response.data);
        })
        .catch((error) => {
          message.error("Ocurrió un error al guardar el registro.");
        });
      setModalVerificarCodigoEntrenador(true);
    } else {
      message.error("El CI ya se encuentra registrado");
    }
  };
  const showModalidadEvento = (tipo, data) => {
    console.log("El tipo es ", data);
    console.log(
      "cantidad de participantes ",
      data.caracteristicas.Cantidad_integrantes
    );
    obtenerParticipantesEvento(data.id_evento);
    console.log("IDEVENTO SHOW MODAL  ", data.id_evento);
    setTamanioListaParticipantes(data.caracteristicas.Cantidad_integrantes);
    if (tipo === "Individual") {
      showModalTipoParticipante();
    } else {
      showModalGrupal(data);
    }
  };

  const onDownload = (afiche, nombreArchivo) => {
    fetch(afiche)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nombreArchivo || "imagen.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      })
      .catch((error) => console.error("Error durante la descarga:", error));
  };

  const [selectedCi, setSelectedCi] = useState(null);

  const handleCiChange = (value) => {
    setSelectedCi(value);
  };

  const modalNuevoEntrenador = () => {
    setVerModalEntrenadorNuevo(true);
  };

  const cerrarModalNuevoEntrenador = () => {
    setVerModalEntrenadorNuevo(false);
  };

  const registrarNuevoEntrenador = (values) => {
    showConfirmEntrenador(values);
  };

  const [busqueda, setBusqueda] = useState("");
  const [alerta, setAlerta] = useState(null);

  const handleInputChange = (event, setBusqueda, setAlerta) => {
    const value = event.target.value;
    setBusqueda(value);
    // Limpiar la alerta cuando el usuario comienza a escribir
    setAlerta(null);
  };
  const [entrenadorForm, setEntrenadorForm] = useState([]);
  const handleBuscarEntrenador = (busqueda, setAlerta) => {
    const entrenadorEncontrado = entrenador.find(
      (entrenador) => entrenador.ci === busqueda
    );
    console.log("ENTRENADOR ENCONTRADO: ", entrenadorEncontrado);
    if (entrenadorEncontrado) {
      setAlerta({
        type: "success",
        message: `${entrenadorEncontrado.nombre}`,
      });
      formGrupal.setFieldValue("ENTRENADOR",entrenadorEncontrado)
      setEntrenadorForm(entrenadorEncontrado);
    } else {
      setAlerta({
        type: "error",
        message: "Entrenador no encontrado",
      });
    }
  };
  //Busqueda Participante grupal
  const [busquedaParticipante1, setBusquedaParticipante1] = useState("");
  const [alertaParticipante1, setAlertaParticipante1] = useState(null);
  const [participanteForm1, setParticipanteForm1] = useState(null);

  const [busquedaParticipante2, setBusquedaParticipante2] = useState("");
  const [alertaParticipante2, setAlertaParticipante2] = useState(null);
  const [participanteForm2, setParticipanteForm2] = useState(null);

  const [busquedaParticipante3, setBusquedaParticipante3] = useState("");
  const [alertaParticipante3, setAlertaParticipante3] = useState(null);
  const [participanteForm3, setParticipanteForm3] = useState(null);

  const handleInputChangeParticipante = (
    event,
    setBusquedaParticipante,
    setAlertaParticipante
  ) => {
    const value = event.target.value;
    setBusquedaParticipante(value);
    // Limpiar la alerta cuando el usuario comienza a escribir
    setAlertaParticipante(null);
  };

  const handleBuscarParticipante = (
    busquedaParticipante,
    setAlertaParticipante,
    num
  ) => {
    // Supongo que `data` es tu lista de participantes
    const participanteEncontrado = data.find(
      (participante) => participante.ci === busquedaParticipante
    );

    // Buscar en la lista de participantes en el evento
    const participanteEnEvento = listaParticipantesEvento.find(
      (enEvento) => enEvento.ci === busquedaParticipante
    );

    if (participanteEncontrado) {
      if (num === 1) {
        setParticipanteForm1(participanteEncontrado);
      }
      if (num === 2) {
        setParticipanteForm2(participanteEncontrado);
      }
      if (num === 3) {
        setParticipanteForm3(participanteEncontrado);
      }

      // Verificar si el participante ya está en la lista de participantes en el evento
      if (participanteEnEvento) {
        setAlertaParticipante({
          type: "warning",
          message: `Ya está registrado en el evento.`,
        });
      } else {
        setAlertaParticipante({
          type: "success",
          message: `${participanteEncontrado.nombre}`,
        });
        setParticipante(participanteEncontrado);
      }
    } else {
      setAlertaParticipante({
        type: "error",
        message: "Participante no encontrado",
      });
    }
  };

  return (
    <div>
      <div className="tabla-descripcion-editarEv">
        <p>EVENTOS DISPONIBLES</p>
      </div>
      {/*Cards*/}
      <div className="cards">
        <Row gutter={[16, 16]}>
          {datosEventos.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={12}>
              <Card
                title={<h3>{item.TITULO}</h3>}
                style={{ marginBottom: 16, height: "auto" }}
                hoverable
                bordered={false}
                actions={[
                  <Button
                    key="inscripcion"
                    size="large"
                    type="link"
                    block
                    onClick={() => {
                      showModalidadEvento(
                        item.caracteristicas.tipo_participacion,
                        item
                      );
                      setTituloEvento(item.TITULO);
                      setIdEVENTO(item.id_evento);
                      console.log("EVENTO ID    + = ", item.id_evento);
                      console.log("EVENTO TITULO = ", item.TITULO);
                    }}
                  >
                    Inscribirse &#62;
                  </Button>,
                ]}
              >
                <div className="cards-informacion">
                  <div className="cards-columna1">
                    <p>
                      <h3>Descripcion:</h3>
                      {item.DESCRIPCION}
                    </p>
                    <br />
                    <p>
                      <h3>Tipo:</h3>
                      {item.TIPO_EVENTO}
                    </p>
                    <br />
                    <p>
                      <h3>Fecha de inicio:</h3>
                      {item.FECHA_INICIO}
                    </p>
                    <br />
                    <p>
                      <h3>Fecha de finalización:</h3>
                      {item.FECHA_FIN}
                    </p>
                    <br />
                    <p>
                      <h3>Categoria:</h3>
                      {item.caracteristicas.categoria_evento}
                    </p>
                    <br />
                    <p>
                      <h3>Costo:</h3>
                      {item.caracteristicas.costo_evento}
                    </p>
                    <br />
                    <p>
                      <h3>Cupos:</h3>
                      {item.caracteristicas.cupos}
                    </p>
                    <br />
                    <p>
                      <h3>Participacion: </h3>
                      {item.caracteristicas.tipo_participacion}
                    </p>
                    <br />
                  </div>
                  <div className="cards-columna2">
                    <Image
                      src={item.AFICHE}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "270px",
                        objectFit: "contain",
                      }}
                      preview={{
                        toolbarRender: (
                          _,
                          {
                            transform: { scale },
                            actions: { onZoomOut, onZoomIn },
                          }
                        ) => (
                          <Space size={12} className="toolbar-wrapper">
                            <DownloadOutlined
                              onClick={() =>
                                onDownload(item.AFICHE, "Afiche del evento.png")
                              }
                            />
                            <ZoomOutOutlined
                              disabled={scale === 1}
                              onClick={onZoomOut}
                            />
                            <ZoomInOutlined
                              disabled={scale === 50}
                              onClick={onZoomIn}
                            />
                          </Space>
                        ),
                      }}
                      fallback="data:image/png;base64,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"
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/*Modal Elegir tipo*/}
      <Modal
        title={`Inscribirme al evento: ${tituloEvento}`}
        open={tipoParticipante}
        onCancel={handleCancelTipoParticipante}
        centered={true}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Form form={formCI} onFinish={onFinishCI}>
            <Button
              style={{ centered: "true", float: "rigth" }}
              onClick={showModal}
            >
              Nuevo Participante
            </Button>
            <Button
              style={{ centered: "true", float: "left" }}
              type="primary"
              htmlType="submit"
            >
              Buscar Participante
            </Button>
          </Form>,
        ]}
      >
        <Form
          layout="vertical"
          onFinishFailed={onFinishFailed}
          form={formCI}
          onFinish={onFinishCI}
        >
          <Form.Item
            label="Ingrese su carnet de identidad:"
            name="CI"
            style={{ paddingTop: "3%", centered: "true" }}
            rules={[
              {
                required: true,
                message: "Por favor ingrese su numero de carnet",
              },
              { validator: validarMinimoCI },
            ]}
          >
            <Input
              placeholder="Por favor, ingrese el ci"
              maxLength={8}
              minLength={8}
              style={{ maxWidth: "50%", centered: "true" }}
              onKeyPress={onlyNumbers}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
      {/*Modal para enviar Codigo*/}
      <Modal
        title="Confirmar acción"
        open={enviarCodigo}
        onCancel={handleCancelCodigo}
        centered={true}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Form form={formCodigo} onFinish={onFinishCodigo}>
            <Button type="primary" htmlType="submit">
              Verificar
            </Button>
          </Form>,
        ]}
      >
        <p>Deberías haber recibido un correo electrónico con un código.</p>
        <p>
          A su correo registrado : <strong>{correoVerificacion}</strong>
        </p>
        <br />
        <Form layout="vertical" form={formCodigo} onFinish={onFinishCodigo}>
          <Form.Item
            label="Código de Verificación:"
            name="CODIGOVERIFICACION"
            style={{ paddingTop: "3%" }}
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su codigo de verificacion",
              },
            ]}
          >
            <Input
              placeholder="Por favor, ingrese el codigo"
              maxLength={8}
              minLength={8}
              style={{ maxWidth: "50%", centered: "true" }}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
      {/*Ventana emergente para el formulario de crear participante Individual */}

      <Modal
        title="Formulario de registro Individual"
        open={visible}
        onCancel={handleCancel}
        maskClosable={false}
        keyboard={false}
        closable={false}
        style={{
          top: 10,
        }}
        width={1000}
        footer={[
          <Form form={form} onFinish={onFinish}>
            <Button onClick={showCancel} className="boton-cancelar-registro">
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="boton-guardar-registro"
            >
              {verificado ? "Registrarme" : "Enviar Codigo"}
            </Button>
          </Form>,
        ]}
      >
        <Form
          onFinishFailed={onFinishFailed}
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="on"
          style={{
            width: "95%",
            paddingLeft: "3%",
            backgroundColor: "#ffff",
            margin: "0% 5% 0% 5%",
            paddingRight: "3%",
            borderRadius: "15px",
            display: "grid",
          }}
        >
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <div
                style={{
                  color: "black",
                  weight: "bold",
                  size: "18px",
                  bottom: "20px",
                }}
              >
                <h4>Datos Personales:</h4>
              </div>
              <Form.Item
                label="Carnet de identidad"
                name="CI"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese su numero de carnet",
                  },
                  { validator: validarMinimoCI },
                ]}
              >
                <Input
                  maxLength={8}
                  minLength={7}
                  placeholder="Ingrese su numero de carnet"
                  onKeyPress={onlyNumbers}
                  readOnly={verificado || ciEncontrado}
                ></Input>
              </Form.Item>
              <Form.Item
                label="Nombre completo"
                name="NOMBRE"
                rules={[
                  {
                    required: true,
                    message: "Ingrese un nombre, por favor.",
                  },
                  { validator: validarMinimo },
                ]}
              >
                <Input
                  maxLength={50}
                  minLength={5}
                  placeholder="Ingrese su nombre completo."
                  style={{ maxWidth: "100%" }}
                  onKeyPress={onlyLetters}
                  readOnly={verificado || ciEncontrado}
                ></Input>
              </Form.Item>
              <Form.Item
                label="Fecha de nacimiento"
                name="FECHA"
                rules={[
                  {
                    required: true,
                    message: "Ingrese una fecha, por favor.",
                  },
                ]}
              >
                <DatePicker
                  style={{
                    width: "200px",
                    maxWidth: "100%",
                    pointerEvents: verificado ? "none" : "auto",
                  }}
                  placeholder="Selecciona una fecha"
                  disabledDate={disabledDate}
                  disabled={disableFechaNacimento}
                />
              </Form.Item>
              <Form.Item
                label="Celular"
                name="TELEFONO"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese un celular",
                  },
                  {
                    validator: validarTelefono,
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el celular"
                  maxLength={8}
                  minLength={8}
                  readOnly={verificado || ciEncontrado}
                  style={{ maxWidth: "100%" }}
                  onKeyPress={onlyNumbers}
                ></Input>
              </Form.Item>
              <Form.Item
                label="Genéro"
                name="GENERO"
                style={{ maxWidth: "100%" }}
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione un género ",
                  },
                ]}
              >
                <Select
                  placeholder="Seleccione un género."
                  options={generos}
                  style={{
                    pointerEvents: verificado || ciEncontrado ? "none" : "auto",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Correo electrónico"
                name="CORREO"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "El correo electrónico no es válido.",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese su correo electrónico"
                  maxLength={30}
                  minLength={5}
                  readOnly={verificado || ciEncontrado}
                ></Input>
              </Form.Item>
              {/*
              <Form.Item label="Foto" name="FOTO">
                <Upload
                  {...uploadProps}
                  name="FOTO"
                  customRequest={customRequest1}
                  listType="picture-card"
                  onPreview={handlePreview1}
                  onChange={handleChange1}
                  fileList={fileList1}
                  maxCount={1}
                >
                  {fileList1.length >= 1 ? null : uploadButton1}
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
              */}
            </Col>
            <Col span={12}>
              <div
                style={{
                  color: "black",
                  weight: "bold",
                  size: "18px",
                  bottom: "20px",
                }}
              >
                <h4>Datos especificos al evento:</h4>
              </div>
              <Form.Item
                label="Institución"
                name="INSTITUCION"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione una institución",
                  },
                ]}
              >
                <Select
                  placeholder="Seleccione una institución."
                  options={instituciones}
                  onChange={onInstitutionChange}
                  style={{
                    pointerEvents: verificado || ciEncontrado ? "none" : "auto",
                  }}
                />
              </Form.Item>
              <Form.Item label="Semestre" name="SEMESTRE">
                <Select placeholder="Ingrese el semestre" options={options} />
              </Form.Item>
              <Form.Item
                label="Código SIS"
                name="CODIGOSIS"
                style={{ maxWidth: "100%" }}
                rules={[
                  {
                    requires: false,
                    validator: validarCodigoSis,
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese su código sis"
                  maxLength={9}
                  minLength={9}
                  onKeyPress={onlyNumbers}
                  disabled={isInstitucionDisabled}
                  readOnly={verificado || ciEncontrado}
                ></Input>
              </Form.Item>
              <Form.Item label="Talla de polera" name="TALLA_POLERA">
                <Select
                  placeholder="Seleccione una talla de polera"
                  options={optionsTallas}
                />
              </Form.Item>
              <Form.Item
                label="Certificacion del estudiante"
                name="CERTIFICADO"
              >
                <Upload
                  name="CERTIFICADO"
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
            </Col>
          </Row>
        </Form>
      </Modal>

      {/*Modal para la parte de registrar equipo grupal */}
      <Modal
        title="Formulario de registro grupal"
        open={verModalGrupal}
        maskClosable={false}
        keyboard={false}
        closable={false}
        centered
        width={800}
        footer={[
          <Form form={formGrupal} onFinish={registrarGrupo}>
            <Button
              onClick={showCancelGrupal}
              className="boton-cancelar-registro"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="boton-guardar-registro"
            >
              Guardar
            </Button>
          </Form>,
        ]}
      >
        <Form
          onFinishFailed={onFinishFailed}
          form={formGrupal}
          initialValues={nombreEntrenador}
          onFinish={registrarGrupo}
          layout="vertical"
        >
          <div className="dosColumnas">
            <div className="columnaUno">
              <Form.Item
                label="Nombre del equipo"
                name="EQUIPO"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese el nombre del equipo",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el nombre del equipo"
                  maxLength={30}
                />
              </Form.Item>
              <Form.Item label="Participante:" name="PARTICIPANTE1">
                <div>
                  <Input.Search
                    placeholder="Ingresa el carnet de identidad"
                    value={busquedaParticipante1}
                    onChange={(event) =>
                      handleInputChangeParticipante(
                        event,
                        setBusquedaParticipante1,
                        setAlertaParticipante1
                      )
                    }
                    onSearch={() =>
                      handleBuscarParticipante(
                        busquedaParticipante1,
                        setAlertaParticipante1,
                        1
                      )
                    }
                    maxLength={8}
                    minLength={8}
                  />
                  {alertaParticipante1 && (
                    <Alert
                      message={alertaParticipante1.message}
                      type={alertaParticipante1.type}
                      showIcon
                      style={{ height: 28 }}
                    />
                  )}
                </div>
                <Button type="link" onClick={handleAbrirModalParticipanteNuevo}>
                  Registrar Nuevo Participante
                </Button>
              </Form.Item>
              <Button onClick={eliminarParticipante} className="icono-eliminar">
                Quitar participante
              </Button>

              <Button onClick={aniadirPArticipante} className="icono-aniadir">
                Añadir participante
              </Button>
            </div>
            <div>
              <Form.Item label="Institución" name="INSTITUCION">
                <Select
                  placeholder="Seleccione una institución."
                  options={instituciones}
                  onChange={onInstitutionChange}
                />
              </Form.Item>
              <Form.Item
                label="Entrenador"
                name="ENTRENADOR"
                rules={[
                  {
                    required: estadoEntrenador,
                    message: "Por favor, añada a un entrenador",
                  },
                ]}
              >
                <div>
                  <Input.Search
                    placeholder="Ingresa el carnet de identidad"
                    value={busqueda}
                    onChange={(event) =>
                      handleInputChange(event, setBusqueda, setAlerta)
                    }
                    onSearch={() => handleBuscarEntrenador(busqueda, setAlerta)}
                    maxLength={8}
                  />
                  {alerta && (
                    <Alert
                      message={alerta.message}
                      type={alerta.type}
                      showIcon
                      closable
                      onClose={() => setAlerta(null)}
                      style={{ height: 28 }}
                    />
                  )}
                </div>
                <Button type="link" onClick={modalNuevoEntrenador}>
                  Registrar Nuevo Entrenador
                </Button>
              </Form.Item>
            </div>
          </div>

          <Table
            className="tabla-participantes"
            dataSource={listaParticipante}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            pagination={false}
            locale={{
              emptyText: (
                <div style={{ padding: "50px", textAlign: "center" }}>
                  No hay participantes añadidos.
                </div>
              ),
            }}
          >
            <Column title="Nombre completo" dataIndex="nombre" key="nombre" />
            <Column title="CI" dataIndex="ci" key="ci" />
          </Table>
          <p>Nro. participantes requerido: {tamanioListaParticipantes}</p>
        </Form>
      </Modal>

      {/*modal para registrar nuevo participante*/}
      <Modal
        title="Registrar nuevo participante"
        open={verModalParticipanteNuevo}
        onCancel={handleCancelNuevoParticipante}
        footer={[
          <Form form={formNuevo} onFinish={showConfirmParticipante}>
            <Button
              onClick={handleCancelNuevoParticipante}
              className="boton-cancelar-registro"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="boton-guardar-registro"
            >
              Añadir
            </Button>
          </Form>,
        ]}
      >
        <Form
          form={formNuevo}
          onFinish={showConfirmParticipante}
          onFinishFailed={onFinishFailed}
          layout="horizontal"
        >
          <Form.Item
            label="Carnet de identidad"
            name="CI"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese el CI del participante",
              },
              { validator: validarMinimoCI },
            ]}
          >
            <Input
              minLength={8}
              maxLength={8}
              placeholder="Por favor, ingrese el CI"
              onKeyPress={onlyNumbers}
            />
          </Form.Item>
          <Form.Item
            label="Nombre completo"
            name="NOMBRE"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese el nombre del participante",
              },
              { validator: validarMinimo },
            ]}
          >
            <Input
              minLength={5}
              maxLength={50}
              placeholder="Ingrese un nombre"
              onKeyPress={onlyLetters}
            />
          </Form.Item>
          <Form.Item
            label="Fecha de nacimiento"
            name="FECHA"
            rules={[
              { required: true, message: "Ingrese una fecha, por favor." },
            ]}
          >
            <DatePicker
              style={{ width: "200px", maxWidth: "100%" }}
              placeholder="Selecciona una fecha"
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
            label="Genéro"
            name="GENERO"
            style={{ maxWidth: "100%" }}
            rules={[
              {
                required: true,
                message: "Por favor seleccione un género ",
              },
            ]}
          >
            <Select placeholder="Seleccione un género.">
              <Select.Option value="Femenino">Femenino</Select.Option>
              <Select.Option value="Masculino">Masculino</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Correo electrónico"
            name="CORREO"
            rules={[
              {
                required: true,
                type: "email",
                message: "El correo electrónico no es válido.",
              },
            ]}
          >
            <Input
              placeholder="Ingrese el correo electrónico"
              maxLength={30}
              minLength={5}
            ></Input>
          </Form.Item>
          <Form.Item
            label="Celular"
            name="TELEFONO"
            rules={[
              {
                required: true,
                message: "Por favor ingrese un celular",
              },
              { validator: validarTelefono },
            ]}
          >
            <Input
              placeholder="Ingrese el celular"
              maxLength={8}
              minLength={8}
              style={{ maxWidth: "100%" }}
              onKeyPress={onlyNumbers}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>

      {/*Modal para enviar codigo de verificacion al entrenador */}
      <Modal
        title="Confirmar acción"
        open={modalVerificarCodigoEntrenador}
        onCancel={handleCancelCodigoEntrenador}
        centered={true}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Form form={formCodigoEntrenador} onFinish={onFinishCodigoEntrenador}>
            <Button type="primary" htmlType="submit">
              Verificar
            </Button>
          </Form>,
        ]}
      >
        <p>Deberías haber recibido un correo electrónico con un código.</p>
        <p>
          A su correo registrado :{" "}
          <strong>{correoVerificacionEntrenador}</strong>
        </p>
        <br />
        <Form
          layout="vertical"
          form={formCodigoEntrenador}
          onFinish={onFinishCodigoEntrenador}
        >
          <Form.Item
            label="Código de Verificación:"
            name="CODIGOVERIFICACION"
            style={{ paddingTop: "3%" }}
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su codigo de verificacion",
              },
            ]}
          >
            <Input
              placeholder="Por favor, ingrese el codigo"
              maxLength={8}
              minLength={8}
              style={{ maxWidth: "50%", centered: "true" }}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>

      {/*Modal para registrar nuevo entrenador */}
      <Modal
        title="Registrar entrenador"
        open={verModalEntrenadorNuevo}
        onCancel={handleCancelNuevoEntrenador}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form form={formNuevoEntrenador} onFinish={registrarNuevoEntrenador}>
            <Button
              onClick={handleCancelNuevoEntrenador}
              className="boton-cancelar-registro"
            >
              Cancelar
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className="boton-guardar-registro"
            >
              {verificadoEntrenador ? "Registrar" : "Enviar código"}
            </Button>
          </Form>,
        ]}
      >
        <Form
          form={formNuevoEntrenador}
          onFinish={registrarNuevoEntrenador}
          layout="horizontal"
        >
          <Form.Item
            label="Carnet de identidad"
            name="CI_ENTRENADOR"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese el CI del participante",
              },
              { validator: validarMinimoCI },
            ]}
          >
            <Input
              minLength={8}
              maxLength={8}
              readOnly={estadoRegistroEntrenador}
              placeholder="Por favor, ingrese el CI"
              onKeyPress={onlyNumbers}
            />
          </Form.Item>
          <Form.Item
            label="Nombre completo"
            name="NOMBRE_ENTRENADOR"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese el nombre del participante",
              },
              { validator: validarMinimo },
            ]}
          >
            <Input
              minLength={5}
              maxLength={50}
              readOnly={estadoRegistroEntrenador}
              placeholder="Ingrese un nombre"
              onKeyPress={onlyLetters}
            />
          </Form.Item>
          <Form.Item
            label="Fecha de nacimiento"
            name="FECHA_NACIMIENTO_ENTRENADOR"
            rules={[
              { required: true, message: "Ingrese una fecha, por favor." },
            ]}
          >
            <DatePicker
              style={{ width: "200px", maxWidth: "100%" }}
              placeholder="Selecciona una fecha"
              disabledDate={disabledDate}
              disabled={estadoRegistroEntrenador}
            />
          </Form.Item>
          <Form.Item
            label="Genéro"
            name="GENERO_ENTRENADOR"
            style={{ maxWidth: "100%" }}
            rules={[
              {
                required: true,
                message: "Por favor seleccione un género ",
              },
            ]}
          >
            <Select
              placeholder="Seleccione un género."
              disabled={estadoRegistroEntrenador}
            >
              <Select.Option value="Femenino">Femenino</Select.Option>
              <Select.Option value="Masculino">Masculino</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Correo electrónico"
            name="CORREO_ENTRENADOR"
            rules={[
              {
                required: true,
                type: "email",
                message: "El correo electrónico no es válido.",
              },
            ]}
          >
            <Input
              readOnly={estadoRegistroEntrenador}
              placeholder="Ingrese el correo electrónico"
              maxLength={30}
              minLength={5}
            ></Input>
          </Form.Item>
          <Form.Item
            label="Celular"
            name="TELEFONO_ENTRENADOR"
            rules={[
              {
                required: true,
                message: "Por favor ingrese un celular",
              },
              { validator: validarTelefono },
            ]}
          >
            <Input
              placeholder="Ingrese el celular"
              readOnly={estadoRegistroEntrenador}
              maxLength={8}
              minLength={8}
              style={{ maxWidth: "100%" }}
              onKeyPress={onlyNumbers}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

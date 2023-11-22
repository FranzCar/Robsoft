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
  Image
} from "antd";
import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  ExclamationCircleFilled,
  DeleteOutlined,
  FormOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Column from "antd/es/table/Column";

import { useNavigate } from "react-router-dom";

const { confirm } = Modal;
const { Search } = Input;

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

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.nombre === "Disabled User",
    // Column configuration not to be checked
    name: record.nombre,
  }),
};

export default function Participante() {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

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
  const [verImagen, setVerImagen] = React.useState("");

  useEffect(() => {
    obtenerParticipantes();
    obtenerParticipantesCI();
    obtenerEntrenadores();
    obtenerGrupos();
    obtenerInstituciones();
    obtenerDatos();
  }, []);

  const obtenerDatos = () => {
    axios
      .get("http://localhost:8000/api/eventos-mostrar")
      .then((response) => {
        setDatosEventos(response.data);
        console.log("los datos ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //*Kevin
  const [tituloEvento,setTituloEvento] = useState("");
  const [verificado, setVerificado] = useState(false);
  const [enviarCodigo, setEnviarCodigo] = useState(false);
   //Verificar CODIGO INGRESADO
  const verificarCodigo = () => {
    setEnviarCodigo(false);
    setVerificado(true);
      message.success("Se verifico correctamente");
    
  };
  //Modal para mostrar enviar Codigo
  const showModalCodigo = () => {
    setEnviarCodigo(true); 
  };
  const handleCancelCodigo = () => {
    setEnviarCodigo(false);
    setVerificado(false);
  };
  const [tipoParticipante, setTipoParticipante] = useState(false);
  
   //Verificar CODIGO INGRESADO
  const verificarTipoParticipante = () => {
    setTipoParticipante(false);
      message.success("");
    
  };
  //Modal para mostrar enviar Codigo
  const showModalTipoParticipante= () => {
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
  const [data, setData] = useState([]);

  const validarDuplicadoCI = (values) => {
    const carnet = values.CI;
    let resultado = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].ci === carnet) {
        console.log(
          `Se encontró un objeto con campo Objetivo igual a "${carnet}" en el índice ${i}.`
        );
        resultado = true;
        break;
      }
    }
    if (!resultado) {
      console.log("NO hay datos iguales");
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
  const handleChange1 = ({ fileList: newfileList }) =>
    setFileList1(newfileList);
  const handlePreview1 = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const customRequest1 = ({ fileList1, onSuccess }) => {
    onSuccess();
  };
  const uploadButton1 = (
    <div>
      {" "}
      <PlusOutlined />
      <div style={{ marginTop: 10 }}>Subir fotografia. </div>
    </div>
  );
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
        setVisible(false);
        setIsInstitucionDisabled(true);
        setFileList([]);
        setFileList1([]);
        obtenerParticipantesCI();
        form.resetFields();
        setVerificado(false);
      },
      onCancel() {
        setIsInstitucionDisabled(true);
      },
    });
  };

  const onFinish = (values) => {
    console.log("El formulario es ", values);
    showConfirm(values);
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
    const duplicado = validarDuplicadoCI(values);

    if (duplicado === true) {
      console.log(
        "No se cierra el formulario y no se guarda, se mustra un mensaje de q existe evento duplicado"
      );
      setVisible(true);
      message.error("El carnet de identidad ya esta registrado.");
    } else {
      console.log("Se guarda los datos en la BD");
      axios
        .post("http://localhost:8000/api/guardar-participante", datos)
        .then((response) => {
          console.log("Datos guardados con éxito", response.data);
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
      setVisible(false);
      form.resetFields();
      setFileList([]);
      setFileList1([]);
    }
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
      title:
        "¿Estás seguro de que desea cancelar su registro? Se perdera el progreso realizado. ",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        setNombreEntrenador("");
        setListaParticipante([]);
        setListaID_Persona([]);
        setVerModalGrupal(false);
        form.resetFields();
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

  const showModalGrupal = () => {
    setVerModalGrupal(true);
  };

  const aniadirPArticipante = () => {
    setBuscarParticipante(true);
  };

  const handleCancelBuscador = () => {
    setBuscarParticipante(false);
  };

  //Modal para mostrar el buscador de entrenador
  const showModalEntrenador = () => {
    setBuscarEntrenador(true);
  };
  const handleCancelEntrenador = () => {
    setBuscarEntrenador(false);
  };

  //Guardar datos del formulario grupal
  const registrarGrupo = (values) => {
    showConfirmGrupal(values);
    console.log("el valor de los datos del grupo son ", values);
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

  const datosGrupal = (values) => {
    const datos = {
      nombre_equipo: values.EQUIPO,
      id_coach_persona: datoFiltradoEntrenador[0].id_persona,
      participantes: listaID_Persona,
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
    console.log("los datos que se recuperan del grupo son ", datos);
    if (duplicado === true) {
      message.error("Existe un equipo con el mismo nombre");
    } else {
      if (listaParticipante.length < 3) {
        message.error("Para registrar el grupo, se requieren  3 participantes");
      } else {
        axios
          .post("http://localhost:8000/api/guardar-equipo", datos)
          .then((response) => {
            message.success("El grupo se registró correctamente");
            obtenerGrupos();
            form.resetFields();
          });
        setVerModalGrupal(false);
        setListaParticipante([]);
        setNombreEntrenador("");
      }
    }
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

  //Buscar participantes
  const onSearch = (value) => {
    setSearchText(value);
    filtrarDatos(value, ["nombre", "ci"]);
  };

  const filtrarDatos = (searchText, fieldNames) => {
    const filtered = integrante.filter((item) =>
      fieldNames.some((fieldName) =>
        String(item[fieldName])
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
    setDatoFiltrado(filtered);
  };

  //Validar la lista de participantes añadidos
  const validarLista = () => {
    let resultado = false;

    for (let i = 0; i < listaParticipante.length; i++) {
      if (
        listaParticipante[i].ci === searchText ||
        listaParticipante[i].nombre === searchText
      ) {
        resultado = true;
        break;
      }
    }
    return resultado;
  };

  // Añadir participante a la tabla
  const aniadirParticipante = () => {
    const resultado = validarLista();
    if (resultado === true) {
      message.error("El participantes ya se encuentra añadido");
    } else {
      if (!searchText === true || searchText.trim() === "") {
        message.error("Tiene que ingresar un CI de un participante");
      } else {
        if (listaParticipante.length === 3) {
          message.error("Máximo 3 participantes permitidos");
        } else {
          const nuevoParticipante = { key: nextID, ...datoFiltrado[0] };

          setListaParticipante((listaParticipante) => [
            ...listaParticipante,
            nuevoParticipante,
          ]);
          setSearchText("");
          message.success("Se añadió al participante");
          aniadorIDPersona(datoFiltrado[0].id_persona);
          setNextID(nextID + 1);
        }
      }
    }
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
      .get("http://localhost:8000/api/lista-coachs")
      .then((response) => {
        setEntrenador(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Buscar entreandor
  const onSearchEntrenador = (value) => {
    setSearchEntrenador(value);
    filtrarDatosEntrenador(value, ["nombre", "ci"]);
  };

  const filtrarDatosEntrenador = (searchText, fieldNames) => {
    const filtered = entrenador.filter((item) =>
      fieldNames.some((fieldName) =>
        String(item[fieldName])
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
    setDatoFiltradoEntrenador(filtered);
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
const [verModalParticipanteNuevo, setVerModalParticipanteNuevo] = useState(false);
const [formNuevoParticipante] = Form.useForm();
const [nuevoParticipanteCI, setNuevoParticipanteCI] = useState('');
const [nuevoParticipanteNombre, setNuevoParticipanteNombre] = useState('');
const [nuevoParticipanteNacimiento, setNuevoParticipanteNacimiento] = useState('');
const [nuevoParticipanteGenero, setNuevoParticipanteGenero]=useState('');
const [nuevoParticipanteMail, setNuevoParticipanteMail] = useState('');
const [nuevoParticipanteCelular, setNuevoParticipanteCelular] = useState('');


  const handleAbrirModalParticipanteNuevo = () => {
    /*setNuevoParticipanteCI('');
    setNuevoParticipanteNombre('');
    setNuevoParticipanteNacimiento('');
    setNuevoParticipanteGenero('');
    setNuevoParticipanteMail('');
    setNuevoParticipanteCelular('');*/

  setVerModalParticipanteNuevo(true);
  console.log('Modal abierto');

  };

  const handleCancelNuevoParticipante = () => {
    // Configura otros estados según sea necesario
    // Cierra el modal de nuevo participante
    setVerModalParticipanteNuevo(false);
  };

  const registrarNuevoParticipante = (values) => {
    //envío del formulario
    console.log('Formulario enviado:', values);
  
    // Cierra el modal después de enviar el formulario si es necesario
    setVerModalParticipanteNuevo(false);
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
            <Col key={index} xs={24} sm={12} md={8}>
              <Card
                title={item.TITULO}
                style={{ marginBottom: 16 }}
                actions={[
                  <FormOutlined
                    key="inscripcion"
                    onClick={() => {showModalGrupal(item.id_evento);
                    setTituloEvento(item.TITULO);
                    }}
                  />,
                ]}
              >
                <p>{item.DESCRIPCION}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/*
        <Row gutter={[16, 8]}>
          <Col className="main-content" span={12}>
            <Space direction="vertical" style={{ width: "80%" }}>
              <Button
                type="primary"
                onClick={showModal}
                block
                style={{ background: "var(--primary-color)" }}
              >
                <span style={{ fontWeight: "bold" }}>Registro Individual</span>
              </Button>
            </Space>
          </Col>
          <Col className="main-content" span={12}>
            <Space direction="vertical" style={{ width: "80%" }}>
              <Button
                type="primary"
                onClick={showModalGrupal}
                block
                style={{ background: "var(--primary-color)" }}
              >
                <span style={{ fontWeight: "bold" }}>Registro Grupal</span>
              </Button>
            </Space>
          </Col>
        </Row>
      */}
      {/*Modal Elegir tipo*/}
      <Modal
        title={`Inscribirme al evento: ${tituloEvento}`}
        open={tipoParticipante}
        onCancel={handleCancelTipoParticipante}
        centered={true}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Form>
            <Button style={{ centered: "true",float:"left"}} onClick={showModal}>
                Buscar Participante
              </Button>
            <Button style={{ centered: "true",float:"rigth"}} onClick={showModal}>
              Nuevo Participante
            </Button>
            
          </Form>,
        ]}
       >
          <Form layout="vertical">
          <Form.Item 
                label="Ingrese su carnet de identidad:"
                name="CI´s"
                 style={{ paddingTop: "3%",centered: "true"}}
                 >
                  <Input
                    placeholder="Por favor, ingrese el ci"
                    maxLength={8}
                    minLength={8}
                    style={{ maxWidth: "50%" , centered:"true",}}
                    onKeyPress={onlyNumbers}
                  ></Input>
                </Form.Item>
              </Form>
        
        
      </Modal>
       {/*Modal para enviar Codigo*/}
      <Modal
        title="Confirmar accion"
        open={enviarCodigo}
        onCancel={handleCancelCodigo}
        centered={true}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Form>
            <Button  onClick={verificarCodigo}>
              Verificar
            </Button>
          </Form>,
        ]}
       >
       <p>Deberías haber recibido un correo electrónico con un código.</p>
       <p> Ingrese el código a continuación:</p>
          <Form layout="vertical">
          <Form.Item 
                label="Codigo verificacion :"
                name="CODIGOVERIFICACION"
                 style={{ paddingTop: "3%",}}
                 >
                  <Input
                    placeholder="Por favor, ingrese el codigo"
                    maxLength={8}
                    minLength={8}
                    style={{ maxWidth: "50%" , centered:"true",}}
                    onKeyPress={onlyNumbers}
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
          top: 20,
        }}
        width={1000}
        footer={[
          <Form form={form} onFinish={onFinish}>
            <Button onClick={showCancel} className="boton-cancelar-registro">
              Cancelar
            </Button>
            
              <Button onClick={showModalCodigo} className="boton-verificar">
              Enviar codigo
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="boton-guardar-registro"
              disabled={!verificado}
            >
              Inscribirme
            </Button>
          </Form>,
        ]}
      >
        <Form
          onFinishFailed={onFinishFailed}
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          style={{
            width: "95%",
            paddingLeft: "3%",
            backgroundColor: "#ffff",
            margin: "0% 5% 5% 5%",
            paddingRight: "3%",
            borderRadius: "15px",
            display: "grid",
          }}
        >
          <Row gutter={[16, 8]}>
            <Col span={12}>
            <div style={{
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
                ></Input>
              </Form.Item>
              <Form.Item
                label="Nombre completo"
                name="NOMBRE"
                rules={[
                  { required: true, message: "Ingrese un nombre, por favor." },
                  { validator: validarMinimo },
                ]}
              >
                <Input
                  maxLength={50}
                  minLength={5}
                  placeholder="Ingrese su nombre completo."
                  style={{ maxWidth: "100%" }}
                  onKeyPress={onlyLetters}
                ></Input>
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
              <div style={{
              color: "black",
              weight: "bold",
              size: "18px",
              bottom: "20px",

            }}>
                <h4>Datos especificos al evento:</h4>
              </div>
              <Form.Item
                label="Institución"
                name="INSTITUCION"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese la institución",
                  },
                ]}
              >
                <Select
                  placeholder="Seleccione una institución."
                  options={instituciones}
                  onChange={onInstitutionChange}
                />
              </Form.Item>
              <Form.Item
                label="Semestre"
                name="SEMESTRE"
                
              >
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
                ></Input>
              </Form.Item>
              <Form.Item label="Talla de polera" name="TALLA_POLERA">
                <Select placeholder="Seleccione una talla de polera">
                  <Select.Option value="S">S</Select.Option>
                  <Select.Option value="M">M</Select.Option>
                  <Select.Option value="L">L</Select.Option>
                  <Select.Option value="XL">XL</Select.Option>
                  <Select.Option value="XXL">XXL</Select.Option>
                </Select>
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
        onCancel={handleCancelGrupal}
        style={{
          top: 20,
        }}
        width={600}
        footer={[
          <Form form={form} onFinish={registrarGrupo}>
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
          form={form}
          initialValues={nombreEntrenador}
          onFinish={registrarGrupo}
          layout="vertical"
        >
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
            <Input placeholder="Ingrese el nombre del equipo" maxLength={50} />
          </Form.Item>
          {/*<Form.Item label="Institución" name="INSTITUCION">
              <Input placeholder="Ingrese el nombre de la institución" />
            </Form.Item>*/}
          <Form.Item label="Entrenador" name="ENTRENADOR">
            <div className="botones-entrenador">
              <label>Añadir</label>
              <Button
                type="link"
                onClick={showModalEntrenador}
                className="icono-aniadir"
              >
                <PlusOutlined />
              </Button>
            </div>

            <Input
              value={nombreEntrenador}
              readOnly={estadoFormulario}
              placeholder="Ingrese el nombre del entrenador"
            />
          </Form.Item>

          <div className="aniadir-participante">
            <div>
              <label>Participantes</label>
            </div>
            <div className="boton-aniadir-participante">
              <label>Eliminar</label>
              <Button
                type="link"
                onClick={eliminarParticipante}
                className="icono-eliminar"
              >
                <DeleteOutlined />
              </Button>

              <label>Añadir</label>
              <Button
                type="link"
                onClick={aniadirPArticipante}
                className="icono-aniadir"
              >
                <PlusOutlined />
              </Button>
              <Button type="text" onClick={handleAbrirModalParticipanteNuevo}>
               Registrar Nuevo Participante 
            </Button>
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
                <div style={{ padding: "30px", textAlign: "center" }}>
                  No hay participantes añadidos.
                </div>
              ),
            }}
          >
            <Column title="Nombre completo" dataIndex="nombre" key="nombre" />
          </Table>
        </Form>
      </Modal>

      {/*Modal para buscar un participante*/}
      <Modal
        title="Buscar participante"
        open={buscarParticipante}
        onCancel={handleCancelBuscador}
        footer={[
          <Form onFinish={aniadirEntrenador}>
            <Button type="primary" onClick={aniadirParticipante}>
              Añadir
            </Button>
          </Form>,
        ]}
      >
        <label>CI del participante</label>
        <div>
          <Search
            className="buscador-participante"
            value={searchText}
            placeholder="Buscar participante"
            onSearch={onSearch}
            onChange={(e) => onSearch(e.target.value)}
            maxLength={30}
            allowClear
          />
        </div>
        <Form layout="vertical">
          <Form.Item label="Nombre del participante">
            {datoFiltrado.map((item) => (
              <div key={item}>
                <p> {item.nombre}</p>
              </div>
            ))}
          </Form.Item>
        </Form>
      </Modal>

      {/*Modal para buscar un entrenador*/}
      <Modal
        title="Selecionar un entrenador"
        open={buscarEntrenador}
        onCancel={handleCancelEntrenador}
        footer={[
          <Form>
            <Button type="primary" onClick={aniadirEntrenador}>
              Añadir
            </Button>
          </Form>,
        ]}
      >
        <label>CI del entrenador</label>
        <div>
          <Search
            placeholder="Buscar entrenador"
            value={searchEntrenador}
            onSearch={onSearchEntrenador}
            onChange={(e) => onSearchEntrenador(e.target.value)}
            maxLength={30}
            allowClear
          />
        </div>
        <Form layout="vertical">
          <Form.Item label="Nombre del Entrenador">
            {datoFiltradoEntrenador.map((item) => (
              <div key={item}>
                <p> {item.nombre}</p>
              </div>
            ))}
          </Form.Item>
        </Form>
      </Modal>

     
    </div>
  );
}

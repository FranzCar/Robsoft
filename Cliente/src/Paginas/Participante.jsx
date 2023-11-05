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
} from "antd";
import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  ExclamationCircleFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Column from "antd/es/table/Column";

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

  useEffect(() => {
    obtenerParticipantes();
    obtenerParticipantesCI();
    obtenerEntrenadores();
    obtenerGrupos();
  }, []);

//*Kevin
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
    const minDate = new Date()
    minDate.setDate(today.getDate() -10957);

    // Comparamos si la fecha actual está antes de la fecha máxima
    return current > maxDate | current < minDate;
  };
  //Mensaje de confirmacion al dar guardar en la parte de modal del participante
  const showConfirm = (values) => {
    confirm({
      title: "¿Esta seguro de registrarse?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        confirmSave(values);
      },
      onCancel() {},
    });
  };
  //Mensaje al dar al boton cancelar del formulario de crear registro
  const showCancel = () => {
    confirm({
      title: "¿Esta seguro de que desea cancelar su registro? Se perdera el progreso realizado.",
      icon: <ExclamationCircleFilled />,

      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVisible(false);

        setFileList([]);
        setFileList1([]);
        form.resetFields();
      },
      onCancel() {},
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
      institucion: values.INSTITUCION,
      fechaNacimiento: NUEVAFECHA,
      talla_polera: values.TALLA_POLERA,
      codigoSIS: values.CODIGOSIS,
      foto: fileList1.length > 0 ? fileList1[0].thumbUrl : null,
      certificado: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };
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
      message.error("Existe un participante con el mismo carnet de identidad.");
    } else {
    console.log("Se guarda los datos en la BD");
    axios
      .post("http://localhost:8000/api/guardar-participante", datos)
      .then((response) => {
        console.log("Datos guardados con éxito", response.data);
        message.success("El participante se registró correctamente");
      
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
      onCancel() { },
    });
  };

  //Mensaje al dar al boton cancelar del formulario de registrar equipo
  const showCancelGrupal = () => {
    confirm({
      title: "¿Estás seguro de que desea cancelar su registro? Se perdera el progreso realizado. ",
      icon: <ExclamationCircleFilled />,
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        setNombreEntrenador("");
        setListaParticipante([]);
        setListaID_Persona([])
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
    setListaID_Persona([])
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
      participantes:listaID_Persona,
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
    console.log("los datos que se recuperan del grupo son ", datos)
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
    }else {
      callback();//sin error
    }
  };
  //validar CodigoSis
  const validarCodigoSis = (_, value, callback) => {
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
    callback();//sin error
  }
  };
  return (
    <div className="pagina-evento">
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

      {/*Ventana emergente para el formulario de crear participante Individual */}
      <Modal
        title="Formulario de registro individual"
        className="modal-registro"
        open={visible}
        okText="Guardar"
        cancelText="Cancelar"
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Form form={form} onFinish={onFinish}>
            <Button onClick={showCancel} className="boton-cancelar-registro">
              Cancelar
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              className="boton-guardar-registro"
            >
              Guardar
            </Button>
          </Form>,
        ]}
      >
        <Form
          className="form-persona"
          name="formulario_persona"
          autoComplete="off"
          onFinishFailed={onFinishFailed}
          form={form}
        >
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
              style={{ width: "370px" }}
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
              style={{ width: "178px" }}
              placeholder="Selecciona una fecha"
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
                label="Carnet de identidad"
                name="CI"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese su nro de carnet",
                  },
                  { validator: validarMinimoCI },
                ]}
              >
                <Input
                  maxLength={8}
                  minLength={7}
                  style={{ width: "175px" }}
                  placeholder="Ingrese su nro de carnet"
                  onKeyPress={onlyNumbers}
                ></Input>
              </Form.Item>

          <Row gutter={[16, 8]}>
            <Col span={12}>
              

              <Form.Item
                label="Celular"
                name="TELEFONO"
                style={{ width: "280px" ,maxWidth: "100%"}}
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese un telefono",
                  },
                  {
                    validator:validarTelefono,
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el telefono"
                  maxLength={8}
                  minLength={8}
                  style={{ width: "175px" }}
                  onKeyPress={onlyNumbers}
                ></Input>
              </Form.Item>

              <Form.Item
                label="Institucion"
                name="INSTITUCION"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese la institucion",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el nombre de la Institucion"
                  maxLength={60}
                  minLength={4}
                  onKeyPress={onlyLetters}
                ></Input>
              </Form.Item>
              <Form.Item
                label="Semestre"
                name="SEMESTRE"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese el semestre",
                  },
                ]}
              >
                <Select placeholder="Ingrese el semestre" options={options} />
  
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
            <Col span={10}>
              <Form.Item
                label="Genero"
                name="GENERO"
                style={{ width: "270px",maxWidth: "100%" }}
                rules={[
                  {
                    required: true,message: "Por favor seleccione un genero ",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="Femenino">Femenino</Select.Option>
                  <Select.Option value="Masculino">Masculino</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item 
                label="Correo electronico" 
                name="CORREO"
                rules={[
                  {
                          type: "email",
                          message: "El correo electrónico no es válido.",
                        },
                ]}
                  >
                  <Input
                  placeholder="Ingrese su correo"
                  maxLength={30}
                  minLength={5}
                ></Input>
              </Form.Item>

             {/* <Form.Item
                label="Codigo SIS"
                name="CODIGOSIS"
                style={{ width: "230px" ,maxWidth: "100%"}}
                 rules={[
                  {
                    requires:false,
                    validator:validarCodigoSis,
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese su codigo sis"
                  maxLength={9}
                  minLength={9}
                  onKeyPress={onlyNumbers}
                ></Input>
              </Form.Item>*/}
              <Form.Item
                label="Talla de polera"
                name="TALLA_POLERA"
                style={{ width: "190px" }}
              >
                <Select>
                  <Select.Option value="S">S</Select.Option>
                  <Select.Option value="M">M</Select.Option>
                  <Select.Option value="L">L</Select.Option>
                  <Select.Option value="XL">XL</Select.Option>
                  <Select.Option value="XXL">XXL</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Foto" name="FOTO">
                <Upload
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
            <Button onClick={showCancelGrupal} className="boton-cancelar-registro">
            Cancelar</Button>
            <Button  
            type="primary" 
            htmlType="submit"
            className="boton-guardar-registro">
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

  

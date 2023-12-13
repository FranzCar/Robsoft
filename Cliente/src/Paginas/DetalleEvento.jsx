import "../App.css";
import { URL_API } from "../Servicios/const.js";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Radio,
  Select,
  Input,
  Slider,
  message,
  Upload
} from "antd";
import React, { useState, useEffect } from "react";
import {
  SettingOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";

const { Column } = Table;
const { confirm } = Modal;

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
  const [listaEtapas, setListaEtapas] = useState([]);
  const [horaReservada, setHoraReservada] = useState(null);
  const [fechaInicioBD, setFechaInicioBD] = useState(null);
  const [fechaFinBD, setFechaFinBD] = useState(null);
  const [requisitos, setRequisitos] = useState("");
  const [mostrarInputURL, setMostrarInputURL] = useState(false);
  const [mostrarUbicacion, setMostrarUbicacion] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [horafin, setHoraFin] = useState(null);
  const [idEvento, setIdEvento] = useState(null);
  const [listaFacilitadores, setListaFacilitadores] = useState([]);
  const [estadoEntrenador, setEstadoEntrenador] = useState(false);
  const [tituloEvento, setTituloEvento] = useState(null);
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
        setModalDetalles(false);
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
        setFechaFinBD(null);
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

  //Guardamos los detalles del evento y las actividades q se tiene
  const guardarDetalles = async (values, id) => {
    //Obtenemos los datos de los formularios
    const formModalidad = form.getFieldValue("modalidad");
    const formParticipacion = form.getFieldValue("participacion");
    const formCategoria = form.getFieldValue("categoria");
    const formCosto = form.getFieldValue("costo");
    const formCupos = form.getFieldValue("cupos");
    const formRequisitos = form.getFieldValue("requisitos");
    const formEntrenador = form.getFieldValue("entrenador");
    const formIntegrantes = form.getFieldValue("integrantes");

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
      caracteristica_11: formIntegrantes,
    };
    console.log("Los datos a enviar a la base de datos son ", datos);

    axios
      .post(`${URL_API}/detallar-evento/${id}`, datos)
      .then((response) => {
        message.success("Los detalles del evento se guardaron correctamente");
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
        setFechaFinBD(null);
        setFechaInicio(null);
        setFechaFin(null);
        setHoraInicio(null);
        setHoraFin(null);
        setMostrarInputURL(false);
        setMostrarUbicacion(false);
        setModalDetalles(false);
        form.resetFields();
        formActividades.resetFields();
      })
      .catch((error) => {
        console.log(error);
      });
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
      .get(`${URL_API}/eventos-modificables`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  //Se agrega los forms a la segunda pestaña dependiendo del tipo de evento
  const showDetalle = (record) => {
    axios
      .get(`${URL_API}/evento-con-detalles/${record.id_evento}`)
      .then((response) => {
        const conDetalles = response.data.tieneDetalles;

        if (conDetalles === false) {
          setTituloEvento(record.TITULO);
          setFechaInicioBD(record.FECHA_INICIO);
          setFechaFinBD(record.FECHA_FIN);
          setIdEvento(record.id_evento);
          setTipoEvento(record.TIPO_EVENTO);
          formularioDetalles(record);
        } else {
          message.info("El evento ya tiene detalles");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
      form.resetFields(["integrantes"]);
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

 

  /*Parte de las etapas*/

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
          form.resetFields(["requisitos"]);
        }
      }
    }
  };

  const obtenerListaFacilitadores = () => {
    axios
      .get(`${URL_API}/lista-facilitadores`)
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

  //Ultimo Sprint
  const [modalDetalles, setModalDetalles] = useState(false);
  const [tipoEvento, setTipoEvento] = useState(null);

  const handleCancelDetalles = () => {
    setModalDetalles(false);
  };

  const formularioDetalles = (record) => {
    const tipoEvento = record.TIPO_EVENTO;
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
    setModalDetalles(true);
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
              {/* Boton para mostrar detalle  */}
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

      {/*Modal para el formulario de detalles */}
      <Modal
        title={"Detalles del evento: " + tituloEvento}
        open={modalDetalles}
        onCancel={handleCancelDetalles}
        maskClosable={false}
        keyboard={false}
        closable={false}
        centered
        width={1000}
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
        {mostrarFormICPC && (
          <Form className="form-ICPC" form={form} onFinish={registrarDetalle}>
            <div className="modal-icpc">
              <div className="columna1-icpc">
                <Form.Item
                  label="Participación"
                  name="participacion"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione un tipo de participación",
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
                  label="Nro. integrantes"
                  name="integrantes"
                  initialValue={2}
                  rules={[
                    {
                      required: estadoEntrenador,
                      message: "Por favor, determinar el tamaño del equipo",
                    },
                  ]}
                >
                  <Slider min={2} max={5} disabled={!estadoEntrenador} />
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
                      message: "Por favor, seleccione una opción",
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
                <Form.Item label="Cupos" name="cupos"  initialValue={20}>
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
          </Form>
        )}
        {mostrarFormLibre && (
          <Form className="form-ICPC" form={form} onFinish={registrarDetalle}>
            <div className="modal-icpc">
              <div className="columna1-icpc">
                <Form.Item
                  label="Participación"
                  name="participacion"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione un tipo de participación",
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
                  label="Nro. integrantes"
                  name="integrantes"
                  initialValue={2}
                  rules={[
                    {
                      required: estadoEntrenador,
                      message: "Por favor, determinar el tamaño del equipo",
                    },
                  ]}
                >
                  <Slider min={2} max={5} disabled={!estadoEntrenador} />
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
                      message: "Por favor, seleccione una opción",
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
                <Form.Item label="Cupos" name="cupos" initialValue={20}>
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
          </Form>
        )}
        {mostrarFormTaller && (
          <Form className="form-ICPC" form={form} onFinish={registrarDetalle}>
            <div className="modal-icpc">
              <div className="columna1-icpc">
                <Form.Item
                  label="Participación"
                  name="participacion"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione un tipo de participación",
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
                  label="Nro. integrantes"
                  name="integrantes"
                  initialValue={2}
                  rules={[
                    {
                      required: estadoEntrenador,
                      message: "Por favor, determinar el tamaño del equipo",
                    },
                  ]}
                >
                  <Slider min={2} max={5} disabled={!estadoEntrenador} />
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
                      message: "Por favor, seleccione una opción",
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
                <Form.Item label="Cupos" name="cupos" initialValue={20}>
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
          </Form>
        )}
        {mostrarFormEntrenamiento && (
          <Form className="form-ICPC" form={form} onFinish={registrarDetalle}>
            <div className="modal-icpc">
              <div className="columna1-icpc">
                <Form.Item
                  label="Participación"
                  name="participacion"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione un tipo de participación",
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
                  label="Nro. integrantes"
                  name="integrantes"
                  initialValue={2}
                  rules={[
                    {
                      required: estadoEntrenador,
                      message: "Por favor, determinar el tamaño del equipo",
                    },
                  ]}
                >
                  <Slider min={2} max={5} disabled={!estadoEntrenador} />
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
                  <Radio.Group onChange={onChangeEntrenamiento} value={value5}>
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
                      message: "Por favor, seleccione una opción",
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
                <Form.Item label="Cupos" name="cupos" initialValue={20}>
                  <Slider min={20} max={100} />
                </Form.Item>
                <Form.Item label="Requisitos" name="requisitos">
                  <TextArea value={requisitos} readOnly></TextArea>
                </Form.Item>
                <Form.Item label="Contenido del entrenamiento" name="bases">
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
          </Form>
        )}
        {mostrarFormReclutamiento && (
          <Form className="form-ICPC" form={form} onFinish={registrarDetalle}>
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
                      message: "Por favor, seleccione una opción",
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
          </Form>
        )}
        {mostrarFormTorneo && (
          <Form className="form-ICPC" form={form} onFinish={registrarDetalle}>
            <div className="modal-icpc">
              <div className="columna1-icpc">
                <Form.Item
                  label="Participación"
                  name="participacion"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione un tipo de participación",
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
                  label="Nro. integrantes"
                  name="integrantes"
                  initialValue={2}
                  rules={[
                    {
                      required: estadoEntrenador,
                      message: "Por favor, determinar el tamaño del equipo",
                    },
                  ]}
                >
                  <Slider min={2} max={5} disabled={!estadoEntrenador} />
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
                      message: "Por favor, seleccione una opción",
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
                <Form.Item label="Costo" name="costo">
                  <Input
                    placeholder="Ingrese el costo"
                    onKeyPress={onlyNumbers}
                    maxLength={3}
                  />
                </Form.Item>
                <Form.Item label="Cupos" name="cupos" initialValue={20}>
                  <Slider min={20} max={100} />
                </Form.Item>
                <Form.Item label="Requisitos" name="requisitos">
                  <TextArea value={requisitos} readOnly></TextArea>
                </Form.Item>
              </div>
            </div>
          </Form>
        )}
        {mostrarFormOtro && (
          <Form className="form-ICPC" form={form} onFinish={registrarDetalle}>
            <div className="modal-icpc">
              <div className="columna1-icpc">
                <Form.Item
                  label="Participación"
                  name="participacion"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione un tipo de participación",
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
                  label="Nro. integrantes"
                  name="integrantes"
                  initialValue={2}
                  rules={[
                    {
                      required: estadoEntrenador,
                      message: "Por favor, determinar el tamaño del equipo",
                    },
                  ]}
                >
                  <Slider min={2} max={5} disabled={!estadoEntrenador} />
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
                      message: "Por favor, seleccione un tipo de modalidad",
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
                      message: "Por favor, seleccione una opción",
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
                <Form.Item label="Costo" name="costo">
                  <Input
                    placeholder="Ingrese el costo"
                    onKeyPress={onlyNumbers}
                    maxLength={3}
                  />
                </Form.Item>
                <Form.Item label="Cupos" name="cupos" initialValue={20}>
                  <Slider min={20} max={100} />
                </Form.Item>
                <Form.Item label="Requisitos" name="requisitos">
                  <TextArea value={requisitos} readOnly></TextArea>
                </Form.Item>
              </div>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}

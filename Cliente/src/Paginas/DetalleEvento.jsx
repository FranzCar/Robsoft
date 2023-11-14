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
  QRCode,
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

const { TabPane } = Tabs;
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
  const [value7, setValue7] = useState(1);
  const handleCancelIMG = () => setPreviewOpen(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [verEtapa, setVerEtapa] = useState(false);
  const [verHoraReserva, setVerHoraReserva] = useState(false);
  const [selectionType, setSelectionType] = useState("checkbox");
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
  const [valueParticipacion, setValueParticipacion] = useState(false);
  const [form] = Form.useForm();
//Kevin
 //Solo permitir numeros en los input
  function onlyNumbers(event) {
  const key = event.key;

  if (!key.match(/[0-9]/)) {
    event.preventDefault();
  }
}
const showCancelDetalle = () => {
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
        form.resetFields();
      },
      onCancel() {},
    });
  };
  //Guardar datos del formulario Detalle
  const registrarDetalle= (values) => {
    showConfirmDetalle(values);
    console.log("Los valores de los datos del detalle son ", values);
  };
   //Mensaje de confirmacion al dar guardar en la parte de registro de los detalles
  const showConfirmDetalle = (values) => {
    confirm({
      title: "¿Esta seguro de guardar este registro?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Si",
      cancelText: "No",
      centered: "true",
      onOk() {
        guardarDetalle(values);
      },
      onCancel() { },
    });
  };
  //Guardar DetalleEvento
   const guardarDetalle = (values) => {
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

  const onChangeEtapa = (e) => {
    setValue7(e.target.value);
  };
  const onChangeParticipacion = (e) => {
    setValueParticipacion(e.target.value);
  };

  const cerrarReservaHora = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerHoraReserva(false);
      },
      onCancel() {},
    });
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

  //Ver el modal de etapa
  const showEtapa = () => {
    setVerEtapa(true);
  };

  //Modal para reservar una hora
  const reservarHora = () => {
    setVerHoraReserva(true);
  };

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
  ];

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
        form.resetFields();
      },
      onCancel() {},
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const handleGuardarClick = () => {
    // Aquí puedes utilizar la variable selectedRows que contiene los elementos seleccionados.
    console.log("Datos seleccionados:", selectedRows);

    // Agrega aquí tu lógica para guardar o procesar los datos según tus necesidades.
  };

  const showGuardarHoras = (values) => {
    confirm({
      title: "¿Desea agregar las horas seleccionadas?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        handleGuardarClick();
      },
      onCancel() {},
    });
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

      {/*Modal para elegir las horas q se quiere reservar */}
      <Modal
        title="??"
        open={verHoraReserva}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form>
            <Button onClick={cerrarReservaHora}>Cancelar</Button>
            <Button type="primary" onClick={showGuardarHoras}>
              Agregar
            </Button>
          </Form>,
        ]}
      >
        <Table
          scroll={{ y: 350 }}
          dataSource={horarios}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          pagination={false}
          locale={{
            emptyText: (
              <div style={{ padding: "30px", textAlign: "center" }}>
                NO hay horarios para seleccionar
              </div>
            ),
          }}
        >
          <Column title="Horario" dataIndex="hora" key="horario" />
          <Column
            title="Estado de la ubicacion"
            dataIndex="estado"
            key="estado"
          />
        </Table>
      </Modal>

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
            <Button onClick={showCancelDetalle} className="boton-cancelar-detalle">
            Cancelar</Button>
            <Button  
            type="primary" 
            htmlType="submit"
            className="boton-guardar-detalle">
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
            tab={<span style={{ color: "black" }}>Etapas</span>}
            key="1"
            className="tab1"
           >
            <div className={`contenido ${activeTab === "1" ? "color1" : ""}`}>
              <Form form={form} className="formEtapas">
                <div className="etapas-hora">
                  <div className="etapas-columna1">
                    <Form.Item
                      label="Nombre de la etapa"
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
                      label="Modalidad de la etapa"
                      name="MODALIDAD_ETAPA"
                      rules={[
                        {
                          required: true,
                          message: "Por favor, seleccione una etapa",
                        },
                      ]}
                    >
                      <Radio.Group onChange={onChangeEtapa} value={value7}>
                        <Radio value={1}>En linea</Radio>
                        <Radio value={2}>Presencial</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      label="Fecha de etapa"
                      name="FECHA_ETAPA"
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
                      />
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
                      <Select
                        allowClear
                        options={[
                          {
                            value: "1",
                            label: "Auditorio",
                          },
                          {
                            value: "2",
                            label: "Laboratorio 1",
                          },
                          {
                            value: "3",
                            label: "Laboratorio 2",
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className="etapas-columna2">
                    <Form.Item name="HORA_ETAPA">
                      <div className="reservar-hora-input">
                        <div>
                          <Button onClick={reservarHora}>Reservar hora</Button>
                        </div>
                        <div>
                          <Input></Input>
                        </div>
                      </div>
                    </Form.Item>
                    <Table></Table>
                  </div>
                </div>
              </Form>
            </div>
          </TabPane>
          <TabPane
            tab={<span style={{ color: "black" }}>Detalles</span>}
            key="2"
           >
            <div className={`contenido ${activeTab === "2" ? "color2" : ""}`}>
              {mostrarFormICPC && (
                <Form className="form-ICPC">
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item 
                      label="Participación"
                      name="participacion"
                      rules={[
                        {
                          required: true,
                          message: "Por favor, seleccione un tipo de participacion",
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
                        <Radio.Group onChange={onChangeICPC} value={value}>
                          <Radio value={1}>Interno</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="Fecha límite de inscripción">
                        <DatePicker
                          style={{ width: "180px" }}
                          placeholder="Selecione una fecha"
                        />
                      </Form.Item>
                      <Form.Item label="Dirigido a" 
                      name="dirigido a"
                      className="icpc-dirigido"
                        rules={[
                          {
                            required: true,
                            message:"Por favor, seleccione una opcion",
                          }
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
                      rules={[
                          {
                            required: true,
                            message: "Suba los archivos necesarios",
                          }
                        ]}
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
                        maxLength={3}/>
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={5} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea showCount ></TextArea>
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
              {mostrarFormLibre && (
                <Form className="form-ICPC">
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
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
                      <Form.Item label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione una modalidad",
                          },
                        ]}
                      >
                        <Radio.Group onChange={onChangeLibre} value={value2}>
                          <Radio value={1}>Interno</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="Fecha límite de inscripción">
                        <DatePicker
                          style={{ width: "180px" }}
                          placeholder="Selecione una fecha"
                        />
                      </Form.Item>
                      <Form.Item label="Dirigido a" 
                      className="icpc-dirigido"
                      name="dirigido a"
                      rules={[
                        {
                          required: true,
                          message:"Por favor, seleccione una opcion",
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

                      <Form.Item label="Bases del evento reglas y premios"
                        name="bases"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
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
                        <Input placeholder="Ingrese el costo" 
                        onKeyPress={onlyNumbers}
                        maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={5} max={100} />
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
                <Form className="form-ICPC">
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
                          }
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
                      <Form.Item label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                             message: "Seleccione una modalidad",
                          }
                        ]}
                      >
                        <Radio.Group onChange={onChangeTaller} value={value3}>
                          <Radio value={1}>Interno</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="Fecha límite de inscripción">
                        <DatePicker
                          style={{ width: "180px" }}
                          placeholder="Selecione una fecha"
                        />
                      </Form.Item>
                      <Form.Item label="Facilitador" className="icpc-dirigido"
                        name="facilitador"
                        rules={[
                          {
                            required: true,
                          }
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
                      <Form.Item label="Dirigido a" className="icpc-dirigido"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message:"Por favor, seleccione una opcion",
                          }
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
                        <Input placeholder="Ingrese el costo" 
                        onKeyPress={onlyNumbers}
                        maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={5} max={100} />
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
                <Form className="form-ICPC">
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
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
                      <Form.Item label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                             message: "Seleccione una modalidad",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={onChangeEntrenamiento}
                          value={value5}
                        >
                          <Radio value={1}>Interno</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="Fecha límite de inscripción">
                        <DatePicker
                          style={{ width: "180px" }}
                          placeholder="Selecione una fecha"
                        />
                      </Form.Item>
                      <Form.Item label="Entrenador" className="icpc-dirigido"
                        name="entrenador"
                        rules={[
                          {
                            required: true,
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
                      <Form.Item label="Dirigido a" className="icpc-dirigido"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message:"Por favor, seleccione una opcion",
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
                        <Input placeholder="Ingrese el costo" 
                        onKeyPress={onlyNumbers}
                        maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={5} max={100} />
                      </Form.Item>
                      <Form.Item label="Requisitos">
                        <TextArea showCount ></TextArea>
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
                <Form>
                  <div className="form-reclutamiento">
                    <div className="columna1-reclutamiento" >
                      <Form.Item label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                             message: "Seleccione una modalidad",
                          }
                        ]}
                      >
                        <Radio.Group onChange={onChangeTorneo} value={value4}>
                          <Radio value={1}>Interno</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="Fecha fin de inscripciones">
                        <DatePicker placeholder="Seleccione una fecha" className="fecha-reclutamiento"/>
                      </Form.Item>
                      <Form.Item label="Dirigido a"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message:"Por favor, seleccione una opcion",
                          }
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
                      <Form.Item label="Facilitador"
                        name="facilitador"
                        rules={[
                          {
                            required: true,
                          }
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
                <Form className="form-ICPC">
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
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
                      <Form.Item label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                             message: "Seleccione una modalidad",
                          },
                        ]}
                      >
                        <Radio.Group onChange={onChangeTorneo} value={value5}>
                          <Radio value={1}>Interno</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="Fecha límite de inscripción">
                        <DatePicker
                          style={{ width: "180px" }}
                          placeholder="Selecione una fecha"
                        />
                      </Form.Item>
                      <Form.Item label="Dirigido a" 
                      className="icpc-dirigido"
                      name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message:"Por favor, seleccione una opcion",
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

                      <Form.Item label="Bases del evento reglas y premios"
                        name="bases"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
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
                        <Input placeholder="Ingrese el costo" 
                        onKeyPress={onlyNumbers}
                        maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={5} max={100} />
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
                <Form className="form-ICPC">
                  <div className="modal-icpc">
                    <div className="columna1-icpc">
                      <Form.Item label="Participación"
                        name="participacion"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, seleccione un tipo de participacion",
                          }
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
                      <Form.Item label="Modalidad"
                        name="modalidad"
                        rules={[
                          {
                            required: true,
                          }
                        ]}
                      >
                        <Radio.Group onChange={onChangeOtros} value={value6}>
                          <Radio value={1}>Interno</Radio>
                          <Radio value={2}>Abierto</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="Fecha límite de inscripción">
                        <DatePicker
                          style={{ width: "180px" }}
                          placeholder="Selecione una fecha"
                        />
                      </Form.Item>
                      <Form.Item label="Responsable" className="icpc-dirigido"
                        name="responsable"
                        rules={[
                          {
                            required: true,
                          }
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
                      <Form.Item label="Dirigido a" className="icpc-dirigido"
                        name="dirigido a"
                        rules={[
                          {
                            required: true,
                            message:"Por favor, seleccione una opcion",
                          }
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
                        <Input placeholder="Ingrese el costo" 
                        onKeyPress={onlyNumbers}
                        maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item label="Cupos">
                        <Slider min={5} max={100} />
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

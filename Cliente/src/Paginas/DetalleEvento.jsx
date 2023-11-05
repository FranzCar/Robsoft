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
} from "antd";
import React, { useState, useEffect } from "react";
import {
  SettingOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

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
  const [verICPC, setVerICPC] = useState(false);
  const [verLibre, setVerLibre] = useState(false);
  const [verProgramacion, setVerProgramacion] = useState(false);
  const [verReclutamiento, setVerReclutamiento] = useState(false);
  const [verTorneo, setVerTorneo] = useState(false);
  const [verEntenamiento, setVerEntenamiento] = useState(false);
  const [verOtros, setVerOtros] = useState(false);
  const [value, setValue] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const handleCancelIMG = () => setPreviewOpen(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [verEtapa, setVerEtapa] = useState(false);
  const [verHoraReserva, setVerHoraReserva] = useState(false);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRows, setSelectedRows] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // Actualiza el estado con las filas seleccionadas
      setSelectedRows(selectedRows);
    },
  };

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
  //Verificar cual es el tipo de evento
  const showDetalle = (record) => {
    const tipoEvento = record.TIPO_EVENTO;
    console.log("El tipo de evento es ", tipoEvento);
    if (tipoEvento === "Estilo ICPC") {
      setVerICPC(true);
    } else if (tipoEvento === "Estilo Libre") {
      setVerLibre(true);
    } else if (tipoEvento === "Taller de programación") {
      setVerProgramacion(true);
    } else if (tipoEvento === "Sesión de reclutamiento") {
      setVerReclutamiento(true);
    } else if (tipoEvento === "Torneos de programación") {
      setVerTorneo(true);
    } else if (tipoEvento === "Entrenamientos") {
      setVerEntenamiento(true);
    } else if (tipoEvento === "Otros") {
      setVerOtros(true);
    }
  };

  //Cerrar modal de cada tipo de evento
  const cerrarICPC = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerICPC(false);
      },
      onCancel() {},
    });
  };

  const cerrarLibre = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerLibre(false);
      },
      onCancel() {},
    });
  };

  const cerrarProgramacion = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerProgramacion(false);
      },
      onCancel() {},
    });
  };

  const cerrarReclutamiento = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerReclutamiento(false);
      },
      onCancel() {},
    });
  };

  const cerrarTorneo = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerTorneo(false);
      },
      onCancel() {},
    });
  };

  const cerrarEntrenamiento = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerEntenamiento(false);
      },
      onCancel() {},
    });
  };

  const cerrarOtros = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerOtros(false);
      },
      onCancel() {},
    });
  };

  const cerrarEtapa = () => {
    confirm({
      title: "¿Está seguro de que desea cerrar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVerEtapa(false);
      },
      onCancel() {},
    });
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
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
    { key: 1, hora: "8:00 AM", estado: "Libre" },
    { key: 2, hora: "8:30 AM", estado: "Ocupado" },
    { key: 3, hora: "9:00 AM", estado: "Libre" },
    { key: 4, hora: "9:30 AM", estado: "Libre" },
    { key: 5, hora: "10:00 AM", estado: "Ocupado" },
    { key: 6, hora: "10:30 AM", estado: "Ocupado" },
    { key: 7, hora: "11:00 AM", estado: "Libre" },
    { key: 8, hora: "11:30 AM", estado: "Ocupado" },
    { key: 9, hora: "12:00 PM", estado: "Libre" },
    { key: 10, hora: "12:30 PM", estado: "Libre" },
    { key: 11, hora: "1:00 PM", estado: "Ocupado" },
    { key: 12, hora: "1:30 PM", estado: "Ocupado" },
    { key: 13, hora: "2:00 PM", estado: "Libre" },
    { key: 14, hora: "2:30 PM", estado: "Ocupado" },
    { key: 15, hora: "3:00 PM", estado: "Libre" },
    { key: 16, hora: "3:30 PM", estado: "Ocupado" },
    { key: 17, hora: "4:00 PM", estado: "Ocupado" },
    { key: 18, hora: "4:30 PM", estado: "Libre" },
    { key: 19, hora: "5:00 PM", estado: "Ocupado" },
    { key: 20, hora: "5:30 PM", estado: "Ocupado" },
  ];

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

      {/*MODAL ESTILO ICPC*/}
      <Modal
        title="Carateristicas estilo ICPC"
        open={verICPC}
        maskClosable={false}
        keyboard={false}
        closable={false}
        width={800}
        footer={[
          <Form>
            <Button onClick={cerrarICPC}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
          </Form>,
        ]}
      >
        <Form>
          <div className="modal-icpc">
            <div className="columna1-icpc">
              <Form.Item label="Modalidad">
                <Radio.Group onChange={onChange} value={value}>
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
              <Form.Item label="Dirigido a">
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
              <Form.Item label="Cupos">
                <Slider min={5} max={100} />
              </Form.Item>
              <Form.Item label="Bases del evento reglas y premios">
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
                <Input placeholder="Ingrese el costo" />
              </Form.Item>
              <label>Añadir etapa</label>
              <Button type="link" onClick={showEtapa}>
                <PlusOutlined />
              </Button>
              <Form.Item label="Cronograma" labelCol={{ span: 24 }}>
                <Table
                  //dataSource={horarios}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <div style={{ padding: "30px", textAlign: "center" }}>
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
                  <Column title="Horario" dataIndex="horario" key="horario" />
                </Table>
              </Form.Item>
              <Form.Item label="Requisitos"></Form.Item>
            </div>
          </div>
        </Form>
      </Modal>

      {/*MODAL ESTILO LIBRE*/}
      <Modal
        title="Estilo Libre"
        open={verLibre}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form>
            <Button onClick={cerrarLibre}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
          </Form>,
        ]}
      >
        <Form>
          <Form.Item label="Tipo">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Interno</Radio>
              <Radio value={2}>Abierto</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Fecha fin de inscripciones">
            <DatePicker placeholder="Seleccione una fecha" />
          </Form.Item>
          <Form.Item label="Categoria">
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
          <Form.Item label="Cupos">
            <Input placeholder="Ingrese el limite de cupos" />
          </Form.Item>
          <Form.Item label="Costo">
            <Input placeholder="Ingrese el costo" />
          </Form.Item>
          <Form.Item label="Contactos">
            <QRCode value="Contactos del evento" />
          </Form.Item>
          <Form.Item label="Reglas"></Form.Item>
          <Form.Item label="Premios"></Form.Item>
          <Form.Item label="Requisitos"></Form.Item>
        </Form>
      </Modal>

      {/*MODAL TALLER DE PROGRAMACION*/}
      <Modal
        title="Taller de programación"
        open={verProgramacion}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form>
            <Button onClick={cerrarProgramacion}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
          </Form>,
        ]}
      >
        <Form>
          <Form.Item label="Tipo">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Interno</Radio>
              <Radio value={2}>Abierto</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Fecha fin de inscripciones">
            <DatePicker placeholder="Seleccione una fecha" />
          </Form.Item>
          <Form.Item label="Categoria">
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
          <Form.Item label="Cupos">
            <Input placeholder="Ingrese el limite de cupos" />
          </Form.Item>
          <Form.Item label="Costo">
            <Input placeholder="Ingrese el costo" />
          </Form.Item>
          <Form.Item label="Facilitador">
            <Input placeholder="Ingrese el nombre del facilitador" />
          </Form.Item>
          <Form.Item label="Contactos">
            <QRCode value="Contactos del evento" />
          </Form.Item>
          <Form.Item label="Contenido"></Form.Item>
        </Form>
      </Modal>

      {/*MODAL SESION DE RECLUTAMIENTO*/}
      <Modal
        title="Sesión de reclutamiento"
        open={verReclutamiento}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form>
            <Button onClick={cerrarReclutamiento}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
          </Form>,
        ]}
      >
        <Form>
          <Form.Item label="Facilitador">
            <Input placeholder="Ingrese el nombre del facilitador" />
          </Form.Item>
          <Form.Item label="Contenido">
            <Input />
          </Form.Item>
          <Form.Item label="Contactos">
            <QRCode value="Contactos del evento" />
          </Form.Item>
        </Form>
      </Modal>

      {/*MODAL TORNEOS DE PROGRAMACION*/}
      <Modal
        title="Torneo de programación"
        open={verTorneo}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form>
            <Button onClick={cerrarTorneo}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
          </Form>,
        ]}
      >
        <Form>
          <Form.Item label="Tipo">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Interno</Radio>
              <Radio value={2}>Abierto</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Fecha fin de inscripciones">
            <DatePicker placeholder="Seleccione una fecha" />
          </Form.Item>
          <Form.Item label="Categoria">
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
          <Form.Item label="Cupos">
            <Input placeholder="Ingrese el limite de cupos" />
          </Form.Item>
          <Form.Item label="Costo">
            <Input placeholder="Ingrese el costo" />
          </Form.Item>
          <Form.Item label="Contactos">
            <QRCode value="Contactos del evento" />
          </Form.Item>
          <Form.Item label="Reglas"></Form.Item>
          <Form.Item label="Premios"></Form.Item>
          <Form.Item label="Requisitos"></Form.Item>
        </Form>
      </Modal>

      {/*MODAL ENTRENAMIENTOS*/}
      <Modal
        title="Entrenamiento"
        open={verEntenamiento}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form>
            <Button onClick={cerrarEntrenamiento}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
          </Form>,
        ]}
      >
        <Form>
          <Form.Item label="Tipo">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Interno</Radio>
              <Radio value={2}>Abierto</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Entrenador">
            <Input placeholder="Ingrese el nombre del entrenador" />
          </Form.Item>
          <Form.Item label="Fecha fin de inscripciones">
            <DatePicker placeholder="Seleccione una fecha" />
          </Form.Item>
          <Form.Item label="Categoria">
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
          <Form.Item label="Cupos">
            <Input placeholder="Ingrese el limite de cupos" />
          </Form.Item>
          <Form.Item label="Costo">
            <Input placeholder="Ingrese el costo" />
          </Form.Item>
          <Form.Item label="Contactos">
            <QRCode value="Contactos del evento" />
          </Form.Item>
          <Form.Item label="Contenido"></Form.Item>
        </Form>
      </Modal>

      {/*MODAL OTROS*/}
      <Modal
        title="Otro tipo de evento"
        open={verOtros}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form>
            <Button onClick={cerrarOtros}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
          </Form>,
        ]}
      >
        <Form>
          <Form.Item label="Tipo">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Interno</Radio>
              <Radio value={2}>Abierto</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Facilitador">
            <Input placeholder="Ingrese el nombre del facilitador" />
          </Form.Item>
          <Form.Item label="Fecha fin de inscripciones">
            <DatePicker placeholder="Seleccione una fecha" />
          </Form.Item>
          <Form.Item label="Categoria">
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
          <Form.Item label="Cupos">
            <Input placeholder="Ingrese el limite de cupos" />
          </Form.Item>
          <Form.Item label="Costo">
            <Input placeholder="Ingrese el costo" />
          </Form.Item>
          <Form.Item label="Contactos">
            <QRCode value="Contactos del evento" />
          </Form.Item>
          <Form.Item label="Contenido"></Form.Item>
          <Form.Item label="Reglas"></Form.Item>
          <Form.Item label="Premios"></Form.Item>
          <Form.Item label="Requisitos"></Form.Item>
        </Form>
      </Modal>

      {/*Modal añadir etapa*/}
      <Modal
        title="Añadir etapa"
        open={verEtapa}
        footer={[
          <Form>
            <Button onClick={cerrarEtapa}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
          </Form>,
        ]}
      >
        <Form.Item label="Nombre de la etapa">
          <Input placeholder="Ingrese el nombre de la etapa" />
        </Form.Item>
        <Form.Item label="Modalidad de la etapa">
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>En linea</Radio>
            <Radio value={2}>Presencial</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Fecha de etapa">
          <DatePicker placeholder="Seleccione la fecha de la etapa" />
        </Form.Item>
        <Form.Item label="Ubicación">
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
        <Form.Item>
          <Button onClick={reservarHora}>Reservar hora</Button>
          <Input></Input>
        </Form.Item>
      </Modal>

      {/*Modal para elegir las horas q se quiere reservar */}
      <Modal
        title="??"
        open={verHoraReserva}
        footer={[
          <Form>
            <Button onClick={cerrarReservaHora}>Cancelar</Button>
            <Button type="primary">Guardar</Button>
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
    </div>
  );
}

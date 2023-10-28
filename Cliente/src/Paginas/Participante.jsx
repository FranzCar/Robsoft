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
  Slider,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
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
      <div style={{ marginTop: 10 }}>Subir imagen </div>
    </div>
  );
// Registrar Imagen 2
   const [fileList1, setFileList1] = React.useState([]); 
   const handleChange1 = ({fileList: newfileList}) => setFileList1(newfileList);
   const handlePreview1 = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };
  const customRequest1 = ({fileList1, onSuccess}) => {
    onSuccess();
  };
  const uploadButton1 = (
    <div>
      {' '}
      <PlusOutlined />
      <div style={{marginTop: 10}}>Subir imagen 2 </div>
    </div>
  );
  

  //Mensaje de confirmacion al dar guardar en la parte de modal del participante
  const showConfirm = (values) => {
    confirm({
      title: "¿Esta seguro de guardar este registro?",
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
      title: "¿Estás seguro de que deseas cancelar este registro?",
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
    console.log('Se guarda los datos en la BD');
    axios.post('http://localhost:8000/api/guardar-participante',datos)
      .then((response) => {
        console.log("Datos guardados con éxito", response.data);
        message.success("El evento se registró correctamente");
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
          message.error("Ocurrió un error al guardar los datos.");
        }
      });
    setVisible(false);
    form.resetFields();
    setFileList([]);
    setFileList1([]);
  };

  
// parte para registrar a un equipo
//Mensaje de confirmacion al dar guardar en la parte de registro grupal
const showConfirmGrupal = (values) => {
  confirm({
    title: '¿Esta seguro de guardar este registro?',
    icon: <ExclamationCircleFilled />,
    content: '',
    okText: 'Si',
    cancelText: 'No',
    centered: 'true',
    onOk() {
      confirmSave(values);
    },
    onCancel() {},
  });
};

//Mensaje al dar al boton cancelar del formulario de registrar equipo 
const showCancelGrupal = () => {
  confirm({
    title: '¿Estás seguro de que deseas cancelar este registro?',
    icon: <ExclamationCircleFilled />,

    okText: 'Si',
    cancelText: 'No',
    centered: 'true',

    onOk() {
      form.resetFields();
    },
    onCancel() {},
  });
};
//Modal para registro grupal
const [verModalGrupal, setVerModalGrupal] = useState(false);
const [buscarParticipante, setBuscarParticipante] = useState(false);

const handleCancelGrupal = () => {
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
//Guardar datos del formulario grupal
const [participantes, setParticipantes] = useState([])

const registrarGrupo = () => {
  const participantes = participantes()
  const datos = {
    nombre_equipo : values.NombreEquipo,
    cantidad_integrantes : values.cantidad,

  }
}
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
            ]}
          >
            <Input
              maxLength={50}
              minLength={5}
              placeholder="Ingrese su nombre completo."
              style={{ width: "370px" }}
            ></Input>
          </Form.Item>
          <Form.Item
            label="Fecha de nacimiento"
            name="FECHA"
            rules={[{required: true, message: 'Ingrese una fecha, por favor.'}]}
          >
            <DatePicker
              style={{ width: "178px" }}
              placeholder="Selecciona una fecha"
            />
          </Form.Item>

          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Form.Item
                label="Carnet de identidad"
                name="CI"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese su nro de carnet",
                  },
                ]}
              >
                <Input
                  maxLength={9}
                  minLength={5}
                  style={{ width: "175px" }}
                  placeholder="Ingrese su nro de carnet"
                ></Input>
              </Form.Item>

              <Form.Item
                label="Telefono"
                name="TELEFONO"
                style={{ width: "200px" }}
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese un telefono",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el telefono"
                  maxLength={10}
                  minLength={6}
                  style={{ width: "175px" }}
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
                <Select placeholder="Ingrese el semestre">
                  <Select.Option value="1er semestre">1er semestre</Select.Option>
                  <Select.Option value="2do semestre">2do semestre</Select.Option>
                  <Select.Option value="3er semestre">3er semestre</Select.Option>
                  <Select.Option value="4to semestre">4to semestre</Select.Option>
                  <Select.Option value="5to semestre">5to semestre</Select.Option>
                  <Select.Option value="6to semestre">6to semestre</Select.Option>
                  <Select.Option value="7mo semestre">7mo semestre</Select.Option>
                  <Select.Option value="8vo semestre">8vo semestre</Select.Option>
                  <Select.Option value="9no semestre">9no semestre</Select.Option>
                  <Select.Option value="10mo semestre">10mo semestre</Select.Option>
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
            <Col span={12}>
              <Form.Item
                label="Genero"
                name="GENERO"
                style={{ width: "190px" }}
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione un genero ",
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
              >
                <Input
                  placeholder="Ingrese su correo electronico"
                  maxLength={30}
                  minLength={6}
                ></Input>
              </Form.Item>

              <Form.Item label="Codigo SIS" 
                          name="CODIGOSIS" 
                          style={{width: '250px'}}>
                <Input
                  placeholder="Ingrese su codigo sis"
                  maxLength={9}
                  minLength={8}
                ></Input>
              </Form.Item>
              <Form.Item label="Talla de polera" 
              name="TALLA_POLERA" 
              style={{width: '190px'}}>
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
        width={600}
        footer={[
          <Form>
            <Button>Cancelar</Button>
            <Button type="primary">Registrarse</Button>
          </Form>,
        ]}
      >
        <Form  layout="vertical">
          <Form.Item label="Nombre del equipo" name="EQUIPO">
            <Input placeholder="Ingrese el nombre del equipo" />
          </Form.Item>
          <Form.Item label="Institución" name="INSTITUCION">
            <Input placeholder="Ingrese el nombre de la institución" />
          </Form.Item>
          <Form.Item label="Entrenador" name="ENTRENADOR">
            <Input placeholder="Ingrese el nombre del entrenador" />
          </Form.Item>
          <Form.Item label="Talla de polera" name="POLERA">
            <Input placeholder="Ingrese la talla de la polera" />
          </Form.Item>
          <div className="aniadir-participante">
            <div>
              <label>Participantes</label>
            </div>
            <div className="boton-aniadir-participante">
              <label>Añadir</label>
              <Button type="link" onClick={aniadirPArticipante} className="icono-aniadir">
                <PlusOutlined />
              </Button>
            </div>
          </div>
          <Table
            className="tabla-participantes"
            locale={{
              emptyText: (
                <div style={{ padding: "30px", textAlign: "center" }}>
                  No hay participantes añadidos.
                </div>
              ),
            }}
          >
            <Column title="Nro" />
            <Column title="Nombre completo" />
          </Table>
        </Form>
      </Modal>

      {/*Modal para buscar un participante*/}
      <Modal
        open={buscarParticipante}
        onCancel={handleCancelBuscador}
        footer={[
          <Form>
            <Button type="primary">Añadir</Button>
          </Form>,
        ]}
      >
        <label>Carnet de identidad del participante</label>
        <div>
          <Search placeholder="Buscar participante" maxLength={50} allowClear />
        </div>
        <Form>
          <Form.Item label="Nombre completo del participante">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
import '../App.css';
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Upload,
  message,
  Image,
  Col,
  Row,
  Slider,
} from 'antd';
import React, {useState, useEffect} from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const {confirm} = Modal;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export default function Participante() {
  const [data, setData] = useState([]);

  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
    form.submit();
    setFileList([]);
  };
  const handleCancel = () => {
    setFileList([]);
    setVisible(false);
    form.resetFields();
  };
  const [previewOpen1, setPreviewOpen1] = useState(false);
  const [previewImage1, setPreviewImage1] = useState('');
  const [previewTitle1, setPreviewTitle1] = useState('');
  const handleCancelIMG1 = () => setPreviewOpen1(false);
  const [fileList1, setFileList1] = useState(['']);
  const handlePreview1 = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage1(file.url || file.preview);
    setPreviewOpen1(true);
    setPreviewTitle1(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };
  const handleChange1 = ({fileList1: newFileList1}) =>
    setFileList1(newFileList1);
  const customRequest1 = ({fileList1, onSuccess1}) => {
    onSuccess1();
  };
  const uploadButton1 = (
    <div>
      {' '}
      <PlusOutlined />
      <div style={{marginTop: 10}}> Subir imagen 2 </div>
    </div>
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancelIMG = () => setPreviewOpen(false);
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };
  const handleChange = ({fileList: newFileList}) => setFileList(newFileList);
  const customRequest = ({fileList, onSuccess}) => {
    onSuccess();
  };
  const uploadButton = (
    <div>
      {' '}
      <PlusOutlined />
      <div style={{marginTop: 10}}>Subir imagen </div>
    </div>
  );

  //Mensaje de confirmacion al dar guardar en la parte de modal del participante
  const showConfirm = (values) => {
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
  //Mensaje al dar al boton cancelar del formulario de crear registro
  const showCancel = () => {
    confirm({
      title: '¿Estás seguro de que deseas cancelar este registro?',
      icon: <ExclamationCircleFilled />,

      okText: 'Si',
      cancelText: 'No',
      centered: 'true',

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
    showConfirm(values);
  };

  const confirmSave = (values) => {
    console.log('Se guarda los datos en la BD');
    axios
      .post('http://localhost:8000/api/guardar-participante')
      .then((response) => {
        console.log('Datos guardados con éxito', response.data);
        message.success('El evento se registró correctamente');
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
          message.error('Ocurrió un error al guardar los datos.');
        }
      });
    setVisible(false);
    form.resetFields();
    setFileList([]);
    setFileList1([]);
  };

  return (
    <div className="pagina-evento">
      <Row gutter={[16, 8]}>
        <Col className="main-content" span={12}>
          <Space direction="vertical" style={{width: '80%'}}>
            <Button
              type="primary"
              onClick={showModal}
              block
              style={{background: 'var(--primary-color)'}}
            >
              <span style={{fontWeight: 'bold'}}>Registro Individual</span>
            </Button>
          </Space>
        </Col>
        <Col className="main-content" span={12}>
          <Space direction="vertical" style={{width: '80%'}}>
            <Button
              type="primary"
              onClick={showModal}
              block
              style={{background: 'var(--primary-color)'}}
            >
              <span style={{fontWeight: 'bold'}}>Registro Grupal</span>
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
            rules={[{required: true, message: 'Ingrese un nombre, por favor.'}]}
          >
            <Input
              maxLength={50}
              minLength={5}
              placeholder="Ingrese su nombre completo."
              style={{width: '370px'}}
            ></Input>
          </Form.Item>
          <Form.Item
            label="Fecha de nacimiento"
            name="FECHA_"
            rules={[{required: true, message: 'Ingrese una fecha, por favor.'}]}
          >
            <DatePicker
              style={{width: '178px'}}
              placeholder="Selecciona una fecha"
            />
          </Form.Item>

          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Form.Item
                label="Carnet de identidad"
                name="CARNET"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese su nro de carnet',
                  },
                ]}
              >
                <Input
                  maxLength={9}
                  minLength={5}
                  style={{width: '175px'}}
                  placeholder="Ingrese su nro de carnet"
                ></Input>
              </Form.Item>

              <Form.Item
                label="Telefono"
                name="TELEFONO"
                style={{width: '200px'}}
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese un telefono',
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el telefono"
                  maxLength={10}
                  minLength={6}
                  style={{width: '175px'}}
                ></Input>
              </Form.Item>

              <Form.Item
                label="Institucion"
                name="INSTITUCION"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese la institucion',
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
                    message: 'Por favor ingrese el semestre',
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el semestre"
                  maxLength={10}
                  minLength={5}
                  style={{width: '175px'}}
                ></Input>
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
                      width: 'auto',
                      height: '300px',
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
                style={{width: '190px'}}
                rules={[
                  {
                    required: true,
                    message: 'Por favor seleccione un genero ',
                  },
                ]}
              >
                <Select>
                  <Select.Option value="Femenino">Femenino</Select.Option>
                  <Select.Option value="Masculino">Masculino</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Correo electronico" name="CORREO">
                <Input
                  placeholder="Ingrese su correo electronico"
                  maxLength={30}
                  minLength={6}
                ></Input>
              </Form.Item>

              <Form.Item label="Codigo SIS" name="CODSIS" style={{width: '190px'}}>
                <Input
                  placeholder="Ingrese su codigo sis"
                  maxLength={9}
                  minLength={8}
                ></Input>
              </Form.Item>
              <Form.Item label="Talla de polera" name="TALLA_POLERA" style={{width: '190px'}}>
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
                  customRequest1={customRequest1}
                  listType="picture-card"
                  onPreview={handlePreview1}
                  onChange={handleChange1}
                  fileList1={fileList1}
                  maxCount={1}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal
                  open={previewOpen1}
                  title={previewTitle1}
                  footer={null}
                  onCancel={handleCancelIMG1}
                >
                  <img
                    alt="example"
                    style={{
                      width: 'auto',
                      height: '300px',
                    }}
                    src={previewImage1}
                  />
                </Modal>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

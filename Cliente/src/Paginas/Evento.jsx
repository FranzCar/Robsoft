import "../App.css";
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
} from "antd";
import React, { useState, useEffect } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from 'moment';


const { TextArea } = Input;
const { confirm } = Modal;
const { Column } = Table;

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

export default function Evento() {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
    form.submit();
    setFileList([])
  };
  const handleCancel = () => {
    setFileList([]) 
    setVisible(false);
    form.resetFields();
  };

  const [info, setInfo] = useState(null);
  const [verImagen, setVerImagen] = React.useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancelIMG = () => setPreviewOpen(false);
  const [fileList, setFileList] = useState([]);
  const [show] = Form.useForm();
  const [estadoFormulario, setEstadoFormulario] = useState(true);
  const [imageData, setImageData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);  


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
  const customRequest = ({ file, onSuccess }) => {
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
        Subir imagen
      </div>
    </div>
  );

  //Mensaje de confirmacion al dar guardar en la parte de modal del evento
  const showConfirm = (values) => {
    confirm({
      title: "¿Esta seguro de guardar este evento?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        confirmSave(values);
        setVisible(false);
        form.resetFields();
        setFileList([])
      },
      onCancel() {},
    });
  };
  //Mensaje al dar al boton cancelar del formulario de crear evento
  const showCancel = () => {
    confirm({
      title: "¿Estás seguro de que deseas cancelar este evento?",
      icon: <ExclamationCircleFilled />,
      
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setVisible(false)
        setFileList([])
        form.resetFields();
      },
      onCancel() {},
    });
  };
  //Restringir las horas
  const disabledHours = () => {
    const hours = [];

    for (let i = 0; i < 8; i++) {
      // Deshabilitar las horas antes de las 8:00
      hours.push(i);
    }

    for (let i = 21; i <= 23; i++) {
      // Deshabilitar las horas después de las 20:00
      hours.push(i);
    }

    return hours;
  }

  const disabledMinutes = (selectedHour) => {
    if (selectedHour === 20) {
      // Si la hora seleccionada es 20:00, habilita solo el minuto "00"
      return Array.from({ length: 60 }, (_, i) => i !== 0 ? i : false);
    }
    return [];
  };

  //Obtener datos de la base de datos
  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = () => {
    axios
      .get("http://localhost:8000/api/eventos-mostrar")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Eliminar evento
  function eliminarEvento(key) {
    axios
      .patch(`http://localhost:8000/api/quitar-evento/${key}`)
      .then((response) => {
        obtenerDatos();
        setImageData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const showDelete = (record) => {
    confirm({
      title: "¿Desea eliminar el evento?",
      icon: <ExclamationCircleFilled />,
      content: "Se eliminará el evento",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        handleOk();
        console.log("dato: " + record);
        eliminarEvento(record);
      },
      onCancel() {},
    });
  };
  //Guardar evento

  const onFinish = (values) => {
    showConfirm(values);
  };
  const validarTipo = (tipo) => {
    if (tipo === "1") return "Estilo ICPC";
    if (tipo === "2") return "Estilo Libre";
    if (tipo === "3") return "Taller de programación";
    if (tipo === "4") return "Sesión de reclutamiento";
    if (tipo === "5") return "Torneos de programación";
    if (tipo === "6") return "Entrenamientos";
    if (tipo === "7") return "Otros";
  };

  

  const datosEvento = (values) => {
    const fecha = values.FECHA;
    console.log("LA fecha actual es ", fecha)
    const NUEVAFECHA = fecha.format("YYYY-MM-DD");
    const hora = values.HORA;
    const NUEVAHORA = hora.format("HH:mm:ss");
    const TIPO = validarTipo(values.TIPO_EVENTO);
    const datos = {
      TITULO: values.TITULO,
      TIPO_EVENTO: TIPO,
      FECHA: NUEVAFECHA,
      HORA: NUEVAHORA,
      UBICACION: values.UBICACION,
      DESCRIPCION: values.DESCRIPCION,
      ORGANIZADOR: values.ORGANIZADOR,
      PATROCINADOR: values.PATROCINADOR,
      AFICHE: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };
    return datos;
  };

  const validarCampos = (error) => {
    console.log("Error validarcampo ", error);
    if (error === "El campo t i t u l o debe tener al menos 5 caracteres.") {
      console.log("validar campo titulo");
    }
  };

  const confirmSave = (values) => {
    const datos = datosEvento(values);

    console.log("Los nuevos datos son :", datos);
    // Realizar la solicitud POST con Axios para guardar los datos en el servidor
    axios
      .post("http://localhost:8000/api/guardar-evento", datos)
      .then((response) => {
        console.log("Datos guardados con éxito", response.data);
        obtenerDatos();
        message.success("El evento se registró correctamente");
      })
      .catch((error) => {
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          const errores = error.response.data.errors;
          for (let campo in errores) {
            message.error(errores[campo][0]); // Mostramos solo el primer mensaje de error de cada campo
            validarCampos(errores[campo][0]);
          }
        } else {
          // Otros errores (problemas de red, etc.)
          message.error("Ocurrió un error al guardar los datos.");
        }
      });
  };

  //Ver mas informacion de un evento
  const showModalInfo = () => {
    setIsModalOpen(true);
  };
  const handleOkInfo = () => {
    setIsModalOpen(false);
  };
  const handleCancelInfo = () => {
    setIsModalOpen(false);
    setInfo(null);
    show.resetFields();
  };

  function showInfo(record) {
    /*axios
      .get(`http://localhost:8000/api/evento/${key}`)
      .then((response) => {
        setInfo(response.data);
        setVerImagen(response.data.AFICHE);
        console.log("Informacion obtenida de show ",info )
        showModalInfo();
      })
      .catch((error) => {
        console.log(error);
      });*/
      setInfo(record)
      show.setFieldValue(record)
      setIsModalOpen(true);
  }

  const cerrarInfor = () => {
    setIsModalOpen(false);
    setInfo(null);
    show.resetFields();
  };

  //Editar evento
  const showModalEdit = () => {
    setIsModalOpenEdit(true);
  };
  const handleOkEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    setInfo(null);
    show.resetFields();
  };

  function showEdit(record) {
      setEstadoFormulario(false)
      setInfo(record)
      show.setFieldValue(record)
      setIsModalOpenEdit(true);
  }

  const cerrarEdit= () => {
    setEstadoFormulario(true)
    setIsModalOpenEdit(false);
    setInfo(null);
    show.resetFields();
  };

  const actualizarEdit = () =>{
    
  }

  //Validaciones de los campos input
  const validarMinimo = (_, value) => {
    if (!value) {
      return Promise.reject(new Error());
    }
    if (value.length < 5) {
      return Promise.reject(
        new Error("El título debe tener al menos 5 caracteres")
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="pagina-evento">
      <Button type="primary" className="boton-crear-evento" onClick={showModal}>
        Crear evento
      </Button>

      <Modal
        title="Registro de evento"
        className="modal-evento"
        open={visible}
        okText="Guardar"
        cancelText="Cancelar"
        onCancel={handleCancel}
        footer={[
          <Form form={form} onFinish={onFinish}>
            <Button onClick={showCancel} className="boton-cancelar-evento">
              Cancelar
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              className="boton-guardar-evento"
            >
              Guardar
            </Button>
          </Form>,
        ]}
      >
        <Form
          layout="vertical"
          className="form-evento"
          name="formulario_evento"
          autoComplete="off"
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <Form.Item
            label="T&iacute;tulo"
            name="TITULO"
            rules={[
              { required: true, message: "Por favor ingrese un titulo" },
              { validator: validarMinimo },
            ]}
          >
            <Input
              maxLength={20}
              minLength={5}
              placeholder="Ingrese el titulo del evento"
            ></Input>
          </Form.Item>

          <Form.Item
            label="Tipo"
            name="TIPO_EVENTO"
            rules={[
              {
                required: true,
                message: "Por favor ingrese un tipo de evento",
              },
            ]}
          >
            <Select
              style={{
                width: 200,
              }}
              allowClear
              options={[
                {
                  value: "1",
                  label: "Estilo ICPC",
                },
                {
                  value: "2",
                  label: "Estilo libre",
                },
                {
                  value: "3",
                  label: "Taller de programación",
                },
                {
                  value: "4",
                  label: "Sesión de reclutamiento",
                },
                {
                  value: "5",
                  label: "Torneos de programación",
                },
                {
                  value: "6",
                  label: "Entrenamientos",
                },
                {
                  value: "7",
                  label: "Otros",
                },
              ]}
            />
          </Form.Item>

          <div className="form-fecha-hora">
            <Form.Item
              label="Fecha"
              name="FECHA"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una fecha",
                },
              ]}
            >
              <DatePicker
                style={{ width: "175px" }}
                placeholder="Selecciona una fecha"
              />
            </Form.Item>

            <Form.Item
              label="Hora"
              name="HORA"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una hora",
                },
              ]}
            >
              <TimePicker
                style={{ width: "175px" }}
                placeholder="Seleccione una hora"
                format="HH:mm"
                showNow={false}
                disabledHours={disabledHours}
                disabledMinutes={disabledMinutes}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Ubicaci&oacute;n"
            name="UBICACION"
            rules={[
              {
                required: true,
                message: "Por favor ingrese una ubicación",
              },
              { validator: validarMinimo },
            ]}
          >
            <Input
              maxLength={20}
              minLength={5}
              placeholder="Ingrese la ubicación del evento"
            ></Input>
          </Form.Item>

          <Form.Item
            label="Descripci&oacute;n"
            name="DESCRIPCION"
            rules={[
              {
                required: true,
                message: "Por favor ingrese una descripción del evento",
              },
              { validator: validarMinimo },
            ]}
          >
            <TextArea maxLength={300} minLength={5} />
          </Form.Item>

          <Form.Item
            label="Organizador"
            name="ORGANIZADOR"
            rules={[
              {
                required: true,
                message: "Por favor ingrese un organizador",
              },
              { validator: validarMinimo },
            ]}
          >
            <Input
              placeholder="Ingrese el nombre del organizador"
              maxLength={20}
              minLength={5}
            ></Input>
          </Form.Item>

          <Form.Item
            label="Patrocinador"
            name="PATROCINADOR"
            
          >
            <Input
              placeholder="Ingrese el nombre del patrocinador"
              maxLength={20}
              minLength={5}
            ></Input>
          </Form.Item>

          <Form.Item label="Afiche del evento" name="AFICHE">
            <Upload
              name="AFICHE"
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
              accept=".png,.jpeg,.jpg"
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
        </Form>
      </Modal >

      <Table
        className="tabla-eventos"
        dataSource={data}
        pagination={false}
        locale={{
          emptyText: (
            <div style={{ padding: "70px", textAlign: "center" }}>
              No hay datos disponibles.
            </div>
          ),
        }}
      >
        <Column title="T&iacute;tulo" dataIndex="TITULO" key="titulo" />
        <Column title="Tipo" dataIndex="TIPO_EVENTO" key="titulo" />
        <Column title="Estado" dataIndex="ESTADO" key="estado" />
        <Column title="Fecha" dataIndex="FECHA" key="estado" />
        <Column
          align="center"
          title="Opciones"
          key="accion"
          render={(record) => (
            <Space size="middle">
              {/* Boton para eliminar */}
              <Button type="link" onClick={() => showInfo(record)}>
                <InfoCircleOutlined
                  style={{ fontSize: "25px", color: "#107710" }}
                />
              </Button>
              {/* Boton para editar  */}
              <Button type="link">
                <EditOutlined onClick={() => showEdit(record)} style={{ fontSize: "25px", color: "#3498DB" }} />
              </Button>
              {/* Boton para eliminar */}
              <Button type="link" onClick={() => showDelete(record.id)}>
                <DeleteOutlined
                  style={{ fontSize: "25px", color: "#E51919" }}
                />
              </Button>
            </Space>
          )}
        />
      </Table>
      
      <Modal
        title="Informaci&oacute;n del evento"
        open={isModalOpen}
        onOk={handleOkInfo}
        onCancel={handleCancelInfo}
        width={1000}
        footer={[
          <Form>
            <Button onClick={cerrarInfor} className="boton-cancelar-evento">
              Cerrar
            </Button>
          </Form>,
        ]}
      >
        <Form
          form={show}
          initialValues={info}
          layout="vertical"
          className="form-verInformacion"
          name="formulario_informacion"
          autoComplete="off"
        >
          <div className="form-info-columna1">
            <Form.Item label="Titulo" name="TITULO" className="titulo-info">
              <Input readOnly={estadoFormulario}></Input>
            </Form.Item>
            <Form.Item
              label="Tipo"
              name="TIPO_EVENTO"
              className="titulo-info"
              readOnly={estadoFormulario}
            >
              <Select
                readOnly={estadoFormulario}
                allowClear
                style={{pointerEvents: 'none'}}
                options={[
                  {
                    value: "1",
                    label: "Estilo ICPC",
                  },
                  {
                    value: "2",
                    label: "Estilo libre",
                  },
                  {
                    value: "3",
                    label: "Taller de programación",
                  },
                  {
                    value: "4",
                    label: "Sesión de reclutamiento",
                  },
                  {
                    value: "5",
                    label: "Torneos de programación",
                  },
                  {
                    value: "6",
                    label: "Entrenamientos",
                  },
                  {
                    value: "7",
                    label: "Otros",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Fecha" name="FECHA">
              <Input readOnly={estadoFormulario} />
            </Form.Item>

            <Form.Item label="Hora" name="HORA">
              <Input readOnly={estadoFormulario}/>
            </Form.Item>
          </div>

          <div className="form-info-columna2">
            <Form.Item label="Ubicaci&oacute;n" name="UBICACION">
              <Input
                readOnly={estadoFormulario}
                maxLength={20}
                minLength={5}
                placeholder="Ingrese la ubicación del evento"
              ></Input>
            </Form.Item>

            <Form.Item label="Organizador" name="ORGANIZADOR">
              <Input
                readOnly={estadoFormulario}
                placeholder="Ingrese el nombre del organizador"
                maxLength={20}
                minLength={5}
              ></Input>
            </Form.Item>

            <Form.Item label="Patrocinador" name="PATROCINADOR">
              <Input
                readOnly={estadoFormulario}
                placeholder="Ingrese el nombre del patrocinador"
                maxLength={20}
                minLength={5}
              ></Input>
            </Form.Item>
            <Form.Item label="Descripci&oacute;n" name="DESCRIPCION">
              <TextArea
                readOnly={estadoFormulario}
                maxLength={300}
                minLength={5}
                rows={4}
              />
            </Form.Item>
          </div>

          <div className="form-info-columna3">
          <label>Afiche del evento</label>
            <Form.Item  name="AFICHE" >
              <Image
                width={200}
                height={200}
                src={verImagen}
                fallback="info."
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Editar Evento"
        open={isModalOpenEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        width={1000}
        footer={[
          <Form>
            <Button onClick={cerrarEdit} className="boton-cancelar-evento">Cerrar</Button>
            <Button type="primary" onClick={actualizarEdit} className="boton-cancelar-evento">Actualizar</Button>
          </Form>,
        ]}
      >
        <Form
          form={show}
          initialValues={info}
          layout="vertical"
          className="form-verInformacion"
          name="formulario_informacion"
          autoComplete="off"
        >
          <div className="form-info-columna1">
            <Form.Item label="Titulo" name="TITULO" className="titulo-info">
              <Input readOnly={estadoFormulario}></Input>
            </Form.Item>
            <Form.Item
              label="Tipo"
              name="TIPO_EVENTO"
              className="titulo-info"
            >
              <Select
               
                allowClear
                readOnly={estadoFormulario}
                options={[
                  {
                    value: "1",
                    label: "Estilo ICPC",
                  },
                  {
                    value: "2",
                    label: "Estilo libre",
                  },
                  {
                    value: "3",
                    label: "Taller de programación",
                  },
                  {
                    value: "4",
                    label: "Sesión de reclutamiento",
                  },
                  {
                    value: "5",
                    label: "Torneos de programación",
                  },
                  {
                    value: "6",
                    label: "Entrenamientos",
                  },
                  {
                    value: "7",
                    label: "Otros",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Fecha" name="FECHAs">
              <DatePicker
                style={{ width: "175px" }}
                placeholder="Selecciona una fecha"
              />
            </Form.Item>

            <Form.Item label="Hora" name="HORAs">
              <TimePicker
                style={{ width: "175px" }}
                placeholder="Seleccione una hora"
                format="HH:mm"
                showNow={false}
              />
            </Form.Item>
          </div>

          <div className="form-info-columna2">
            <Form.Item label="Ubicaci&oacute;n" name="UBICACION">
              <Input
                readOnly={estadoFormulario}
                maxLength={20}
                minLength={5}
                placeholder="Ingrese la ubicación del evento"
              ></Input>
            </Form.Item>

            <Form.Item label="Organizador" name="ORGANIZADOR">
              <Input
                readOnly={estadoFormulario}
                placeholder="Ingrese el nombre del organizador"
                maxLength={20}
                minLength={5}
              ></Input>
            </Form.Item>

            <Form.Item label="Patrocinador" name="PATROCINADOR">
              <Input
                readOnly={estadoFormulario}
                placeholder="Ingrese el nombre del patrocinador"
                maxLength={20}
                minLength={5}
              ></Input>
            </Form.Item>
            <Form.Item label="Descripci&oacute;n" name="DESCRIPCION">
              <TextArea
                readOnly={estadoFormulario}
                maxLength={300}
                minLength={5}
                rows={4}
              />
            </Form.Item>
          </div>

          <div className="form-info-columna3">
          <label>Afiche del evento</label>
            <Form.Item  name="AFICHE" >
              <Image
                width={200}
                height={200}
                src={verImagen}
                fallback="info."
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

import "../App.css";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Upload,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { confirm } = Modal;

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

export default function CrearEvento() {

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancelIMG = () => setPreviewOpen(false);
  const [fileList, setFileList] = useState([]);
  const [show] = Form.useForm();
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

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
        setVisible(false);
        setFileList([]);
        form.resetFields();
        navigate("/evento");
      },
      onCancel() {},
    });
  };
  //Restringir las fechas
  const disabledDate = (current) => {
    // Obtenemos la fecha actual
    const today = new Date();
    // Establecemos la fecha mínima como 3 días después de la fecha actual
    const minDate = new Date();
    minDate.setDate(today.getDate() + 3);
    // Establecemos la fecha máxima como 180 días después de la fecha actual
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 180);

    // Comparamos si la fecha actual está antes de la fecha mínima o después de la fecha máxima
    return current < minDate || current > maxDate;
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
  };

  const disabledMinutes = (selectedHour) => {
    if (selectedHour === 20) {
      // Si la hora seleccionada es 20:00, habilita solo el minuto "00"
      return Array.from({ length: 60 }, (_, i) => (i !== 0 ? i : false));
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

  //Guardar evento

  const onFinish = (values) => {
    console.log("El formulario es ", values);
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
    const fecha = values.FECHA_INICIO;
    const NUEVAFECHA_INICIO = fecha.format("YYYY-MM-DD");

    const fecha_fin = values.FECHA_FIN;
    const NUEVAFECHA_FIN = fecha_fin.format("YYYY-MM-DD");
    const hora = values.HORA;
    const NUEVAHORA = hora.format("HH:mm:ss");
    const TIPO = validarTipo(values.TIPO_EVENTO);
    const datos = {
      TITULO: values.TITULO,
      TIPO_EVENTO: TIPO,
      FECHA_INICIO: NUEVAFECHA_INICIO,
      FECHA_FIN: NUEVAFECHA_FIN,
      HORA: NUEVAHORA,
      UBICACION: values.UBICACION,
      DESCRIPCION: values.DESCRIPCION,
      ORGANIZADOR: values.ORGANIZADOR,
      PATROCINADOR: values.PATROCINADOR,
      AFICHE: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };
    return datos;
  };

  const validarDuplicado = (values) => {
    const titulo = values.TITULO;
    let resultado = false; 

    for (let i = 0; i < data.length; i++) {
      if (data[i].TITULO === titulo) {
        console.log(
          `Se encontró un objeto con campoObjetivo igual a "${titulo}" en el índice ${i}.`
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

  const validarCampos = (error) => {
    console.log("Error validarcampo ", error);
    if (error === "El campo t i t u l o debe tener al menos 5 caracteres.") {
      console.log("validar campo titulo");
    }
  };

  const confirmSave = (values) => {
    const datos = datosEvento(values);
    const duplicado = validarDuplicado(values);

    if (duplicado === true) {
      console.log(
        "No se cierra el formul ario y no se guarda, se mustra un mensaje de q existe evento duplicado"
      );
      setVisible(true);
      message.error("Exite un evento con el mismo título");
    } else {
      console.log("Se guarda los datos en la BD");
      axios
        .post("http://localhost:8000/api/guardar-evento", datos)
        .then((response) => {
          console.log("Datos guardados con éxito", response.data);
          obtenerDatos();
          message.success("El evento se registró correctamente");
          navigate("/evento");
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
      setVisible(false);
      form.resetFields();
      setFileList([]);
    }
  };

  //Validaciones de los campos input
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
        message.error(
          "Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF)"
        );
        return Upload.LIST_IGNORE; // Impedir la carga del archivo y no lo añade a la lista
      }
      return isImage(file); // Permitir la carga del archivo solo si es una imagen
    },
  };

  //validacion de caracteres especiales en titulo
  const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚ0-9\-&*" ]+$/;
  function validarCaracteresPermitidos(_, value) {
    if (value && !caracteresPermitidos.test(value)) {
      return Promise.reject("Este campo solo acepta los siguientes caracteres especiales: -&*\"");
    }
    return Promise.resolve();
  }

  return (
    <div>
      <Form
        layout="vertical"
        className="form-evento"
        name="formulario_evento"
        autoComplete="off"
        onFinishFailed={onFinishFailed}
        form={form}
        onFinish={onFinish}
      >
        <div className="crear-evento-columna1">
          <Form.Item
            label="T&iacute;tulo"
            name="TITULO"
            rules={[
              { required: true, message: "Por favor, ingrese un titulo" },
              { validator: validarMinimo },
              { validator: validarCaracteresPermitidos },
            ]}
          >
            <Input
              maxLength={50}
              minLength={5}
              placeholder="Ingrese el titulo del evento"
            ></Input>
          </Form.Item>
          <div className="columna-fecha-hora">
          <Form.Item
              label="Fecha inicio"
              name="FECHA_INICIO"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una fecha",
                },
              ]}
            >
              <DatePicker
                className="fecha-hora"
                placeholder="Selecciona una fecha"
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item
              label="Fecha fin"
              name="FECHA_FIN"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una fecha",
                },
              ]}
            >
              <DatePicker
                className="fecha-hora"
                placeholder="Selecciona una fecha"
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item
              label="Hora"
              name="HORA"
              className="fecha-hora"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una hora",
                },
              ]}
            >
              <TimePicker
                className="fecha-hora"
                placeholder="Seleccione una hora"
                format="HH:mm"
                showNow={false}
                inputReadOnly={true}
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
              maxLength={30}
              minLength={5}
              placeholder="Ingrese la ubicación del evento"
            ></Input>
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

          <Form.Item label="Patrocinador" name="PATROCINADOR">
            <Input
              placeholder="Ingrese el nombre del patrocinador"
              maxLength={20}
              minLength={5}
            ></Input>
          </Form.Item>
        </div>

        <div className="crear-evento-columna2">
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
              className="select-tipo-evento"
              style={{
                width: 250,
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
                  label: "Torneo de programación",
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
            label="Afiche del evento"
            name="AFICHE"
            className="upload-imagen"
          >
            <Upload
              {...uploadProps}
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
          <div className="botones-crear-evento">
            <Button onClick={showCancel} 
                    className="boton-cancelar-evento">
              Cancelar
            </Button>
            <Button
                className="boton-guardar-evento"
                htmlType="submit"
                type="primary"
            >
              Guardar
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

import "../App.css";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";


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
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [listaOrganizador, setListaOrganizador] = useState([]);
  const [listaPatrocinador, setListaPatrocinador] = useState([]);
  const [obtenerOrganizadores, setObtenerOrganizadores] = useState([]);
  const [obtenerPatrocinadores, setObtenerPatrocinadores] = useState([]);
  const [listaTipoEvento, setListaTipoEvento] = useState([]);

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

  const disabledDateFin = (current) => {
    // Obtenemos la fecha seleccionada en "Fecha inicio"
    const fechaInicioValue = form.getFieldValue('FECHA_INICIO');
    
    // Si no hay fecha seleccionada en "Fecha inicio" o la fecha actual es anterior, deshabilitar
    if (!fechaInicioValue || current < fechaInicioValue) {
      return true;
    }
  
    // Calculamos la fecha máxima permitida (180 días desde la fecha actual)
    const fechaMaxima = moment().add(180, 'days');
  
    // Si la fecha actual es posterior a la fecha máxima permitida, deshabilitar
    return current > fechaMaxima;
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
    obtenerListaOrganizadores();
    obtenerListaPatrocinadores();
    obtenerListaTipoEventos();
  }, []);

  const obtenerListaTipoEventos = () => {
    axios
      .get("http://localhost:8000/api/lista-tipo-eventos")
      .then((response) => {
        const listaConFormato = response.data.map((element) => ({
          id: element.id_tipo_evento,
          nombre: element.nombre_tipo_evento,
          value: element.id_tipo_evento, // Aquí usamos el ID como valor
          label: element.nombre_tipo_evento, // Y el nombre como etiqueta
        }));
        setListaTipoEvento(listaConFormato);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    showConfirm(values);
  };


  const datosEvento = async (values) => {
    const fecha = values.FECHA_INICIO;
    const NUEVAFECHA_INICIO = fecha.format("YYYY-MM-DD");
    const fecha_fin = values.FECHA_FIN;
    const NUEVAFECHA_FIN = fecha_fin.format("YYYY-MM-DD");
    const organizadores = listaOrganizador[listaOrganizador.length - 1];
    const patrocinadores = listaPatrocinador[listaPatrocinador.length - 1];
  
    let base64Image = null;
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      base64Image = await getBase64(file); // Convertir el archivo a Base64
    }
  
    const datos = {
      TITULO: values.TITULO,
      id_tipo_evento: values.TIPO_EVENTO,
      FECHA_INICIO: NUEVAFECHA_INICIO,
      FECHA_FIN: NUEVAFECHA_FIN,
      DESCRIPCION: values.DESCRIPCION,
      auspiciadores: patrocinadores,
      organizadores: organizadores,
      AFICHE: base64Image // Usar la imagen en Base64
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

  const confirmSave = async (values) => {
    const datos = await datosEvento(values);
    const duplicado = validarDuplicado(values);
    console.log("Los datos del formulario son ", datos);
    if (duplicado === true) {
      console.log(
        "No se cierra el formulario y no se guarda, se mustra un mensaje de q existe evento duplicado"
      );
      setVisible(true);
      message.error("Existe un evento con el mismo título");
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
        message.error("Solo se permiten archivos de imagen (JPEG, JPG, PNG)");
        return Upload.LIST_IGNORE; // Impedir la carga del archivo y no lo añade a la lista
      }
      return isImage(file); // Permitir la carga del archivo solo si es una imagen
    },
  };

  //validacion de caracteres especiales en titulo
  const caracteresPermitidos = /^[a-zA-ZáéíóúÁÉÍÓÚ0-9\-&*" ]+$/;
  function validarCaracteresPermitidos(_, value) {
    if (value && !caracteresPermitidos.test(value)) {
      return Promise.reject(
        'Este campo solo acepta los siguientes caracteres especiales: -&*"'
      );
    }
    return Promise.resolve();
  }

  //3er sprint
  const obtenerListaOrganizadores = () => {
    axios
      .get("http://localhost:8000/api/lista-organizadores")
      .then((response) => {
        const listaConFormato = response.data.map((element) => ({
          id: element.id_rol_persona,
          nombre: element.nombre,
          ci: element.ci,
          value: element.nombre,
          label: element.nombre,
        }));
        setObtenerOrganizadores(listaConFormato);
        console.log("organizadores son ", listaConFormato);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const obtenerListaPatrocinadores = () => {
    axios
      .get("http://localhost:8000/api/lista-auspiciadores")
      .then((response) => {
        const listaConFormato = response.data.map((element) => ({
          id: element.id_auspiciador,
          nombre: element.nombre_auspiciador,
          value: element.nombre_auspiciador,
          label: element.nombre_auspiciador,
        }));
        setObtenerPatrocinadores(listaConFormato);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Buscador de ubicacion
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  //Organizadores
  const options = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }
  const handleChangeOrganizador = (value) => {
    const nuevaListaOrganizador = [...listaOrganizador];
    let idOrganizador = [];
    for (let i = 0; i < obtenerOrganizadores.length; i++) {
      for (let j = 0; j < value.length; j++) {
        if (obtenerOrganizadores[i].nombre === value[j]) {
          idOrganizador.push(obtenerOrganizadores[i].id);
        }
      }
    }
    // Si `value` ya existe en la lista, elimínalo
    if (nuevaListaOrganizador.includes(idOrganizador)) {
      const index = nuevaListaOrganizador.indexOf(idOrganizador);
      nuevaListaOrganizador.splice(index, 1);
    } else {
      // Si `value` no existe en la lista, agrégalo
      nuevaListaOrganizador.push(idOrganizador);
    }

    setListaOrganizador(nuevaListaOrganizador);
    console.log(
      "El último valor en la lista de organizadores es ",
      nuevaListaOrganizador[nuevaListaOrganizador.length - 1]
    );
  };

  const handleChangePatrocinador = (value) => {
    const nuevaListaPatrocinador = [...listaPatrocinador];
    console.log("patrocinadores ", obtenerPatrocinadores);
    let idPatrocinador = [];
    for (let i = 0; i < obtenerPatrocinadores.length; i++) {
      for (let j = 0; j < value.length; j++) {
        if (obtenerPatrocinadores[i].nombre === value[j]) {
          idPatrocinador.push(obtenerPatrocinadores[i].id);
        }
      }
    }

    // Si `value` ya existe en la lista, elimínalo
    if (nuevaListaPatrocinador.includes(idPatrocinador)) {
      const index = nuevaListaPatrocinador.indexOf(idPatrocinador);
      nuevaListaPatrocinador.splice(index, 1);
    } else {
      // Si `value` no existe en la lista, agrégalo
      nuevaListaPatrocinador.push(idPatrocinador);
    }

    setListaPatrocinador(nuevaListaPatrocinador);
    console.log(
      "El último valor en la lista de patrocinadores es ",
      nuevaListaPatrocinador[nuevaListaPatrocinador.length - 1]
    );
  };

  return (
    <div>
      <div className="tabla-descripcion-editarEv">
        <p>CREACIÓN DE EVENTO</p>
      </div>
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
              {
                required: true,
                message: "Por favor, ingrese un titulo",
              },
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
                disabledDate={disabledDateFin}
              />
            </Form.Item>

            {/*<Form.Item
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
                    </Form.Item>*/}
          </div>

          <Form.Item
            label="Organizador"
            name="ORGANIZADOR"
            rules={[
              {
                required: true,
                message: "Por favor seleccione al menos un organizador",
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Selecione uno o mas organizadores"
              onChange={handleChangeOrganizador}
              options={obtenerOrganizadores}
            />
          </Form.Item>

          <Form.Item label="Patrocinador" name="PATROCINADOR">
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Selecione uno o mas patrocinadores"
              onChange={handleChangePatrocinador}
              options={obtenerPatrocinadores}
            />
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
        options={listaTipoEvento} // Usa la lista obtenida del backend
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
            <TextArea showCount maxLength={300} minLength={5} />
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
            <Button onClick={showCancel} className="boton-cancelar-evento">
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

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
  Image,
  message,
  Upload,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";

const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;

const dateFormat = "YYYY/MM/DD";

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

export default function EditarEvento() {
  const [info, setInfo] = useState({});
  const [verImagen, setVerImagen] = React.useState("");
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [id, setId] = useState(null);
  const handleCancelIMG = () => setPreviewOpen(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const handleOkEdit = () => {
    setIsModalOpenEdit(false);
  };
  const [actual, setActual] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [dataEditar, setDataEditar] = useState([]);
  const customRequest = ({ fileList, onSuccess }) => {
    onSuccess();
  };
  const [obtenerOrganizadores, setObtenerOrganizadores] = useState([]);
  const [listaOrganizador, setListaOrganizador] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [listaPatrocinador, setListaPatrocinador] = useState([]);
  const [obtenerPatrocinadores, setObtenerPatrocinadores] = useState([]);
  const [organizadoresRecuperados, setOrganizadoresRecuperados] = useState([]);
  const [patrocinadorRecuperados, setPatrocinadorRecuperados] = useState([]);
  const [fechaInicioBD, setFechaInicioBD] = useState("");
  const [fechaFinBD, setFechaFinBD] = useState("");

  //Obtener datos de la base de datos
  useEffect(() => {
    obtenerDatos();
    obtenerDatosEditar();
    obtenerListaOrganizadores();
    obtenerListaPatrocinadores();
  }, []);

  const obtenerDatos = () => {
    axios
      .get("http://localhost:8000/api/eventos-modificables")
      .then((response) => {
        setData(response.data);
        console.log("los datos de la base de daatos son ", response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const obtenerDatosEditar = () => {
    axios
      .get("http://localhost:8000/api/eventos")
      .then((response) => {
        setDataEditar(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    form.resetFields();
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

  const showEdit = (record) => {

    setVerImagen(record.AFICHE);
    const organizadores = record.ORGANIZADORES.map(
      (organizador) => organizador.nombre
    );
    const patrocinadores = record.AUSPICIADORES.map(
      (auspiciador) => auspiciador.nombre
    );
    const datos = {
      TITULO: record.TITULO,
      TIPO_EVENTO: record.TIPO_EVENTO,
      UBICACION: record.UBICACION,
      DESCRIPCION: record.DESCRIPCION,
      ORGANIZADOR: organizadores,
      PATROCINADOR: patrocinadores,
      AFICHE: record.AFICHE,
    };

    setFechaInicioBD(record.FECHA_INICIO);
    setFechaFinBD(record.FECHA_FIN)
    form.setFieldsValue({ TIPO_EVENTO: record.TIPO_EVENTO });
    form.setFieldsValue(datos);
    setActual(record.TITULO);
    setId(record.id_evento);

    const organizadoresBD = record.ORGANIZADORES.map(
      (organizador) => organizador.id
    );
    const patrocinadoresBD = record.AUSPICIADORES.map(
      (patrocinador) => patrocinador.id
    );

    setOrganizadoresRecuperados(organizadoresBD);
    setPatrocinadorRecuperados(patrocinadoresBD);
    setIsModalOpenEdit(true);
  };

  const onFinish = (values) => {
    actualizarEvento(values);
  };

  const actualizarEvento = (values) => {
    confirm({
      title: "¿Desea actualizar el evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Se guardarán los nuevos datos del evento",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        console.log("LOs valores del form son : ", values);
        actualizar(values, id);
      },
      onCancel() {},
    });
  };

  const cerrarEdit = () => {
    confirm({
      title: "¿Está seguro de que desea cancelar la edición del evento?",
      icon: <ExclamationCircleFilled />, //
      content: "Todos los cambios se perderán",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setIsModalOpenEdit(false);
        setListaPatrocinador([]);
        setListaOrganizador([]);
        setFileList([]);
      },
      onCancel() {},
    });
  };

  const validarTipo = (tipo) => {
    if (tipo >= 1 && tipo <= 7) {
      return tipo;
    } else {
      if (tipo === "Competencia estilo ICPC") {
        return "1";
      } else if (tipo === "Competencia estilo libre") {
        return "2";
      } else if (tipo === "Taller de programación") {
        return "3";
      } else if (tipo === "Entrenamiento") {
        return "4";
      } else if (tipo === "Reclutamiento") {
        return "5";
      } else if (tipo === "Torneo") {
        return "6";
      } else if (tipo === "Otro") {
        return "7";
      } else {
        return "Tipo desconocido";
      }
    }
  };

  const datosEvento = (values) => {
    let organizadores = [];
    let patrocinadores = [];
    const fecha = values.FECHAsINI;
    const NUEVAFECHA_INICIO = fecha.format("YYYY-MM-DD");
    const fecha_fin = values.FECHAsFIN;
    const NUEVAFECHA_FIN = fecha_fin.format("YYYY-MM-DD");
    const TIPO = validarTipo(values.TIPO_EVENTO);
    if (listaOrganizador.length === 0) {
      organizadores = organizadoresRecuperados;
    } else {
      organizadores.push(...listaOrganizador[listaOrganizador.length - 1]);
    }

    if (listaPatrocinador.length === 0) {
      patrocinadores = patrocinadorRecuperados;
    } else {
      patrocinadores.push(...listaPatrocinador[listaPatrocinador.length - 1]);
    }
    const datos = {
      TITULO: values.TITULO,
      id_tipo_evento: TIPO,
      FECHA_INICIO: NUEVAFECHA_INICIO,
      FECHA_FIN: NUEVAFECHA_FIN,
      DESCRIPCION: values.DESCRIPCION,
      organizadores: organizadores,
      auspiciadores: patrocinadores,
      AFICHE: fileList.length > 0 ? fileList[0].thumbUrl : values.AFICHE,
    };
    return datos;
  };

  const validarDuplicado = (values) => {
    const titulo = values.TITULO;
    let resultado = false;
    if (actual !== titulo) {
      for (let i = 0; i < dataEditar.length; i++) {
        if (dataEditar[i].TITULO === titulo) {
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
    }

    return resultado;
  };

  function actualizar(values, id) {
    const duplicado = validarDuplicado(values);
    const datos = datosEvento(values);
    console.log("Valores del formulario:", datos);
    console.log("El valor de duplicado es ", duplicado);
    console.log("el id es ", id);
    if (duplicado === true) {
      console.log(
        "No se cierra el formul ario y no se guarda, se mustra un mensaje de q existe evento duplicado"
      );
      setIsModalOpenEdit(true);
      message.error("Exite un evento con el mismo título");
      setFileList([]);
    } else {
      axios
        .put(`http://localhost:8000/api/evento/${id}`, datos)
        .then((response) => {
          message.success("El evento se actualizó correctamente");
          obtenerDatos();
          setIsModalOpenEdit(false);
          setFileList([]);
          setListaPatrocinador([]);
          setListaOrganizador([]);
          obtenerDatos();
          obtenerDatosEditar();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  //Validaciones de los campos input
  const validarMinimo = (_, value, callback) => {
    if (!value) {
      callback("");
    } else if (value.trim() !== value) {
      callback("No se permiten espacios en blanco al inicio ni al final");
    } else if (value.replace(/\s/g, "").length < 4) {
      callback("Ingrese al menos 4 caracteres");
    } else {
      callback();
    }
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
    const fechaInicioValue = form.getFieldValue("FECHAsINI");

    // Si no hay fecha seleccionada en "Fecha inicio" o la fecha actual es anterior, deshabilitar
    return !fechaInicioValue || current < fechaInicioValue;
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
        <p>EDITAR EVENTOS REGISTRADOS</p>
      </div>
      {/*Apartado de la tabla de los eventos creados */}
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
        <Column title="Tipo" dataIndex="TIPO_EVENTO" key="titulo" />
        <Column title="Estado" dataIndex="ESTADO" key="estado" />
        <Column title="Fecha inicio" dataIndex="FECHA_INICIO" key="estado" />
        <Column
          align="center"
          title="Editar"
          key="accion"
          render={(record) => (
            <Space size="middle">
              {/* Boton para editar  */}
              <Button type="link">
                <EditOutlined
                  onClick={() => showEdit(record)}
                  style={{ fontSize: "25px", color: "#3498DB" }}
                />
              </Button>
            </Space>
          )}
        />
      </Table>

      {/*Ventana para mostrar el editar evento */}
      <Modal
        title="Editar Evento"
        open={isModalOpenEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        width={1000}
        maskClosable={false}
        keyboard={false}
        closable={false}
        footer={[
          <Form form={form} onFinish={onFinish}>
            <Button onClick={cerrarEdit} className="boton-cancelar-evento">
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="boton-cancelar-evento"
            >
              Actualizar
            </Button>
          </Form>,
        ]}
      >
        <Form
          form={form}
          initialValues={info}
          onFinish={onFinish}
          layout="vertical"
          className="form-editar"
          name="formulario_informacion"
          autoComplete="off"
        >
          <div className="form-edit-columna1">
            <Form.Item
              label="Titulo"
              name="TITULO"
              className="titulo-info"
              rules={[
                { required: true, message: "Por favor, ingrese un titulo" },
                { validator: validarMinimo },
                { validator: validarCaracteresPermitidos },
              ]}
            >
              <Input maxLength={50} minLength={5}></Input>
            </Form.Item>
            <Form.Item
              label="Tipo"
              name="TIPO_EVENTO"
              className="titulo-info"
              rules={[
                {
                  required: true,
                  message: "Por favor, seleccione un tipo de evento",
                },
              ]}
            >
              <Select
                allowClear
                options={[
                  {
                    value: "1",
                    label: "Competencia estilo ICPC",
                  },
                  {
                    value: "2",
                    label: "Competencia estilo libre",
                  },
                  {
                    value: "3",
                    label: "Taller de programación",
                  },
                  {
                    value: "4",
                    label: "Entrenamiento",
                  },
                  {
                    value: "5",
                    label: "Reclutamiento",
                  },
                  {
                    value: "6",
                    label: "Torneo",
                  },
                  {
                    value: "7",
                    label: "Otro",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Fecha inicio"
              name="FECHAsINI"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una fecha",
                },
              ]}
            >
              <DatePicker
                defaultValue={dayjs(fechaInicioBD, dateFormat)}
                style={{ width: "175px" }}
                placeholder="Selecciona una fecha"
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item
              label="Fecha fin"
              name="FECHAsFIN"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una fecha",
                },
              ]}
            >
              <DatePicker
                defaultValue={dayjs(fechaFinBD, dateFormat)}
                style={{ width: "175px" }}
                placeholder="Selecciona una fecha"
                disabledDate={disabledDateFin}
              />
            </Form.Item>

            {/*<Form.Item
              label="Hora"
              name="HORAs"
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
                inputReadOnly={true}
                disabledHours={disabledHours}
                disabledMinutes={disabledMinutes}
              />
            </Form.Item>*/}
          </div>

          <div className="form-edit-columna2">
            {/*  <Form.Item
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
            </Form.Item>*/}
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
                options={obtenerOrganizadores.map((organizador) => ({
                  value: organizador.nombre,
                  label: organizador.nombre,
                }))}
                value={selectedValues}
              />
            </Form.Item>

            <Form.Item label="Patrocinador" name="PATROCINADOR">
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Selecione uno o mas organizadores"
                onChange={handleChangePatrocinador}
                options={obtenerPatrocinadores.map((patrocinador) => ({
                  value: patrocinador.nombre,
                  label: patrocinador.nombre,
                }))}
                value={selectedValues}
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
              <TextArea showCount maxLength={300} minLength={5} rows={4} />
            </Form.Item>
          </div>

          <div className="form-edit-columna3">
            <label>Afiche del evento</label>
            <Form.Item className="info-afiche" name="AFICHE">
              <Image
                width={160}
                height={160}
                src={verImagen}
                fallback="info."
              />
            </Form.Item>
            <Form.Item name="AFICHE" className="upload-editar-evento">
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
          </div>
        </Form>
      </Modal>
    </div>
  );
}

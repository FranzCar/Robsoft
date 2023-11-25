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
  CalendarOutlined,
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
  const [fechaInicioBD, setFechaInicioBD] = useState(null);
  const [fechaFinBD, setFechaFinBD] = useState(null);
  const [estadoFormulario, setEstadoFormulario] = useState(true);

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
          "Solo se permiten archivos de imagen (JPEG, JPG, PNG)"
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
    setIsModalOpenEdit(true);
    console.log("LOS datos de la base de datos ", record.FECHA_FIN);
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
      DESCRIPCION: record.DESCRIPCION,
      ORGANIZADOR: organizadores,
      PATROCINADOR: patrocinadores,
      fecha: record.FECHA_INICIO,
      fechafin: record.FECHA_FIN,
      AFICHE: record.AFICHE,
    };

    setFechaInicioBD(record.FECHA_INICIO);
    setFechaFinBD(record.FECHA_FIN);
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
  };

  const onFinish = (values) => {
    console.log("EL valor obtenido de los formularios es ", fechaInicioBD);
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
      title: "¿Estás seguro de que deseas cancelar?",
      icon: <ExclamationCircleFilled />, //
      content: "No se guardarán los cambio realizados",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        setListaPatrocinador([]);
        setListaOrganizador([]);
        setFileList([]);
        setFechaInicioBD("");
        setFechaFinBD("");
        setIsModalOpenEdit(false);
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

  const datosEvento = async (values) => {
    let organizadores = [];
    let patrocinadores = [];
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
    let base64Image;
    if (fileList.length > 0) {
      // Convertir el archivo a base64
      base64Image = await getBase64(fileList[0].originFileObj);
    } else {
      base64Image = values.AFICHE; // Si no hay un archivo nuevo, usa el valor existente
    }

    const datos = {
      TITULO: values.TITULO,
      id_tipo_evento: TIPO,
      FECHA_INICIO: values.fecha,
      FECHA_FIN: values.fechafin,
      DESCRIPCION: values.DESCRIPCION,
      organizadores: organizadores,
      auspiciadores: patrocinadores,
      AFICHE: base64Image,
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

  async function actualizar(values, id) {
    // Primero, verificamos si el título del evento está duplicado.
    const duplicado = await validarDuplicado(values);
  
    if (duplicado) {
      console.log("Existe un evento con el mismo título");
      message.error("Existe un evento con el mismo título");
      setIsModalOpenEdit(true);
      setFileList([]);
    } else {
      try {
        // Si no está duplicado, obtenemos los datos del evento, incluyendo la imagen en base64.
        const datos = await datosEvento(values);
  
        // Luego, realizamos la solicitud PUT con los datos del evento.
        const response = await axios.put(`http://localhost:8000/api/evento/${id}`, datos);
  
        console.log("El evento se actualizó correctamente");
        message.success("El evento se actualizó correctamente");
  
        // Finalmente, actualizamos la UI según sea necesario.
        setFileList([]);
        setListaPatrocinador([]);
        setListaOrganizador([]);
        setIsModalOpenEdit(false);
        obtenerDatos();
        obtenerDatosEditar();
      } catch (error) {
        console.error(error);
        message.error("Ocurrió un error al actualizar el evento");
      }
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
    minDate.setDate(today.getDate() + -1);
    // Establecemos la fecha máxima como 180 días después de la fecha actual
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 180);

    // Comparamos si la fecha actual está antes de la fecha mínima o después de la fecha máxima
    return current < minDate || current > maxDate;
  };

  const disabledDateFin = (current) => {
    const fechaInicioFieldValue = form.getFieldValue("FECHAsINI");
    let fechaInicio;
    // Si no hay fecha seleccionada en "Fecha inicio", asignar la fecha de fechaInicioBD
    if (!fechaInicioFieldValue) {
      const fechaIni = moment(fechaInicioBD); // Utiliza la fecha proporcionada
      fechaInicio = fechaIni.isValid() ? fechaIni.toDate() : new Date();
    } else {
      fechaInicio = fechaInicioFieldValue.toDate();
    }
  
    // Calculamos la fecha máxima permitida (180 días desde la fecha de inicio)
    const fechaMaxima = new Date(fechaInicio);
    fechaMaxima.setDate(fechaMaxima.getDate() + 180);
  
    // Devolvemos true si la fecha actual es anterior a la fecha de inicio o posterior a la fecha máxima permitida
    return (
      current < moment().startOf("day") ||
      current < moment(fechaInicio).startOf("day") ||
      current > moment(fechaMaxima).startOf("day")
    );
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
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    const nuevaFecha = date.format("YYYY-MM-DD");
    const fechaForm = form.getFieldValue("fechafin")
    console.log("la fechas comparadas son ", nuevaFecha, " ", fechaFinBD);
    setSelectedDate(date);
    if (fechaFinBD  <= nuevaFecha || fechaForm  <= nuevaFecha ) {
      form.setFieldValue("fechafin", nuevaFecha);
      form.setFieldValue("fecha", nuevaFecha);
    } else {
      form.setFieldValue("fecha", nuevaFecha);
    }
  };

  const handleDateChange2 = (date) => {
    const nuevaFecha = date.format("YYYY-MM-DD");
    console.log("fehca ", nuevaFecha);
    setSelectedDate(date);
    form.setFieldValue("fechafin", nuevaFecha);
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
              Guardar
            </Button>
          </Form>,
        ]}
      >
        <Form
          form={form}
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
            <div className="formato-fechas">
              <div className="formato-fechas-columna1">
                <Form.Item
                  label="Fecha inicio"
                  name="fecha"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    readOnly={estadoFormulario}
                    value={
                      selectedDate
                        ? moment(selectedDate).format("YYYY-MM-DD")
                        : ""
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Fecha fin"
                  name="fechafin"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    readOnly={estadoFormulario}
                    value={
                      selectedDate
                        ? moment(selectedDate).format("YYYY-MM-DD")
                        : ""
                    }
                  />
                </Form.Item>
              </div>
              <div className="formato-fechas-columna2">
                <Form.Item label=" " name="FECHAsINI">
                 
                    <DatePicker
                      className="fecha-inicio"
                      suffixIcon={
                        <CalendarOutlined
                          style={{ fontSize: "25px", color: "#0757F7" }}
                        />
                      }
                      bordered={false}
                      placeholder="Selecciona una fecha"
                      disabledDate={disabledDate}
                      onChange={handleDateChange}
                      allowClear={false}
                    />
                </Form.Item>

                <Form.Item label=" " name="FECHAsFIN">
                 
                    <DatePicker
                      className="fecha-inicio"
                      suffixIcon={
                        <CalendarOutlined
                          style={{ fontSize: "25px", color: "#0757F7" }}
                        />
                      }
                      bordered={false}
                      placeholder="Selecciona una fecha"
                      onChange={handleDateChange2}
                      disabledDate={disabledDateFin}
                      allowClear={false}
                    />
                </Form.Item>
              </div>
            </div>

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

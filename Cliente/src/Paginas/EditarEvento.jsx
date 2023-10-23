import "../App.css";
import { Button, Table, Space, Modal, Form, Input, Select, DatePicker, TimePicker, Image, message, Upload } from "antd";
import React, { useState, useEffect } from "react";
import { EditOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";

const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;

export default function EditarEvento() {
  const [info, setInfo] = useState({});
  const [verImagen, setVerImagen] = React.useState("");
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [id,setId] = useState(null)

  const handleOkEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    form.resetFields();
  };
  
  const showEdit = (record) =>{
    setInfo(record)
    form.setFieldsValue(record);
    console.log("Los datos son ", record)
    setId(record.id)
    setIsModalOpenEdit(true)
  }

  const onFinish = (values) => {
    console.log('Valores del formulario:', values);
   actualizarEvento(values)
  };

  const actualizarEvento = (values) => {
    confirm({
      title: "¿Desea actualizar el evento?",
      icon: <ExclamationCircleFilled />,
      content: "Se guardarán los nuevos datos del evento",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        actualizar(values, id);
      },
      onCancel() {},
    });
  };


  const cerrarEdit = () => {
    setIsModalOpenEdit(false);
    form.resetFields();
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
    const fecha = values.FECHAs;
    const NUEVAFECHA = fecha.format("YYYY-MM-DD");
    const hora = values.HORAs;
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
    };
    return datos;
  };

  function actualizar(values,id) {
    const datos = datosEvento(values);
    axios
      .put(`http://localhost:8000/api/evento/${id}`, datos)
      .then((response) => {
        message.success("El evento se actualizó correctamente");
        obtenerDatos();
        setIsModalOpenEdit(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

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

  //Validaciones de los campos input
  const validarMinimo = (_, value, callback) => {
    if (!value) {
      callback('');
    } else if (value.trim() !== value) {
      callback('No se permiten espacios en blanco al inicio ni al final');
    } else if (value.replace(/\s/g, '').length < 5) {
      callback('Ingrese al menos 5 caracteres');
    } else {
      callback();
    }
  };

   //Restringir las fechas
   const disabledDate = current => {
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

  return (
    <div>
      {/*Apartado de la tabla de los eventos creados */}
      <Table
        className="tabla-eventos"
        dataSource={data}
        pagination={false}
        locale={{
          emptyText: (
            <div style={{ padding: "100px", textAlign: "center" }}>
              No hay datos registrados.
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
        footer={[
          <Form  form={form} onFinish={onFinish}>
            <Button onClick={cerrarEdit} className="boton-cancelar-evento">
              Cerrar
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
            <Form.Item label="Titulo" name="TITULO" className="titulo-info"
              rules={[
                { required: true, message: "Por favor, ingrese un titulo" },
                { validator: validarMinimo },
              ]}
            >
              <Input 
              maxLength={50}
              minLength={5}
              >
              </Input>
            </Form.Item>
            <Form.Item label="Tipo" name="TIPO_EVENTO" className="titulo-info">
              <Select
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
            <Form.Item label="Fecha" name="FECHAs"
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
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item label="Hora" name="HORAs"
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
            </Form.Item>
          </div>

          <div className="form-edit-columna2">
            <Form.Item label="Ubicaci&oacute;n" name="UBICACION"
               rules={[
                {
                  required: true,
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

            <Form.Item label="Organizador" name="ORGANIZADOR"
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
            <Form.Item label="Descripci&oacute;n" name="DESCRIPCION"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una descripción del evento",
                },
                { validator: validarMinimo },
              ]}
            >
              <TextArea
                maxLength={300}
                minLength={5}
                rows={4}
              />
            </Form.Item>
          </div>

          <div className="form-edit-columna3">
            <label>Afiche del evento</label>
            <Form.Item label="Afiche del evento" name="AFICHE">
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

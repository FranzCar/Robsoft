import "../App.css";
import { Button, Table, Space, Modal, Form, Input, Select, DatePicker, TimePicker, Image, message } from "antd";
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
            <Form.Item label="Titulo" name="TITULO" className="titulo-info">
              <Input ></Input>
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

          <div className="form-edit-columna2">
            <Form.Item label="Ubicaci&oacute;n" name="UBICACION">
              <Input
                maxLength={20}
                minLength={5}
                placeholder="Ingrese la ubicación del evento"
              ></Input>
            </Form.Item>

            <Form.Item label="Organizador" name="ORGANIZADOR">
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
            <Form.Item label="Descripci&oacute;n" name="DESCRIPCION">
              <TextArea
                maxLength={300}
                minLength={5}
                rows={4}
              />
            </Form.Item>
          </div>

          <div className="form-edit-columna3">
            <label>Afiche del evento</label>
            <Form.Item name="AFICHE">
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

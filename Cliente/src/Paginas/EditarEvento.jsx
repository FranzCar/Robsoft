import "../App.css";
import { Button, Table, Space, Modal, Form, Input, Select, DatePicker, TimePicker, Image } from "antd";
import React, { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { Column } = Table;
const { TextArea } = Input;

export default function EditarEvento() {
  const [info, setInfo] = useState([]);
  const [verImagen, setVerImagen] = React.useState("");
  const [show] = Form.useForm();
  const [estadoFormulario, setEstadoFormulario] = useState(true);
  const [data, setData] = useState([]);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

  const handleOkEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    show.resetFields();
  };

  function showEdit(record) {
    setEstadoFormulario(false);
    setInfo(record);
    show.setFieldValue(record);
    setIsModalOpenEdit(true);
  }

  const cerrarEdit = () => {
    setEstadoFormulario(true);
    setIsModalOpenEdit(false);
    show.resetFields();
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

  const actualizarEdit = () => {};

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
          <Form>
            <Button onClick={cerrarEdit} className="boton-cancelar-evento">
              Cerrar
            </Button>
            <Button
              type="primary"
              onClick={actualizarEdit}
              className="boton-cancelar-evento"
            >
              Actualizar
            </Button>
          </Form>,
        ]}
      >
        <Form
          form={show}
          initialValues={info}
          layout="vertical"
          className="form-editar"
          name="formulario_informacion"
          autoComplete="off"
        >
          <div className="form-edit-columna1">
            <Form.Item label="Titulo" name="TITULO" className="titulo-info">
              <Input readOnly={estadoFormulario}></Input>
            </Form.Item>
            <Form.Item label="Tipo" name="TIPO_EVENTO" className="titulo-info">
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

          <div className="form-edit-columna2">
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

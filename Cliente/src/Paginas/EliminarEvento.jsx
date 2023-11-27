import "../App.css";
import { Button, Table, Space, Form, message, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";

const { Column } = Table;
const { confirm } = Modal;

export default function EliminarEvento() {
  const [data, setData] = useState([]);
  const [imageData, setImageData] = useState("");
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleOk = () => {
    setVisible(false);
    form.submit();
    setFileList([]);
  };

  //Obtener datos de la base de datos
  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = () => {
    axios
      .get("http://localhost:8000/api/eventos-eliminables")
      .then((response) => {
        setData(response.data);
        console.log("los datos de la base de daatos son ", response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Eliminar evento
  function eliminarEvento(key, record) {
    axios
      .delete(`http://localhost:8000/api/quitar-evento/${key}`)
      .then((response) => {
        if (record.ESTADO === "Inscrito") {
          message.success(
            "Se eliminó el evento y se enviaron los correos a los participantes"
          );
        } else {
          message.success("El evento se eliminó correctamente");
        }
        obtenerDatos();
        setImageData(response.data);
      })
      .catch((error) => {
        message.error(
          "No puede eliminar el evento, porque esta en proceso o ha terminado"
        );
        console.log(error);
      });
  }

  const showDelete = (record) => {
    console.log("el estado", record);
    let mensaje = "Se eliminará el evento";
    if (record.ESTADO === "Inscrito") {
      mensaje =
        "El evento tiene inscritos ";
    }
    confirm({
      title: "¿Desea eliminar el evento?",
      icon: <ExclamationCircleFilled />,
      content: mensaje,
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        handleOk();
        eliminarEvento(record.id_evento, record);
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <div className="tabla-descripcion-eliminarEv">
        <p>ELIMINAR EVENTOS REGISTRADOS</p>
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
        <Column title="Tipo" dataIndex="NOMBRE_TIPO_EVENTO" key="titulo" />
        <Column title="Estado" dataIndex="ESTADO" key="estado" />
        <Column title="Fecha inicio" dataIndex="FECHA_INICIO" key="estado" />
        <Column
          align="center"
          title="Eliminar"
          key="accion"
          render={(record) => (
            <Space size="middle">
              {/* Boton para eliminar */}
              <Button type="link" onClick={() => showDelete(record)}>
                <DeleteOutlined
                  style={{ fontSize: "25px", color: "#E51919" }}
                />
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}

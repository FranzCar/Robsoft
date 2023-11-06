import "../App.css";
import {
  Button,
  Table,
  Space,
  Form,
  message,
  Modal,
} from "antd";
import React, { useState, useEffect } from "react";
import { DeleteOutlined, ExclamationCircleFilled, } from "@ant-design/icons";
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
      .get("http://localhost:8000/api/eventos-modificables")
      .then((response) => {
        setData(response.data);
        console.log("los datos de la base de daatos son ", response)
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
        message.success("El evento se eliminó correctamente");
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
    confirm({
      title: "¿Desea eliminar el evento?",
      icon: <ExclamationCircleFilled />,
      content: "Se eliminará el evento",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        console.log("el estado", record.id_evento)
        handleOk();
        eliminarEvento(record.id_evento);
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
        <Column title="Tipo" dataIndex="TIPO_EVENTO" key="titulo" />
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

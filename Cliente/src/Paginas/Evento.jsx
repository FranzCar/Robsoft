import "../App.css";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Image,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Column } = Table;


export default function Evento() {
  const [info, setInfo] = useState([]);
  const [verImagen, setVerImagen] = React.useState("");
  const [show] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);

  //Obtener datos de la base de datos
  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = () => {
    axios
      .get("http://localhost:8000/api/eventos-mostrar")
      .then((response) => {
        setData(response.data);
        console.log("El valor de la data es ",data)
      })
      .catch((error) => {
        console.error(error);
      });
  };


  //Ver mas informacion de un evento

  const handleOkInfo = () => {
    setIsModalOpen(false);
  };
  const handleCancelInfo = () => {
    setIsModalOpen(false);
    show.resetFields();
  };

  function showInfo(record) {
    setInfo(record);
    setVerImagen(record.AFICHE);
    console.log("Informacion obtenida de show ", info);
    setIsModalOpen(true);
  }

  const cerrarInfor = () => {
    setIsModalOpen(false);
    show.resetFields();
  };

  return (
    <div className="pagina-evento">
      {/*Apartado de la tabla de los eventos creados */}
      <Table
        className="tabla-eventos"
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
        <Column title="Fecha inicio" dataIndex="FECHA_INICIO" key="fecha_inicio" />
        <Column
          align="center"
          title="Informacion"
          key="accion"
          render={(record) => (
            <Space size="middle">
              <Button type="link" onClick={() => showInfo(record)}>
                <InfoCircleOutlined
                  style={{ fontSize: "25px", color: "#107710" }}
                />
              </Button>
            </Space>
          )}
        />
      </Table>

      {/*Ventana para mostrar la ventana de mas informacion */}
      <Modal
        title="Informaci&oacute;n"
        open={isModalOpen}
        onOk={handleOkInfo}
        onCancel={handleCancelInfo}
        width={470}
        footer={[
          <Form>
            <Button onClick={cerrarInfor} className="boton-cancelar-evento">
              Cerrar
            </Button>
          </Form>,
        ]}
      >
        <Form
          layout="vertical"
          className="form-verInformacion"
          name="formulario_informacion"
          autoComplete="off"
        >
          <div className="">
            <h3>Titulo:</h3>
            <p>{info.TITULO}</p>
            <br />
            <h3>Tipo :</h3>
            <p>{info.TIPO_EVENTO}</p>
            <br />
            <h3>Fecha inicio:</h3>
            <p>{info.FECHA_INICIO}</p>
            <br />
            <h3>Hora :</h3>
            <p>{info.HORA}</p>
            <br />
            <h3>Ubicación :</h3>
            <p>{info.UBICACION}</p>
            <br />
            <h3>Organizador :</h3>
            <p>{info.ORGANIZADOR}</p>
            <br />
            <h3>Patrocinador :</h3>
            <p>{info.PATROCINADOR}</p>
            <br />
            <h3>Descripción :</h3>
            <p>{info.DESCRIPCION}</p>
            <br />
            <h3>Afiche del evento :</h3>
            <Form.Item className="info-afiche" name="AFICHE">
              <Image
                width={160}
                height={160}
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

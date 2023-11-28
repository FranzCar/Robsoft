import "../App.css";
import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Table, Modal, Form, Menu, Col, Row, Select, Button } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const { Column } = Table;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

// submenu keys of first level
const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

export default function Reporte() {
  const [form] = Form.useForm();
  const [modalEventos, setModalEventos] = useState(false);
  const [listaEventos, setListaEventos] = useState([]);
  const [listaParticipantes, setListaParticipantes] = useState([]);

  useEffect(() => {
    obtenerEventosConIncritos();
  }, []);

  const seleccionarEvento = () => {
    setModalEventos(true);
  };
  const handleOk = () => {
    setModalEventos(false);
  };
  const handleCancel = () => {
    setModalEventos(false);
  };

  const items = [
    getItem("Reportes Generales", "sub1", <MailOutlined />, []),
    getItem("Reporte de Eventos", "sub2", <AppstoreOutlined />, [
      getItem(
        <Link onClick={seleccionarEvento}>Reportes de participantes</Link>,
        "5"
      ),
    ]),
    getItem("Generar Reporte", "sub4", <SettingOutlined />, [
      getItem("Option 9", "9"),
      getItem("Option 10", "10"),
      getItem("Option 11", "11"),
      getItem("Option 12", "12"),
    ]),
  ];

  const obtenerEventosConIncritos = () => {
    axios
      .get("http://localhost:8000/api/eventos-con-inscritos")
      .then((response) => {
        const listaConFormato = response.data.map((element) => ({
          id: element.id_evento,
          nombre_evento: element.TITULO,
          value: element.TITULO,
          label: element.TITULO,
        }));

        setListaEventos(listaConFormato);
        console.log("Los eventos con inscritos son ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onFinish = () => {
    const nombre = form.getFieldValue("EVENTOS");
    let id_evento = null;
    for (let i = 0; i < listaEventos.length; i++) {
      if (listaEventos[i].nombre_evento === nombre) {
        id_evento = listaEventos[i].id;
      }
    }
    console.log("El id del evento es ", id_evento);
    axios
    .get(`http://localhost:8000/api/inscritos-evento/${id_evento}`)
    .then((response) => {
      setModalEventos(false)
      form.resetFields()
      setListaParticipantes(response.data)
      console.log("los datos de los participantes son ", response)
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="tabla-descripcion-editarEv">
      <p>REPORTES DE EVENTOS</p>
      <div style={{ flex: "center" }}>
        <Row gutter={[16, 1]}>
          <Col className="main-content" span={5}>
            <Menu
              mode="inline"
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              style={{
                marginTop: "20px",
                width: "100%",
              }}
              items={items}
            />
          </Col>
          <Col className="main-content" span={16}>
            <Table
              className="tabla-reporte-participante"
              scroll={{ y: 340 }}
              dataSource={listaParticipantes}
              pagination={false}
              locale={{
                emptyText: (
                  <div style={{ padding: "95px", textAlign: "center" }}>
                    No hay participantes registrados.
                  </div>
                ),
              }}
            >
              <Column title="Nombre completo" dataIndex="nombre" key="nombre" />
              <Column
                title="Correo electrónico"
                dataIndex="correo_electronico"
                key="correo"
              />
              <Column title="Carnet de identidad" dataIndex="ci" key="ci" />
              <Column title="Género" dataIndex="genero" key="genero" />
            </Table>
          </Col>
        </Row>
      </div>

      <Modal
        title="Seleccionar un evento"
        centered
        open={modalEventos}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Form form={form} onFinish={onFinish}>
            <Button type="primary" htmlType="submit">
              Seleccionar
            </Button>
          </Form>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Eventos" name="EVENTOS">
            <Select
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Selecione uno evento"
              options={listaEventos}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

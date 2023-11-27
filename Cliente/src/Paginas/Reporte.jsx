import "../App.css";
import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Table, Space, Modal, Form, Image, Menu, Col, Row } from "antd";
import type { MenuProps } from "antd";
import axios from "axios";

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

const items= [
  getItem("Reportes Generales", "sub1", <MailOutlined />, [
    getItem("Option 1", "1"),
    getItem("Option 2", "2"),
    getItem("Option 3", "3"),
    getItem("Option 4", "4"),
  ]),
  getItem("Reportes de Eventos", "sub2", <AppstoreOutlined />, [
    getItem("Reporte Participantes", "5"),
    getItem("Option 6", "6"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),
  ]),
  getItem("Generar Reporte", "sub4", <SettingOutlined />, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Option 11", "11"),
    getItem("Option 12", "12"),
  ]),
];

// submenu keys of first level
const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

export default function Reporte() {
  const [data, setData] = useState([]);
  useEffect(() => {
    obtenerParticipantes();
  }, []);
  const obtenerParticipantes = () => {
    axios
      .get("http://localhost:8000/api/lista-participantes")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [openKeys, setOpenKeys] = useState(['sub1']);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
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
                width: "95%",
              }}
              items={items}
            />
          </Col>
          <Col className="main-content" span={16}>
            <Table
              className="tabla-reporte-participante"
              scroll={{ y: 340 }}
              dataSource={data}
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
                title="Correo electronico"
                dataIndex="correo_electronico"
                key="correo"
              />
              <Column title="Carnet de identidad" dataIndex="ci" key="ci" />
              <Column title="Genero" dataIndex="genero" key="genero" />
            </Table>
          </Col>
        </Row>
      </div>
    </div>
  );
}

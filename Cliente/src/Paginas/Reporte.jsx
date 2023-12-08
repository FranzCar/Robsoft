import "../App.css";
import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Table,
  Modal,
  Form,
  Menu,
  Col,
  Row,
  Select,
  Button,
  Checkbox,
  DatePicker,
  Tag,
} from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
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
    obtenerListaTipoEventos();
    obtenerListaUbicaciones();
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

  const [formEvent] = Form.useForm();
  const [modalFormEvent, setModalFormEvent] = useState(false);
  const [listaTipoEvento, setListaTipoEvento] = useState([]);
  const [obtenerUbicaciones, setObtenerUbicaciones] = useState([]);
  const [mostrarParticipantes, setMostrarParticipantes] = useState(false);
  const [mostrarReportes, setMostrarReportes] = useState(false);
  const [listaReportes, setListaReportes] = useState([]);

  const openFormEvent = () => {
    setModalFormEvent(true);
  };
  const handleOkFormEvent = () => {
    setModalFormEvent(false);
  };
  const handleCancelFormEvent = () => {
    formEvent.resetFields();
    setModalFormEvent(false);
  };

  const items = [
    getItem("Reportes Generales", "sub1", <MailOutlined />, [
      getItem(<Link onClick={openFormEvent}>Reportes de eventos</Link>, "4"),
    ]),
    getItem("Reporte de Eventos", "sub2", <AppstoreOutlined />, [
      getItem(
        <Link onClick={seleccionarEvento}>Reportes de participantes</Link>,
        "5"
      ),
    ]),
    getItem("Generar Reporte", "sub4", <SettingOutlined />, [
      getItem("Option 9", "9"),
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
  //Validaciones
  //Restringir las fechas
  const disabledDate = (current) => {
    // Establecemos la fecha mínima como 1 de enero de 2023
    const minDate = new Date("2023-01-01");

    // Establecemos la fecha máxima como 180 días después de la fecha actual
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 180);

    // Comparamos si la fecha actual está antes de la fecha mínima o después de la fecha máxima
    return current < minDate || current > maxDate;
  };

  const disabledDateFin = (current) => {
    // Obtenemos la fecha seleccionada en "Fecha inicio"
    const fechaInicioValue = formEvent.getFieldValue("FECHA_INICIO");

    // Si no hay fecha seleccionada en "Fecha inicio" o la fecha actual es anterior, deshabilitar
    if (!fechaInicioValue || current < fechaInicioValue) {
      return true;
    }

    // Calculamos la fecha máxima permitida (180 días desde la fecha actual)
    const fechaMaxima = moment().add(180, "days");

    // Si la fecha actual es posterior a la fecha máxima permitida, deshabilitar
    return current > fechaMaxima;
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
        setModalEventos(false);
        form.resetFields();
        setListaParticipantes(response.data);
        console.log("los datos de los participantes son ", response);
        setMostrarParticipantes(true);
        setMostrarReportes(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const datosReporte = (values) => {
    const fechaIni = values.FECHA_INICIO;
    const NUEVAFECHAINI = fechaIni.format("YYYY-MM-DD");
    const fechaFin = values.FECHA_FIN;
    const NUEVAFECHAFIN = fechaFin.format("YYYY-MM-DD");
    const datos = {
      fecha_inicio: NUEVAFECHAINI,
      fecha_fin: NUEVAFECHAFIN,
      tipo_evento: values.TIPO_EVENTO,
      modalidad: values.MODALIDAD,
      participacion: values.PARTICIPACION,
      publico: values.DIRIGIDO_A,
      ubicacion: values.UBICACION,
      entrenador_obligatorio: values.ENTRENADOR,
      incluye_organizadores: values.M1,
      incluye_patrocinadores: values.M2,
      incluye_ubicaciones: values.M3,
    };

    return datos;
  };

  const onFinishFormEvent = (values) => {
    const datos = datosReporte(values);
    console.log("los datos del FORM son ", datos);
    axios
      .get("http://localhost:8000/api/reporte-eventos", datos)
      .then((response) => {
        setModalFormEvent(false);
        setListaReportes(response.data);
        console.log("los datos de los reportes son ", response.data);
        formEvent.resetFields();
        setMostrarReportes(true);
        setMostrarParticipantes(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const obtenerListaTipoEventos = () => {
    axios
      .get("http://localhost:8000/api/lista-tipo-eventos")
      .then((response) => {
        const listaConFormato = response.data.map((element) => ({
          id: element.id_tipo_evento,
          nombre: element.nombre_tipo_evento,
          value: element.id_tipo_evento, // Aquí usamos el ID como valor
          label: element.nombre_tipo_evento, // Y el nombre como etiqueta
        }));
        setListaTipoEvento(listaConFormato);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const obtenerListaUbicaciones = () => {
    axios
      .get("http://localhost:8000/api/lista-ubicaciones")
      .then((response) => {
        const listaConFormato = response.data.map((element) => ({
          id: element.id_ubicacion,
          nombre: element.nombre_ambiente,
          value: element.nombre_ambiente,
          label: element.nombre_ambiente,
        }));
        setObtenerUbicaciones(listaConFormato);
        console.log("lista de ubicaciones ", response.data);
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
            {mostrarParticipantes && (
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
                <Column
                  title="Nombre completo"
                  dataIndex="nombre"
                  key="nombre"
                />
                <Column
                  title="Correo electrónico"
                  dataIndex="correo_electronico"
                  key="correo"
                />
                <Column title="Carnet de identidad" dataIndex="ci" key="ci" />
                <Column title="Género" dataIndex="genero" key="genero" />
              </Table>
            )}
            {mostrarReportes && (
              <Table
                className="tabla-reporte"
                scroll={{ y: 340 }}
                dataSource={listaReportes}
                pagination={false}
                locale={{
                  emptyText: (
                    <div style={{ padding: "95px", textAlign: "center" }}>
                      No hay eventos registrados.
                    </div>
                  ),
                }}
              >
                <Column title="Titulo" dataIndex="Titulo" key="Titulo" />
                <Column
                  title="Tipo"
                  dataIndex="Tipo de evento"
                  key="Tipo de evento"
                />
                <Column
                  title="Modalidad"
                  dataIndex="Modalidad"
                  key="Modalidad"
                />
                <Column
                  title="Participacion"
                  dataIndex="Participacion"
                  key="Participacion"
                />
                <Column
                  title="Patrocinadores"
                  dataIndex="Patrocinadores"
                  key="Patrocinadores"
                  render={(Patrocinadores) => (
                    <>
                      {Patrocinadores && Patrocinadores.length > 0 ? (
                        Patrocinadores.map((tag) => (
                          <Tag color="blue" key={tag}>
                            {tag}
                          </Tag>
                        ))
                      ) : (
                        <span>Sin patrocinadores</span>
                      )}
                    </>
                  )}
                />

                <Column
                  title="Organizadores"
                  dataIndex="organizadores"
                  key="organizadores"
                />
                <Column
                  title="Ubicacion"
                  dataIndex="ubicacion"
                  key="ubicacion"
                />
              </Table>
            )}
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
              placeholder="Selecione un tipo evento"
              options={listaEventos}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/*Modal Formulario Reportes de eventos*/}
      <Modal
        title="Generar reporte"
        centered
        open={modalFormEvent}
        onOk={handleOkFormEvent}
        onCancel={handleCancelFormEvent}
        maskClosable={false}
        keyboard={false}
        width={1000}
        footer={[
          <Form
            form={formEvent}
            onFinish={onFinishFormEvent}
            style={{
              marginTop: "6%",
            }}
          >
            <Button
              onClick={handleCancelFormEvent}
              className="boton-cancelar-registro"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="boton-guardar-registro"
            >
              Generar reporte
            </Button>
          </Form>,
        ]}
      >
        <Form
          form={formEvent}
          layout="horizontal"
          style={{
            width: "95%",
            backgroundColor: "#ffff",
            margin: "2% 3% 0% 3%",
            borderRadius: "15px",
            display: "grid",
          }}
        >
          <Col>
            <Row span={8}>
              <h4>Eventos:</h4>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item
                  label="Tipo de Evento"
                  name="TIPO_EVENTO"
                  rules={[
                    {
                      required: true,
                      message: "Seleccion un tipo de evento",
                    },
                  ]}
                >
                  <Select
                    placeholder="Selecione un evento"
                    allowClear
                    options={listaTipoEvento}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Fecha inicio" name="FECHA_INICIO">
                  <DatePicker
                    style={{
                      width: "200px",
                      maxWidth: "100%",
                    }}
                    placeholder="Selecciona una fecha"
                    disabledDate={disabledDate}
                  />
                </Form.Item>

                <Form.Item label="Fecha fin" name="FECHA_FIN">
                  <DatePicker
                    style={{
                      width: "200px",
                      maxWidth: "100%",
                    }}
                    placeholder="Selecciona una fecha"
                    disabledDate={disabledDateFin}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row span={8}>
              <h4>Filtros:</h4>
            </Row>
            <Row gutter={[16, 8]}>
              {/*Form Items filtros*/}
              <Col span={12}>
                <Form.Item label="Modalidad" name="MODALIDAD">
                  <Select
                    placeholder="Selecione una modalidad"
                    allowClear
                    options={[
                      {
                        value: "Cerrado",
                        label: "Cerrado",
                      },
                      {
                        value: "Abierto",
                        label: "Abierto",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Participacion" name="PARTICIPACION">
                  <Select
                    placeholder="Selecione un tipo de participacion "
                    allowClear
                    options={[
                      {
                        value: "Grupal",
                        label: "Grupal",
                      },
                      {
                        value: "Individual",
                        label: "Individual",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Dirigido a" name="DIRIGIDO_A">
                  <Select
                    placeholder="Seleccione uno"
                    allowClear
                    options={[
                      {
                        value: "Universitarios",
                        label: "Universitarios",
                      },
                      {
                        value: "Colegios",
                        label: "Colegios",
                      },
                      {
                        value: "Profesionales",
                        label: "Profesionales",
                      },
                      {
                        value: "Técnico",
                        label: "Técnico",
                      },
                      {
                        value: "Todo público",
                        label: "Todo público",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ubicacion" name="UBICACION">
                  <Select
                    placeholder="Selecione una ubicacion"
                    allowClear
                    options={obtenerUbicaciones}
                  />
                </Form.Item>
                <Form.Item label="Entrenador" name="ENTRENADOR">
                  <Select
                    placeholder="Selecione uno entrenador"
                    allowClear
                    options={[
                      {
                        value: true,
                        label: "Obligatorio",
                      },
                      {
                        value: false,
                        label: "No obligatorio",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row span={8}>
              <h4>Mostrar:</h4>
            </Row>
            <Row>
              {/*Form Items mostrar*/}
              <Col span={8}>
                <Form.Item
                  name="M1"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox>Mostrar patrocinadores</Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="M2"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox>Mostrar organizadores</Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="M3"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox>Mostrar ubicacion</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Form>
      </Modal>
    </div>
  );
}

import "../App.css";
import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  ExclamationCircleFilled,
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

const { confirm } = Modal;

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
    setMostrarPatrocinadores(false);
    setMostrarOrganizadores(false);
    setMostrarUbicaciones(false);
    setModalFormEvent(true);
    setMostrarReportes(false);
    setMostrarParticipantes(false);
  };
  const handleCancelFormEvent = () => {
    confirm({
      title: "¿Está seguro de que desea cancelar?",
      icon: <ExclamationCircleFilled />,
      content: "Se perdera el progreso realizado.",
      okText: "Si",
      cancelText: "No",
      centered: "true",

      onOk() {
        formEvent.resetFields();
        setModalFormEvent(false);
      },
      onCancel() {},
    });
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
  ];

  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

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
  const datosReporte = (values) => {
    const fechaIni = values.FECHA_INICIO;
    const NUEVAFECHAINI = fechaIni.format("YYYY-MM-DD");
    const fechaFin = values.FECHA_FIN;
    const NUEVAFECHAFIN = fechaFin.format("YYYY-MM-DD");
    const datos = {
      fecha_inicio: NUEVAFECHAINI,
      fecha_fin: NUEVAFECHAFIN,
      tipo_evento: values.TIPO_EVENTO,
      modalidad: values.MODALIDAD ?? "",
      participacion: values.PARTICIPACION ?? "",
      publico: values.DIRIGIDO_A ?? "",
      ubicacion: values.UBICACION ?? "",
      entrenador_obligatorio: values.ENTRENADOR ?? true,
      incluye_organizadores: values.M2 ? 1 : 0,
      incluye_patrocinadores: values.M1 ? 1 : 0,
      incluye_ubicaciones: values.M3 ? 1 : 0,
    };

    return datos;
  };

  const onFinishFormEvent = (values) => {
    const datos = datosReporte(values);
    console.log("FORM event ", datos);
    axios
      .get("http://localhost:8000/api/reporte-eventos", { params: datos })
      .then((response) => {
        console.log("response data ", response.data);
        setModalFormEvent(false);
        formEvent.resetFields();
        setListaReportes(response.data);
        setMostrarReportes(true);
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
          value: element.nombre_tipo_evento, // Aquí usamos el ID como valor
          label: element.nombre_tipo_evento, // Y el nombre como etiqueta
        }));
        setListaTipoEvento(listaConFormato);
        console.log("lista Eventos, ", listaConFormato);
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
  const [mostrarPatrocinadores, setMostrarPatrocinadores] = useState(false);
  const [mostrarOrganizadores, setMostrarOrganizadores] = useState(false);
  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);

  return (
    <div className="tabla-descripcion-editarEv">
      <p>REPORTES DE EVENTOS</p>
      <Row>
        <Col span={5}>
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            items={items}
            style={{
              borderRadius: "5%",
              marginLeft: "10%",
              marginRight: "10%",
              background: "#ffffff",
              marginTop: "5%",
              width: "100%",
            }}
          />
        </Col>
        <Col
          span={16}
          style={{
            borderRadius: "3%",
            marginLeft: "4%",
            marginRight: "1%",
            marginTop: "1%",
            background: "#ffffff",
          }}
        >
          {mostrarParticipantes && (
            <Table
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
          )}
          {mostrarReportes && (
            <Table
              className="tabla-reporte"
              scroll={{ y: 340 }}
              dataSource={listaReportes}
              pagination={false}
              style={{ width: "100%" }}
              locale={{
                emptyText: (
                  <div style={{ padding: "95px", textAlign: "center" }}>
                    No hay eventos registrados.
                  </div>
                ),
              }}
            >
              <Column
                title="Titulo"
                dataIndex="Titulo"
                key="Titulo"
                width={160}
              />
              <Column
                title="Tipo"
                dataIndex="Tipo de evento"
                key="Tipo de evento"
                width={195}
              />
              <Column
                title="Modalidad"
                dataIndex="Modalidad"
                key="Modalidad"
                width={120}
              />
              <Column
                title="Participacion"
                dataIndex="Participacion"
                key="Participacion"
                width={120}
              />
              {mostrarPatrocinadores && (
                <Column
                  title="Patrocinadores"
                  dataIndex="Patrocinadores"
                  key="Patrocinadores"
                  width={185}
                  render={(Patrocinadores) => (
                    <>
                      {Patrocinadores ? (
                        Patrocinadores.split(",").map((patrocinador, index) => (
                          <Tag color="blue" key={index}>
                            {patrocinador.trim()}
                          </Tag>
                        ))
                      ) : (
                        <span>Sin patrocinadores</span>
                      )}
                    </>
                  )}
                />
              )}
              {mostrarOrganizadores && (
                <Column
                  title="Organizadores"
                  dataIndex="Organizadores"
                  key="Organizadores"
                  width={150}
                  render={(Organizadores) => (
                    <>
                      {Organizadores ? (
                        Organizadores.split(",").map((organizador, index) => (
                          <Tag color="blue" key={index}>
                            {organizador.trim()}
                          </Tag>
                        ))
                      ) : (
                        <span>Sin organizadores</span>
                      )}
                    </>
                  )}
                />
              )}
              {mostrarUbicaciones && (
                <Column
                  title="Ubicaciones"
                  dataIndex="Ubicaciones"
                  key="Ubicaciones"
                  width={130}
                  render={(Ubicaciones) => (
                    <>
                      {Ubicaciones ? (
                        Ubicaciones.split(",").map((ubicacion, index) => (
                          <Tag color="blue" key={index}>
                            {ubicacion.trim()}
                          </Tag>
                        ))
                      ) : (
                        <span>Sin ubicaciones</span>
                      )}
                    </>
                  )}
                />
              )}
            </Table>
          )}
        </Col>
      </Row>
      {/*Modal Formulario seleccionar evento, reporte participantes*/}
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
        onCancel={handleCancelFormEvent}
        maskClosable={false}
        keyboard={false}
        closable={false}
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
                <Form.Item
                  label="Fecha inicio"
                  name="FECHA_INICIO"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione la fecha inicio",
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      width: "200px",
                      maxWidth: "100%",
                    }}
                    placeholder="Selecciona una fecha"
                    disabledDate={disabledDate}
                  />
                </Form.Item>

                <Form.Item
                  label="Fecha fin"
                  name="FECHA_FIN"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione la fecha fin",
                    },
                  ]}
                >
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
                    placeholder="Seleccione si es requerido"
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
                    defaultValue={true}
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
                  <Checkbox
                    onChange={(e) => setMostrarPatrocinadores(e.target.checked)}
                    defaultChecked={false}
                  >
                    Mostrar patrocinadores
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="M2"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox
                    onChange={(e) => setMostrarOrganizadores(e.target.checked)}
                    defaultChecked={false}
                  >
                    Mostrar organizadores
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="M3"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox
                    onChange={(e) => setMostrarUbicaciones(e.target.checked)}
                    defaultChecked={false}
                  >
                    Mostrar ubicaciones
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Form>
      </Modal>
    </div>
  );
}

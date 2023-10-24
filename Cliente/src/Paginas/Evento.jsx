import "../App.css";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  message,
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
  const [fileList, setFileList] = useState([]);
  const [show] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
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

  //Guardar evento
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
    const fecha = values.FECHA;
    const NUEVAFECHA = fecha.format("YYYY-MM-DD");
    const hora = values.HORA;
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
      AFICHE: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };
    return datos;
  };

  const validarDuplicado = (values) => {
    const titulo = values.TITULO;
    let resultado = false; // Cambiamos de const a let

    for (let i = 0; i < data.length; i++) {
      if (data[i].TITULO === titulo) {
        console.log(
          `Se encontró un objeto con campoObjetivo igual a "${titulo}" en el índice ${i}.`
        );
        resultado = true;
        break; // Puedes usar 'break' si deseas detener la búsqueda cuando se encuentra una coincidencia
      }
    }
    if (!resultado) {
      console.log("NO hay datos iguales");
    }

    return resultado;
  };

  const validarCampos = (error) => {
    console.log("Error validarcampo ", error);
    if (error === "El campo t i t u l o debe tener al menos 5 caracteres.") {
      console.log("validar campo titulo");
    }
  };

  const confirmSave = (values) => {
    const datos = datosEvento(values);
    const duplicado = validarDuplicado(values);

    if (duplicado === true) {
      console.log(
        "No se cierra el formul ario y no se guarda, se mustra un mensaje de q existe evento duplicado"
      );
      setVisible(true);
      message.error("Exite un evento con el mismo titulo");
    } else {
      console.log("Se guarda los datos en la BD");
      axios
        .post("http://localhost:8000/api/guardar-evento", datos)
        .then((response) => {
          console.log("Datos guardados con éxito", response.data);
          obtenerDatos();
          message.success("El evento se registró correctamente");
        })
        .catch((error) => {
          if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            const errores = error.response.data.errors;
            for (let campo in errores) {
              message.error(errores[campo][0]); // Mostramos solo el primer mensaje de error de cada campo
              validarCampos(errores[campo][0]);
            }
          } else {
            // Otros errores (problemas de red, etc.)
            message.error("Ocurrió un error al guardar los datos.");
          }
        });
      setVisible(false);
      form.resetFields();
      setFileList([]);
    }
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
        <Column title="Fecha" dataIndex="FECHA" key="estado" />
        <Column
          align="center"
          title="Opciones"
          key="accion"
          render={(record) => (
            <Space size="middle">
              {/* Boton para eliminar */}
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
        title="Informaci&oacute;n del evento"
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
          form={show}
          initialValues={info}
          layout="vertical"
          className="form-verInformacion"
          name="formulario_informacion"
          autoComplete="off"
        >
          <div className="mostrar-informacion">
            <h3>Titulo:</h3>
            <p>{info.TITULO}</p>
            <br />
            <h3>Tipo :</h3>
            <p>{info.TIPO_EVENTO}</p>
            <br />
            <h3>Fecha :</h3>
            <p>{info.FECHA}</p>
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

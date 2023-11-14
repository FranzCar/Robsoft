import "../App.css";

import { Link, useLocation } from "react-router-dom";
import { Dropdown } from "antd";


const items = [
  {
    key: "1",
    label: <Link to="/crearEvento">CREAR EVENTO</Link>,
  },
  {
    key: "2",
    label: <Link to="/editarEvento">EDITAR EVENTO</Link>,
  },
  {
    key: "3",
    label: <Link to="/eliminarEvento">ELIMINAR EVENTO</Link>,
  },
  {
    key: "4",
    label: <Link to="/detalleEvento">DETALLES DE EVENTO</Link>,
  },
];
export default function Menu() {
  const location = useLocation();
  return (
    <div className="header-acciones">
      <div className="parte-superior-menu" />

      <div className="titulos-menu">
        <div className="botones-inicio">
          <Link
            to="/"
            className={`boton-inicio ${
              location.pathname === "/" ? "activo" : ""
            }`}
          >
            INICIO
          </Link>
          <Link
            to="/Evento"
            className={`boton-inicio ${
              location.pathname === "/Evento" ? "activo" : ""
            }`}
          >
            EVENTOS
          </Link>
          <Link
            to="/Participante"
            className={`boton-inicio ${
              location.pathname === "/Participante" ? "activo" : ""
            }`}
          >
            PARTICIPANTES
          </Link>
          <Dropdown
            menu={{
              items,
              selectable: true,
            }}
            placement="bottom"
            arrow={{
              pointAtCenter: true,
            }}
            className="menu-desplegable"
          >
            <Link className="boton-administracion">ADMINISTRACIÓN</Link>
          </Dropdown>
          <Link className="boton-inicio">CONTACTO</Link>
        </div>
      </div>
    </div>
  );
}

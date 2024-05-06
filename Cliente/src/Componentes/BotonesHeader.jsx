import "../App.css";
import { Button } from "antd";
import { useState, useEffect } from "react";

export default function BotonesHeader({
  onLoginClick,
  onClickCerrar,
  administrador,
  usuario,
}) {
  //Valores para mostrar las opciones del menu q se requiere
  const [mostrarInscripciones, setMostrarIncripciones] = useState(true);
  const [mostrarListaEventos, setMostrarListaEventos] = useState(false);
  const [mostrarGestionEventos, setMostrarGestionEventos] = useState(false);
  const [mostrarReportes, setMostrarReportes] = useState(false);
  const [mostrarAdministrador, setMostrarAdministrador] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("administrador") === "true") {
      setMostrarAdministrador(true);
    } else if (localStorage.getItem("administrador") === "false") {
      setMostrarAdministrador(false);
    }
  }, []);
  const mostrarLogin = () => {
    //pasar un valor a App.jsx
    onLoginClick(true);
  };
  const cerrarSesion = () => {
    localStorage.setItem("listaEventos", false);
    localStorage.setItem("gestionEventos", false);
    localStorage.setItem("reportes", false);
    localStorage.setItem("administrador", false);
    window.location.reload();
  };

  return (
    <div className="botones">
      {mostrarAdministrador && (
        <div>
          <Button
            type="link"
            onClick={cerrarSesion}
            className="boton-registrar"
          >
            Cerrar sesión
          </Button>
        </div>
      )}
      {/* <div className='botones-columna1'>
           <p> Usuario: {usuario}</p>
          </div>
          <div className='botones-columna2'>
          
          <Button type='link' onClick={mostrarLogin} className='boton-registrar'> Iniciar sesi&oacute;n</Button>
          <Button type='link' onClick={cerrarSesion} className='boton-registrar'> Cerrar sesión</Button>
        
        </div>*/}
    </div>
  );
}

import '../App.css';
import { Button } from 'antd';

export default function BotonesHeader({ onLoginClick, onClickCerrar, usuario}) {

  const mostrarLogin = () => {
    //pasar un valor a App.jsx
    onLoginClick(true);
  }
  const cerrarSesion = () =>{
    onClickCerrar(true)
  }
    return(
        <div  className='botones'>
          <div className='botones-columna1'>
           <p> Usuario: {usuario}</p>
          </div>
          <div className='botones-columna2'>
          <Button type='link' onClick={mostrarLogin} className='boton-registrar'> Iniciar sesi&oacute;n</Button>
          <Button type='link' onClick={cerrarSesion} className='boton-registrar'> Cerrar sesión</Button>
        </div>
        </div>
    )
}
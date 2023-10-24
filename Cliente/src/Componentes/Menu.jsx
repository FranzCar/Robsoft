import '../App.css'

import { Link } from 'react-router-dom';
import { Dropdown} from 'antd';

const items = [
  {
    key: '1',
    label: (
        <Link  to='/crearEvento'>Crear evento</Link>
    ),
  },
  {
    key: '2',
    label: (
      <Link  to='/editarEvento'>Editar evento</Link>
    ),
  },
  {
    key: '3',
    label: (
      <Link  to='/eliminarEvento'>Eliminar evento</Link>
    ),
  },
];
  export default function Menu() {
      return(
          <div className='header-acciones'>

            <div className='parte-superior-menu' />
          

            <div className='titulos-menu'>
                <div className='botones-inicio'>
                  <Link to='/' className='boton-inicio' >Inicio</Link>
                  <Link to='/Evento'  className='boton-inicio'>Eventos</Link>
                  <Link  className='boton-inicio'>Participantes</Link>
                  <Dropdown
                    menu={{
                      items,
                      selectable: true,
                    }}
                    placement="bottom"
                    arrow={{
                      pointAtCenter: true,
                    }}
                    className='menu-desplegable'
                  >
                    <Link className='boton-administracion'>Administración</Link>
                  </Dropdown>
                  <Link  className='boton-inicio'>Contacto</Link>
                </div>
            </div>
        </div>
    )
}
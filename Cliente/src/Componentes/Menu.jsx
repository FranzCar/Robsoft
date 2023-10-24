import '../App.css'

import { Link } from 'react-router-dom';
import { Button, Dropdown, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer">
        <Link  to='/Evento'>Crear evento</Link>
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="/Evento">
        Editar evento
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        Eliminar evento
      </a>
    ),
  },
];
  export default function Menu() {
      return(
          <div className='header-acciones'>

            <div className='parte-superior-menu' />
          

            <div className='titulos-menu'>
                <div className='botones-inicio'>
                  <Link to='/' className='boton-inicio'>Inicio</Link>
                  <Link to='/Evento'  className='boton-inicio'>Evento</Link>
                  <Link to='/Participante' className='boton-inicio'>Participantes</Link>
                  <Dropdown
                    menu={{
                      items,
                    }}
                    placement="bottom"
                  >
                    <Link className='boton-inicio'>Administración</Link>
                  </Dropdown>
                  <Link  className='boton-inicio'>Contacto</Link>
                </div>
            </div>
        </div>
    )
}
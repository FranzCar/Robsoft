import '../App.css'

import { Link } from 'react-router-dom';


  export default function Menu() {
      return(
          <div className='header-acciones'>

            <div className='parte-superior-menu' />
          

            <div className='titulos-menu'>
                <div className='botones-inicio'>
                  <Link to='/' className='boton-inicio'>Inicio</Link>
                  <Link to='/Evento'  className='boton-inicio'>Evento</Link>
                  <Link  className='boton-inicio'>Participantes</Link>
                  <Link  className='boton-inicio'>Programacion</Link>
                  <Link  className='boton-inicio'>Contacto</Link>
                </div>
            </div>
        </div>
    )
}
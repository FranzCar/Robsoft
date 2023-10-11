import '../App.css';
import { Button } from 'antd';

export default function BotonesHeader() {
    return(
        <div className='botones'>
          <Button type='link' className='boton-registrar'> Iniciar sesi&oacute;n</Button>
          <Button type='link' className='boton-registrar'> Registrarse</Button>
        </div>
    )
}
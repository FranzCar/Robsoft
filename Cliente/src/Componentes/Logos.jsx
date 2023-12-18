import '../App.css'
import logoUMSS from '../Imagenes/logo-umss.png'
import logoICPC from '../Imagenes/logo-icpc.png'

export default function Logos() {
    return(
        <div className='header-logos'>
            <div className='logo1'>
                <img src={logoUMSS} className='logo-umss'></img>
            </div>
            <div className='titulo' >SISTEMA DE COMPETENCIAS ICPC-UMSS</div>
            <div className='logo2'>
                <img src={logoICPC} className='logo-icpc'></img>
            </div>
        </div>
    )
}
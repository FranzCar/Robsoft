import '../App.css'
import logoUMSS from '../Imagenes/logo-umss.png'
import logoICPC from '../Imagenes/logo-icpc.png'
import icpccubo from '../Imagenes/icpc-cubo.png'
import logoumss from '../Imagenes/logo-umss-2.png'

export default function Logos() {
    return(
        <div className='header-logos'>
                <img src={logoUMSS} className='logo-umss'></img>
           
            <div className='titulo' >ICPC-UMSS</div>
                <img src={icpccubo} className='logo-icpc'></img>
         
        </div>
    )
}
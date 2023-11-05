
import './App.css';
import BotonesHeader from './Componentes/BotonesHeader';
import Logos from './Componentes/Logos';
import Menu from './Componentes/Menu';
import Evento from './Paginas/Evento'
import Inicio from './Paginas/Inicio'
import CrearEvento from './Paginas/CrearEvento'
import EliminarEvento from './Paginas/EliminarEvento'
import EditarEvento from './Paginas/EditarEvento'
import Participante from './Paginas/Participante'
import DetalleEvento from './Paginas/DetalleEvento';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout className='principal'>
      <Header className='header'>

        <div className='header-botones'>
          <BotonesHeader />
        </div>
      
          <Logos/>
      
          <Menu />
        
      </Header>
      <Content className='content'>
        <Routes> 
          <Route path='/' element={<Inicio />}/>
          <Route path='/evento' element= {<Evento/>}/>
          <Route path='/Participante' element= {<Participante/>}/>
          <Route path='/crearEvento' element= {<CrearEvento/>}/>
          <Route path='/eliminarEvento' element= {<EliminarEvento/>}/>
          <Route path='/editarEvento' element= {<EditarEvento/>}/>
          <Route path='/detalleEvento' element= {<DetalleEvento/>}/>

        </Routes>
      </Content>
      <Footer className='footer'>Universidad Mayor de San Simon</Footer>
    </Layout>
  );
}

export default App;

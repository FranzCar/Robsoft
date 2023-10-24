
import './App.css';
import BotonesHeader from './Componentes/BotonesHeader';
import Logos from './Componentes/Logos';
import Menu from './Componentes/Menu';
import Evento from './Paginas/Evento'
import Inicio from './Paginas/Inicio'
import Eliminar from './Paginas/EliminarEvento'
import Editar from './Paginas/EditarEvento'
import Crear from './Paginas/CrearEvento'
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
          <Route path='/evento' element= {<Evento />}/>
          <Route path='/crearEvento' element= {<Crear />}/>
          <Route path='/eliminarEvento' element={<Eliminar />}/>
          <Route path='/editarEvento' element ={<Editar />} />
        </Routes>
      </Content>
      <Footer className='footer'>Universidad Mayor de San Simon</Footer>
    </Layout>
  );
}

export default App;

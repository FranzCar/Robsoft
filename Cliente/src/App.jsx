
import './App.css';
import BotonesHeader from './Componentes/BotonesHeader';
import Logos from './Componentes/Logos';
import Menu from './Componentes/Menu';
import Evento from './Paginas/Evento'
import Inicio from './Paginas/Inicio'
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout>
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
        </Routes>
      </Content>
      <Footer className='footer'>Universidad Mayor de San Simon</Footer>
    </Layout>
  );
}

export default App;

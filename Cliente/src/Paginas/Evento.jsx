import '../App.css'
import { Button, Table, Space, Modal, Form, Input,
         Select, DatePicker,TimePicker, Upload, message } from 'antd'
import React, { useState } from 'react';
import {    DeleteOutlined,
            EditOutlined,
            PlusOutlined,
            ExclamationCircleFilled,
} from '@ant-design/icons';

    const { TextArea } = Input;
    const { confirm } = Modal;
    const { Column } = Table;
    const format = 'HH:mm';
    
    const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    const onFinish = (values) => {
        console.log('Success:', values);
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

export default function Evento() {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const showModal = () => {
            setIsModalOpen(true);
        };
        const handleOk = () => {
            setIsModalOpen(false);
        };
        const handleCancel = () => {
            setIsModalOpen(false);
        };

        const [previewOpen, setPreviewOpen] = useState(false);
        const [previewImage, setPreviewImage] = useState('');
        const [previewTitle, setPreviewTitle] = useState('');
        const handleCancelIMG = () => setPreviewOpen(false);
        const [fileList, setFileList] = useState([]);

        const handlePreview = async (file) => {
            if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj);
            }
            setPreviewImage(file.url || file.preview);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
          };
          const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
          const uploadButton = (
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Subir imagen
              </div>
            </div>
          );

         //Mensaje de confirmacion al dar guardar en la parte de modal del evento
        const showConfirm = () => {
            confirm({
            title: '¿Desea guardar este evento?',
            icon: <ExclamationCircleFilled />,
            content: 'Se registrarán los datos ingresados',
            okText: "Aceptar",
            cancelText: "Cancelar",
            centered: 'true',
            
            onOk() {
                handleOk()
                message.success('El evento se registro correctamente')
            },
            onCancel() {
            },
            })
        };
        //Mensaje al dar al boton cancelar del formulario de crear evento
        const showCancel = () => {
            confirm({
            title: '¿Estás seguro de que deseas cancelar este evento?',
            icon: <ExclamationCircleFilled />,
            content: 'Los cambios no se guardarán',
            okText: "Aceptar",
            cancelText: "Cancelar",
            centered: 'true',
            
            onOk() {
                handleOk()
            },
            onCancel() {
            },
            })
        }
        

    return(
        <div className='pagina-evento'>
            <Button className='boton-crear-evento' onClick={showModal}>Crear evento</Button>

            <Modal  title="Registro de evento" 
                    className='modal-evento'
                    open={isModalOpen} 
                    onOk={handleOk} 
                    onCancel={handleCancel}
                    okText= "Guardar"
                    cancelText= "Cancelar"
                    footer={[
                        <Form>
                            <Button onClick={showCancel} className='boton-cancelar-evento'>Cancelar</Button>
                            <Button onClick={showConfirm} type='primary' className='boton-guardar-evento' >Guardar</Button>
                        </Form>
                    ]}
            >
                <Form layout='vertical'
                        className='form-evento'
                        autoComplete="off"  
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed} 
                        >
                    <Form.Item label="T&iacute;tulo"
                                name="titulo"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Por favor ingrese un título',
                                    },
                                  ]}>
                        <Input placeholder='Ingrese el titulo del evento'></Input>
                    </Form.Item>

                    <Form.Item label="Tipo"
                                name="tipo"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Por favor ingrese un tipo de evento',
                                    },
                                  ]}>
                        <Select
                            style={{
                                width: 200,
                            }}
                            allowClear
                            options={[
                                {
                                value: '1',
                                label: 'Estilo ICPC',
                                },
                                {
                                value: '2',
                                label: 'Estilo libre'
                                },
                                {
                                value: '3',
                                label: 'Taller de programación'    
                                },
                                {
                                value: '4',
                                label: 'Sesión de reclutamiento'    
                                },
                                {
                                value: '5',
                                label: 'Torneos de programación'    
                                },
                                {
                                value: '6',
                                label: 'Entrenamientos'    
                                },
                                {
                                value: '7',
                                label: 'Otros'
                                }
                            ]}
                        />
                    </Form.Item>

                    <div className='form-fecha-hora'>
                        <Form.Item  label="Fecha" 
                                    name="fecha"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Por favor ingrese una fecha',
                                        },
                                    ]}>
                            <DatePicker />
                        </Form.Item>

                        <Form.Item  label="Hora"
                                    name="hora"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Por favor ingrese una hora',
                                        },
                                    ]}> 
                            <TimePicker  format={format} />
                        </Form.Item>
                    </div>

                    <Form.Item label="Ubicaci&oacute;n"
                                name="ubicacion"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Por favor ingrese una ubicación',
                                    },
                                ]}>
                        <Input placeholder='Ingrese la ubicación del evento'></Input>
                    </Form.Item>

                    <Form.Item label="Descripci&oacute;n"
                                name="descripcion"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Por favor ingrese una descripción del evento',
                                    },
                                ]}>
                        <TextArea />
                    </Form.Item>

                    <Form.Item label="Organizador"
                                name="organizador"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Por favor ingrese un organizador',
                                    },
                                ]}>
                        <Input placeholder='Ingrese el nombre del patrocinador'></Input>
                    </Form.Item>

                    <Form.Item label="Patrocinador">
                        <Input placeholder='Ingrese el nombre del patrocinador'></Input>
                    </Form.Item>

                    <Form.Item label="Afiche del evento">
                        <Upload
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            listType="picture-card"
                            onPreview={handlePreview}
                            onChange={handleChange}
                            maxCount={1}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelIMG}>
                            <img
                            alt="example"
                            style={{
                                width: 'auto',
                                height: '400px',
                            }}
                            src={previewImage}
                            />
                        </Modal>
                    </Form.Item>

                </Form>
            </Modal>

            <Table  className='tabla-eventos'
                     pagination={false}
                     locale={{
                        emptyText: (
                          <div style={{ padding: '70px', textAlign: 'center' }}>
                            No hay datos disponibles.
                          </div>
                        ),
                      }}
                     
            >
                <Column title="T&iacute;tulo" />
                <Column title="Tipo"  />
                <Column title="Estado"   />
                <Column title="Fecha"  />
                <Column align='center' title="Opciones"  
                    key="accion"
                    render=
                    {(record) =>(
                    <Space size="middle">
                        {/* Boton para editar  */}
                        <Button type='link'>
                            <EditOutlined style={{  fontSize: '25px', color: '#3498DB'}} />
                        </Button>
                        {/* Boton para eliminar */}
                        <Button type='link' >
                            <DeleteOutlined  style={{  fontSize: '25px', color: '#E51919'}} />
                        </Button >
                            
                    </Space>
                )}/>
                  
            </Table>
        </div>
    )
}
import '../App.css'
import { Button, Table, Space, Modal, Form, Input,
         Select, DatePicker,TimePicker, Upload, message } from 'antd'
import React, { useState, useEffect } from 'react';
import {    DeleteOutlined,
            EditOutlined,
            PlusOutlined,
            ExclamationCircleFilled,
} from '@ant-design/icons';
import axios from 'axios'


    const { TextArea } = Input;
    const { confirm } = Modal;
    const { Column } = Table;
    
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
            title: '¿Esta seguro de guardar este evento?',
            icon: <ExclamationCircleFilled />,
            content: '',
            okText: "Si",
            cancelText: "No",
            centered: 'true',
            
            onOk() {
                handleOk()
                form.resetFields();
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
            okText: "Si",
            cancelText: "No",
            centered: 'true',
            
            onOk() {
                handleOk()
                form.resetFields();
            },
            onCancel() {
            },
            })

        }
        //Restringir las horas
        const [form] = Form.useForm();
        function disabledHours() {
            return [0,1, 2, 3,4,5,6,7,21,22,23]; 
          }

        //Obtener datos de la base de datos
        const [data, setData] = useState([]);

        useEffect(() => {
            obtenerDatos();
          }, []);
        
          const obtenerDatos = () => {
            axios.get('http://localhost:8000/api/eventos')
              .then((response) => {
                setData(response.data);
              })
              .catch((error) => {
                console.error(error);
              });
          };

        //Eliminar evento
        function eliminarEvento(key) {
          axios.delete(`http://localhost:8000/api/evento/${key}`)
              .then(response => {
                obtenerDatos()
              })
              .catch(error => {
                 console.log(error)
              });
        }

          const showDelete = (record) => {
            confirm({
            title: '¿Desea eliminar el evento?',
            icon: <ExclamationCircleFilled />,
            content: 'Se eliminará el evento',
            okText: "Si",
            cancelText: "No",
            centered: 'true',
            
            onOk() {
                handleOk()
                console.log("dato: "+ record)
                eliminarEvento(record)
            },
            onCancel() {
            },
            })
        }
        //Guardar evento
        const onFinish = (values) => {
          console.log('Valores del formulario:', values);
      
          // Realiza la solicitud POST con Axios para guardar los datos en el servidor
          axios.post('ttp://localhost:8000/api/evento', values)
            .then((response) => {
              console.log('Datos guardados con éxito', response.data);
              // Realiza acciones adicionales después de guardar los datos
            })
            .catch((error) => {
              console.error('Error al guardar los datos', error);
              // Maneja errores si es necesario
            });
        };

    return(
        <div className='pagina-evento'>
            <Button className='boton-crear-evento' onClick={showModal}>Crear evento</Button>

            <Modal  title="Registro de evento" 
                    className='modal-evento'
                    open={isModalOpen} 
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
                        form={form}
                        >
                    <Form.Item label="T&iacute;tulo"
                                name="TUTULO"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Por favor ingrese un título',
                                    },
                                  ]}>
                        <Input placeholder='Ingrese el titulo del evento'></Input>
                    </Form.Item>

                    <Form.Item label="Tipo"
                                name="TIPO_EVENTO"
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
                                    name="FECHA"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Por favor ingrese una fecha',
                                        },
                                    ]}>
                            <DatePicker style={{width: '175px'}} placeholder="Selecciona una fecha"/>
                        </Form.Item>

                        <Form.Item  label="Hora"
                                    name="HORA"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Por favor ingrese una hora',
                                        },
                                    ]}> 
                            <TimePicker style={{width: '175px'}} 
                                        placeholder='Seleccione una hora' 
                                        format="HH:mm"
                                        disabledHours={disabledHours}
                                        showNow={false}/>
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
                        <Input placeholder='Ingrese el nombre del organizador'></Input>
                    </Form.Item>

                    <Form.Item label="Patrocinador"
                                name="patrocinador">
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
                    dataSource={data}
                    pagination={false}
                    locale={{
                        emptyText: (
                          <div style={{ padding: '70px', textAlign: 'center' }}>
                            No hay datos disponibles.
                          </div>
                        ),
                    }}
                     
            >
                <Column title="T&iacute;tulo" dataIndex="TITULO" key="titulo"/>
                <Column title="Tipo" dataIndex="TIPO_EVENTO" key="titulo"/>
                <Column title="Estado"   dataIndex="ESTADO" key="estado"/>
                <Column title="Fecha"  dataIndex="FECHA" key="estado"/>
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
                        <Button type='link' onClick={() => showDelete(record.id)} >
                            <DeleteOutlined  style={{  fontSize: '25px', color: '#E51919'}} />
                        </Button >
                            
                    </Space>
                )}/>
                  
            </Table>
        </div>
    )
}
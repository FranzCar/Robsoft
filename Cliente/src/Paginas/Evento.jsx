import '../App.css'
import { Button, Table, Space, Modal, Form, Input,
         Select, DatePicker,TimePicker, Upload, message } from 'antd'
import React, { useState, useEffect } from 'react';
import {    DeleteOutlined,
            EditOutlined,
            PlusOutlined,
            ExclamationCircleFilled,
            InfoCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios'

    const { TextArea } = Input;
    const { confirm } = Modal;
    const { Column } = Table;
    
    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
    const getBase64d = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    const onFinishFailed = (errorInfo) => {
       console.log('Failed:', errorInfo);
    };

    
      
export default function Evento() {

        const [form] = Form.useForm();
        const [visible, setVisible] = useState(false);

        const showModal = () => {
          setVisible(true);
        };
        const handleOk = () => {
          setVisible(false);
          form.submit();
        };
        const handleCancel = () => {
          setVisible(false);
        };

        const [info, setInfo] = useState(null);

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
        const showConfirm = (values) => {
            confirm({
            title: '¿Esta seguro de guardar este evento?',
            icon: <ExclamationCircleFilled />,
            content: '',
            okText: "Si",
            cancelText: "No",
            centered: 'true',
            
            onOk() {
                confirmSave(values)
                setVisible(false);
                form.resetFields();
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
          showConfirm(values)
        };
        const validarTipo =  (tipo) => {
          if(tipo === '1')
            return "Estilo ICPC"
          if (tipo === '2')
            return "Estilo Libre"
          if (tipo === '3')
            return "Taller de programación"
          if (tipo === '4')
            return "Sesión de reclutamiento"
          if (tipo === '5')
            return "Torneos de programación"
          if (tipo === '6')
            return "Entrenamientos"
          if (tipo === '7')
            return "Otros"

        }

        
        const datosEvento = (values) => {
          const fecha = values.FECHA
          const NUEVAFECHA = fecha.format('YYYY-MM-DD');
          const hora = values.HORA
          const NUEVAHORA = hora.format('HH:mm:ss');
          const TIPO = validarTipo (values.TIPO_EVENTO)
          const datos = {
            TITULO: values.TITULO,
            TIPO_EVENTO:TIPO ,
            FECHA: NUEVAFECHA,
            HORA:NUEVAHORA,
            UBICACION: values.UBICACION,
            DESCRIPCION: values.DESCRIPCION,
            ORGANIZADOR: values.ORGANIZADOR,
            PATROCINADOR: values.PATROCINADOR,
            AFICHE: fileList[0].thumbUrl,
          }
          return datos
        }

        const validarCampos = (error) => {
          console.log("Error validarcampo ", error)
          if(error === "El campo t i t u l o debe tener al menos 5 caracteres."){
            console.log("validar campo titulo")
          }
          
        }

        const validarTitulo = (rule, value, callback) => {
          if (value && value.length < 5) {
            callback('El campo debe tener al menos 5 caracteres.');
          } else {
            callback();
          }
        }

        const confirmSave = (values) => {
          const datos = datosEvento(values)

          console.log("Los nuevos datos son :", datos)
          // Realizar la solicitud POST con Axios para guardar los datos en el servidor
          axios.post('http://localhost:8000/api/evento',datos)
          .then((response) => {
              console.log('Datos guardados con éxito', response.data);
              obtenerDatos();
              message.success('El evento se registró correctamente');
          })
          .catch((error) => {
              if (error.response) {
                  // El servidor respondió con un código de estado fuera del rango 2xx
                  const errores = error.response.data.errors;
                  for (let campo in errores) {
                      message.error(errores[campo][0]); // Mostramos solo el primer mensaje de error de cada campo
                      validarCampos(errores[campo][0])
                  }
              } else {
                  // Otros errores (problemas de red, etc.)
                  message.error('Ocurrió un error al guardar los datos.');
          }
        });
        };
        

        //Ver mas informacion de un evento
        const [componentDisabled, setComponentDisabled] = useState(true);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const showModalInfo = () => {
          setIsModalOpen(true);
        };
        const handleOkInfo = () => {
          setIsModalOpen(false);
        };
        const handleCancelInfo = () => {
          setIsModalOpen(false);
        };
        const [show] = Form.useForm();
        function showInfo(key) {
          axios.get(`http://localhost:8000/api/evento/${key}`)
              .then(response => {
                setInfo(response.data)
                showModalInfo()
                console.log("Informacion obtenida de show ",info)
              })
              .catch(error => {
                 console.log(error)
              });
        }

        const cerrarInfor = () => {
          setIsModalOpen(false)
          show.resetFields()
        }

    return(
        <div className='pagina-evento'>
            <Button className='boton-crear-evento' onClick={showModal}>Crear evento</Button>

            <Modal  title="Registro de evento" 
                    className='modal-evento'
                    open={visible} 
                    okText= "Guardar"
                    cancelText= "Cancelar"
                    onCancel={handleCancel}
                    footer={[
                        <Form form={form} onFinish={onFinish}>
                            <Button onClick={showCancel} className='boton-cancelar-evento'>Cancelar</Button>
                            <Button htmlType="submit" type='primary' className='boton-guardar-evento' >Guardar</Button>
                        </Form>
                    ]}
            >
                <Form   layout='vertical'
                        className='form-evento'
                        name='formulario_evento'
                        autoComplete="off"  
                        onFinishFailed={onFinishFailed} 
                        form={form}
                        >
                    <Form.Item label="T&iacute;tulo"
                                name="TITULO"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Por favor ingrese un título',
                                    },
                                    { validator: validarTitulo }
                                  ]}
                                  >
                        <Input placeholder='Ingrese el titulo del evento'></Input>
                    </Form.Item>

                    <Form.Item  label="Tipo"
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
                                name="UBICACION"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Por favor ingrese una ubicación',
                                    },
                                ]}>
                        <Input placeholder='Ingrese la ubicación del evento'></Input>
                    </Form.Item>

                    <Form.Item label="Descripci&oacute;n"
                                name="DESCRIPCION"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Por favor ingrese una descripción del evento',
                                    },
                                ]}>
                        <TextArea />
                    </Form.Item>

                    <Form.Item label="Organizador"
                                name="ORGANIZADOR"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Por favor ingrese un organizador',
                                    },
                                ]}>
                        <Input placeholder='Ingrese el nombre del organizador'></Input>
                    </Form.Item>

                    <Form.Item label="Patrocinador"
                                name="PATROCINADOR">
                        <Input placeholder='Ingrese el nombre del patrocinador'></Input>
                    </Form.Item>

                    <Form.Item label="Afiche del evento" name="AFICHE">
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
                        {/* Boton para eliminar */}
                        <Button type='link' onClick={() => showInfo(record.id)} >
                            <InfoCircleOutlined style={{  fontSize: '25px', color: '#107710'}} />
                        </Button >
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

            <Modal  title="Basic Modal" 
                    open={isModalOpen} 
                    onOk={handleOkInfo} 
                    onCancel={handleCancelInfo}
                    footer={[
                      <Form >
                          <Button onClick={cerrarInfor} className='boton-cancelar-evento'>Cerrar</Button>
                      </Form>
                  ]}
                    >
                <Form   layout='vertical'
                        className='form-show'
                        name='formulario_informacion'
                        autoComplete="off" 
                        form={show} 
                        initialValues={info}
                        disabled={componentDisabled}>
                  <Form.Item  label="Titulo"
                              name="TITULO"
                              >
                    <Input ></Input>
                  </Form.Item>
                </Form>
                      
              </Modal>
        </div>
    )
}
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, Select, notification, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const TableProducts = () => {
  const [data, setData] = useState([]); // State for products
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [editingProduct, setEditingProduct] = useState(null); // State for editing a product
  const [usuarios, setUsuarios] = useState([]); // State for users
  const [formLoading, setFormLoading] = useState(false); // Form submission loading state

  useEffect(() => {
    fetchProducts();
    fetchUsers(); // Fetch users
  }, []);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4001/productos");
      setData(response.data.data);
    } catch (error) {
      notification.error({ message: "Error fetching products", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/user", {
        headers: {
          params: JSON.stringify({ page: 1, limit: 10 }) // Ejemplo de parámetros
        }
      });
      console.log("Usuarios obtenidos:", response.data.data);
      setUsuarios(response.data.data);
      
    } catch (error) {
      notification.error({ message: "Error fetching users", description: error.message });
    }
  };

  const createProduct = async (values) => {
    setFormLoading(true);
    try {
      await axios.post("http://localhost:4001/productos", values);
      notification.success({ message: "Product created successfully" });
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      notification.error({ message: "Error creating product", description: error.response?.data?.message || error.message });
    } finally {
      setFormLoading(false);
    }
  };

  const updateProduct = async (values) => {
    setFormLoading(true);
    try {
      await axios.patch(`http://localhost:4001/productos/${editingProduct._id}`, values);
      notification.success({ message: "Product updated successfully" });
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      notification.error({ message: "Error updating product", description: error.response?.data?.message || error.message });
    } finally {
      setFormLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:4001/productos/${productId}`);
      notification.success({ message: "Product deleted successfully" });
      fetchProducts();
    } catch (error) {
      notification.error({ message: "Error deleting product" });
    }
  };

  const showModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const columns = [
    {
      title: "Producto",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      render: (usuario) => `${usuario.firtname} ${usuario.lastname}`, // Corregido 'firtname' a 'firstname'
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, product) => (
        <>
          <Button type="link" onClick={() => showModal(product)}>Editar</Button>
          <Popconfirm title="¿Seguro que deseas eliminar?" onConfirm={() => deleteProduct(product._id)}>
            <Button type="link" danger>Eliminar</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleOk = (values) => {
    // Encuentra al usuario seleccionado en la lista de usuarios obtenidos
    const selectedUser = usuarios.find(user => user._id === values.usuario);
    
    if (!selectedUser) {
      notification.error({ message: 'Error', description: 'Usuario no encontrado' });
      return;
    }
    
    // Crea un objeto con todos los valores requeridos por el esquema del producto
    const updatedValues = {
      nombre: values.nombre,
      precio: parseFloat(values.precio), // Convertir precio a número si es necesario
      stock: parseInt(values.stock),     // Convertir stock a número si es necesario
      usuario: selectedUser._id          // Aquí enviamos el ID del usuario, no el email ni el objeto completo
    };
    
    console.log("Valores enviados al backend:", updatedValues);
    
    if (editingProduct) {
      updateProduct(updatedValues); // Llamar a la función para actualizar el producto
    } else {
      createProduct(updatedValues); // Llamar a la función para crear un nuevo producto
    }
  };
  
  
  
  
  
  
  
  

  
  

  return (
    <>
      <Button type="primary" onClick={() => showModal()}>Crear Producto</Button>
      
      {/* Loading Spinner */}
      {loading ? (
        <Spin />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="_id" />
      )}

      <Modal
        title={editingProduct ? "Editar Producto" : "Crear Producto"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={editingProduct || { nombre: "", precio: "", stock: "", usuario: "" }}
          onFinish={handleOk}
        >
          <Form.Item
            label="Nombre del Producto"
            name="nombre"
            rules={[{ required: true, message: "Por favor ingresa el nombre del producto" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="precio"
            rules={[{ required: true, message: "Por favor ingresa el precio" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Por favor ingresa el Stock" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Usuario"
            name="usuario"
            rules={[{ required: true, message: "Por favor selecciona un usuario" }]}
          >
            <Select>
              {usuarios.map((usuario) => (
                <Option key={usuario._id} value={usuario._id}>
                  {usuario.firtname} {usuario.lastname} {/* Corregido 'firtname' a 'firstname' */}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={formLoading}>
              {editingProduct ? "Actualizar" : "Crear"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableProducts;

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, notification, Spin } from "antd";
import axios from "axios";

const UserManagement = () => {
  const [data, setData] = useState([]); // State for users
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [editingUser, setEditingUser] = useState(null); // State for editing a user
  const [formLoading, setFormLoading] = useState(false); // Form submission loading state

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://backend-fs-phi.vercel.app/api/user", {
        headers: {
          params: JSON.stringify({ page: 1, limit: 10 })
        }
      });
      console.log("Usuarios obtenidos:", response.data.data);
      setData(response.data.data);
    } catch (error) {
      notification.error({ message: "Error fetching users", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (values) => {
    setFormLoading(true);
    try {
      await axios.post("https://backend-fs-phi.vercel.app/api/user", values);
      notification.success({ message: "User created successfully" });
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      notification.error({ message: "Error creating user", description: error.response?.data?.message || error.message });
    } finally {
      setFormLoading(false);
    }
  };

  const updateUser = async (values) => {
    setFormLoading(true);
    try {
      await axios.put(`https://backend-fs-phi.vercel.app/api/user/${editingUser._id}`, values);
      notification.success({ message: "User updated successfully" });
      fetchUsers();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      notification.error({ message: "Error updating user", description: error.response?.data?.message || error.message });
    } finally {
      setFormLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://backend-fs-phi.vercel.app/api/user/${userId}`);
      notification.success({ message: "User deleted successfully" });
      fetchUsers();
    } catch (error) {
      notification.error({ message: "Error deleting user", description: error.message });
    }
  };

  const showModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleOk = (values) => {
    if (editingUser) {
      updateUser(values); // Update user
    } else {
      createUser(values); // Create user
    }
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "firtname",
      key: "firtname",
    },
    {
      title: "Apellido",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "rol",
      key: "rol",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, user) => (
        <>
          <Button type="link" onClick={() => showModal(user)}>Editar</Button>
          <Popconfirm title="¿Seguro que deseas eliminar?" onConfirm={() => deleteUser(user._id)}>
            <Button type="link" danger>Eliminar</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => showModal()}>Crear Usuario</Button>
      
      {/* Loading Spinner */}
      {loading ? (
        <Spin />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="_id" />
      )}

      <Modal
        title={editingUser ? "Editar Usuario" : "Crear Usuario"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={editingUser || { firtname: "", lastname: "", email: "", rol: "" }}
          onFinish={handleOk}
        >
          <Form.Item
            label="Nombre"
            name="firtname"
            rules={[{ required: true, message: "Por favor ingresa el nombre del usuario" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Apellido"
            name="lastname"
            rules={[{ required: true, message: "Por favor ingresa el apellido del usuario" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Por favor ingresa el email del usuario" }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Rol"
            name="rol"
            rules={[{ required: true, message: "Por favor ingresa el rol del usuario" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={formLoading}>
              {editingUser ? "Actualizar" : "Crear"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;

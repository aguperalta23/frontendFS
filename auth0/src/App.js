import { useAuth0 } from "@auth0/auth0-react";
import Style from "./App.module.css";
import React, { useState } from "react";
import TableProducts from "./components/tableProducts";
import UserManagement from "./components/tableUsers";
import { Button, Card, Space } from "antd";

function App() {
  // Obtener las funciones y estados de Auth0
  const { user, logout, loginWithRedirect, isAuthenticated } = useAuth0();
  const [showTable, setShowTable] = useState(false); // Estado para controlar la visibilidad de la tabla de productos
  const [showUserTable, setShowUserTable] = useState(false); // Estado para controlar la visibilidad de la tabla de usuarios

  // Si el usuario no está autenticado, mostrar el botón de login
  if (!isAuthenticated) {
    return (
      <div className={Style.Container}>
        <button className={Style.BotonLogin} onClick={() => loginWithRedirect()}>
          Log in
        </button>
      </div>
    );
  }

  // Función para alternar la visibilidad de la tabla de productos
  const toggleProductTable = () => {
    setShowTable(!showTable);
  };

  // Función para alternar la visibilidad de la tabla de usuarios
  const toggleUserTable = () => {
    setShowUserTable(!showUserTable);
  };

  // Si el usuario está autenticado, mostrar la información del usuario y las tablas si están activas
  return (
    <>
      <div className={Style.Container}>
        <button className={Style.BotonLogout} onClick={() => logout()}>
          Log out
        </button>
      </div>

      {isAuthenticated && (
        <div className={Style.Container}>
          <Card
            style={{ maxWidth: 600, margin: "20px auto", textAlign: "center" }}
            cover={
              <img
                src={user.picture}
                alt={user.name}
                style={{ borderRadius: '50%', width: '150px', margin: '20px auto' }}
              />
            }
          >
            <h2>{user.name}</h2>
            <p>{user.email}</p>

            <Space direction="vertical" style={{ width: '100%' }}>
              {/* Botón para mostrar/ocultar la tabla de productos */}
              <Button type="primary" onClick={toggleProductTable} block>
                {showTable ? "Ocultar Tabla de Productos" : "Mostrar Tabla de Productos"}
              </Button>

              {/* Mostrar la tabla de productos si `showTable` es true */}
              {showTable && (
                <Card style={{ marginTop: 20 }}>
                  <TableProducts />
                </Card>
              )}

              {/* Botón para mostrar/ocultar la tabla de usuarios */}
              <Button type="primary" onClick={toggleUserTable} block>
                {showUserTable ? "Ocultar Tabla de Usuarios" : "Mostrar Tabla de Usuarios"}
              </Button>

              {/* Mostrar la tabla de usuarios si `showUserTable` es true */}
              {showUserTable && (
                <Card style={{ marginTop: 20 }}>
                  <UserManagement />
                </Card>
              )}
            </Space>
          </Card>
        </div>
      )}
    </>
  );
}

export default App;

import { useAuth0 } from "@auth0/auth0-react";
import Style from "./App.module.css";
import React, { useState } from "react";
import TableProducts from "./components/tableProducts";
import { Button, Card, Space } from "antd";

function App() {
  // Obtener las funciones y estados de Auth0
  const { user, logout, loginWithRedirect, isAuthenticated } = useAuth0();
  const [showTable, setShowTable] = useState(false); // Estado para controlar la visibilidad de la tabla

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

  // Función para alternar la visibilidad de la tabla
  const toggleTable = () => {
    setShowTable(!showTable);
  };

  // Si el usuario está autenticado, mostrar la información del usuario y la tabla si está activa
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
            cover={<img src={user.picture} alt={user.name} style={{ borderRadius: '50%', width: '150px', margin: '20px auto' }} />}
          >
            <h2>{user.name}</h2>
            <p>{user.email}</p>

            <Space direction="vertical" style={{ width: '100%' }}>
              {/* Botón para mostrar/ocultar la tabla de productos */}
              <Button type="primary" onClick={toggleTable} block>
                {showTable ? "Ocultar Tabla de Productos" : "Mostrar Tabla de Productos"}
              </Button>

              {/* Mostrar la tabla de productos si `showTable` es true */}
              {showTable && (
                <Card style={{ marginTop: 20 }}>
                  <TableProducts />
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

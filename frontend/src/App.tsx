import { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './App.css';

// Definimos qué forma tiene un Equipo
interface Equipo {
  id: number;
  descripcion: string;
  estado: string;
}

interface Usuario {
  name: string;
  email: string;
  picture: string;
}

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]); // <--- Lista vacía al principio

  // --- 1. LÓGICA DE LOGIN ---
  const handleLoginSuccess = async (response: any) => {
    if (response.credential) {
      try {
        const decoded: any = jwtDecode(response.credential);
        
        // Login contra el backend
        const res = await axios.post('http://localhost:3000/auth/login', {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        });

        // Guardamos usuario
        setUsuario({
          name: res.data.usuario.nombre,
          email: res.data.usuario.email,
          picture: res.data.usuario.foto
        });

      } catch (error: any) {
        console.error("Error login:", error);
        alert("Acceso denegado o error de conexión.");
        googleLogout();
      }
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUsuario(null);
    setEquipos([]); // Limpiamos la lista al salir
  };

  // --- 2. EFECTO PARA CARGAR DATOS (NUEVO) ---
  useEffect(() => {
    // Solo cargamos datos si hay un usuario logueado
    if (usuario) {
      console.log("📥 Cargando inventario...");
      axios.get('http://localhost:3000/equipos')
        .then((respuesta) => {
          console.log("📦 Datos recibidos:", respuesta.data);
          setEquipos(respuesta.data);
        })
        .catch((error) => {
          console.error("❌ Error cargando equipos:", error);
        });
    }
  }, [usuario]); // Se ejecuta cada vez que cambia 'usuario'

  // --- 3. PANTALLA DE LOGIN (Si no estás dentro) ---
  if (!usuario) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <h1>Gestión de Inventario</h1>
        <p>IES Félix de Azara</p>
        <div style={{ marginTop: '20px' }}>
          <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
        </div>
      </div>
    );
  }

  // --- 4. PANTALLA PRINCIPAL (Si ya estás dentro) ---
  return (
    <div style={{ padding: '20px' }}>
      {/* Cabecera con datos del usuario */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={usuario.picture} alt="Foto" style={{ borderRadius: '50%', width: '40px' }} />
          <span>Hola, <b>{usuario.name}</b></span>
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </header>

      <h2>Inventario de Equipos</h2>

      {/* Tabla de datos */}
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Descripción</th>
            <th style={{ padding: '10px' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {equipos.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                No hay equipos registrados o cargando...
              </td>
            </tr>
          ) : (
            equipos.map((equipo) => (
              <tr key={equipo.id}>
                <td style={{ padding: '10px', textAlign: 'center' }}>{equipo.id}</td>
                <td style={{ padding: '10px' }}>{equipo.descripcion}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        backgroundColor: equipo.estado === 'disponible' ? '#d4edda' : '#f8d7da',
                        color: equipo.estado === 'disponible' ? '#155724' : '#721c24'
                    }}>
                        {equipo.estado}
                    </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
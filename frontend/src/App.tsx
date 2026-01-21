import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Quitamos 'Link' porque ya no se usa aquí
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './App.css';

// Componentes
import MenuPrincipal from './components/MenuPrincipal';
import PrestamoEquipo from './components/PrestamoEquipo';
import DevolucionEquipo from './components/DevolucionEquipo';
import HistoricoPrestamos from './components/HistoricoPrestamos';
import ListaEquipos from './components/ListaEquipos'; // <--- Importamos el archivo nuevo

// Mantenemos la interfaz aquí también para el estado 'equipos'
interface Equipo {
  id: number;
  n_ordenador: number | null;
  n_serie: string;
  situacion: string;
  representante: string;
  estado: string;
  observaciones: string;
  f_prestamo: string;
}

function App() {
  const [usuario, setUsuario] = useState<any>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  const fetchEquipos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/equipos');
      setEquipos(res.data);
    } catch (error) { console.error("Error cargando equipos:", error); }
  };

  useEffect(() => {
    if (usuario) fetchEquipos();
  }, [usuario]);

  const handleLogin = (credentialResponse: any) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUsuario(decoded);
  };

  const handleLogout = () => {
    googleLogout();
    setUsuario(null);
    setEquipos([]);
  };

  return (
    <div className="container">
      <header className="header-main">
        <h1>SIGFA - Inventario</h1>
        {usuario && (
          <div className="header-actions">
            <span className="user-name" style={{ marginRight: '10px' }}>Hola, {usuario.name}</span>
            <button onClick={handleLogout} className="logout-btn">Salir</button>
          </div>
        )}
      </header>

      {!usuario ? (
        <div className="login-box">
          <GoogleLogin onSuccess={handleLogin} />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/equipos" element={<ListaEquipos equipos={equipos} fetchEquipos={fetchEquipos} />} />
          <Route path="/prestar" element={<PrestamoEquipo/>} />
          <Route path="/devolver" element={<DevolucionEquipo />} />
          <Route path="/historico" element={<HistoricoPrestamos />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
import { Link } from 'react-router-dom';

function MenuPrincipal() {
  return (
    <div className="menu-container">
      <h2>Panel de Gestión</h2>
      {/* AQUI ESTÁ LA CLAVE: className="menu-grid" */}
      <div className="menu-grid"> 
        <Link to="/prestar" className="menu-card">
          <span className="icon">📤</span>
          <h3>Prestar Equipo</h3>
        </Link>
        
        <Link to="/devolver" className="menu-card">
          <span className="icon">📥</span>
          <h3>Devolver Equipo</h3>
        </Link>

        <Link to="/equipos" className="menu-card">
          <span className="icon">💻</span>
          <h3>Inventario</h3>
        </Link>

        <Link to="/historico" className="menu-card">
          <span className="icon">📜</span>
          <h3>Histórico</h3>
        </Link>
      </div>
    </div>
  );
}

export default MenuPrincipal;
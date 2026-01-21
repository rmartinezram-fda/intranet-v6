import { useNavigate } from 'react-router-dom';

const MenuPrincipal = () => {
  const navigate = useNavigate();

  const opciones = [
    { titulo: 'Consultar Equipos', desc: 'Ver inventario completo.', ruta: '/equipos', color: '#2563eb' },
    { titulo: 'Prestar Equipo', desc: 'Asignar equipo a alguien.', ruta: '/prestar', color: '#16a34a' },
    { titulo: 'Devolver Equipo', desc: 'Registrar devolución.', ruta: '/devolver', color: '#ea580c' },
    { titulo: 'Histórico', desc: 'Ver registros pasados.', ruta: '/historico', color: '#6b7280'}
  ];

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '30px' }}>Panel de Control SIGFA</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {opciones.map((opc) => (
          <div 
            key={opc.ruta}
            onClick={() => navigate(opc.ruta)}
            style={{ 
              backgroundColor: opc.color, color: 'white', padding: '30px', 
              borderRadius: '12px', cursor: 'pointer', transition: '0.3s' 
            }}
          >
            <h3>{opc.titulo}</h3>
            <p>{opc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPrincipal;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HistoricoPrestamos = () => {
  const [historico, setHistorico] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/equipos/historico')
      .then(res => setHistorico(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="table-container" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/" className="back-btn" style={{ textDecoration: 'none', backgroundColor: '#666', color: 'white', padding: '8px 15px', borderRadius: '5px' }}>⬅ Volver</Link>
        <h2 style={{ margin: 0 }}>Histórico de Movimientos</h2>
      </div>

      <table className="inventory-table">
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>Equipo (Nº Ord)</th>
            <th>Representante</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Observaciones Finales</th>
          </tr>
        </thead>
        <tbody>
  {historico.map((h) => (
   <tr key={h.id_prestamo}>
  <td>{h.equipo?.n_ordenador}</td>
  {/* Ahora leemos directamente h.representante del histórico */}
  <td>{h.representante || 'Sin nombre'}</td> 
  <td>{h.fecha_inicio ? new Date(h.fecha_inicio).toLocaleDateString() : '-'}</td>
  <td>{h.fecha_devolucion ? new Date(h.fecha_devolucion).toLocaleDateString() : 'En curso'}</td>
  <td>{h.observaciones}</td>
</tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default HistoricoPrestamos;
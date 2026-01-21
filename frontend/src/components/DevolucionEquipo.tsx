import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const DevolucionEquipo = () => {
  const navigate = useNavigate();
  const [prestados, setPrestados] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/equipos')
      .then(res => setPrestados(res.data.filter((e: any) => e.estado === 'Prestado')));
  }, []);

  const handleDevolver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3000/equipos/${seleccionado}/devolver`, { f_devolucion: fecha, observaciones_finales: notas });
      alert('Devolución registrada');
      navigate('/');
    } catch (error) { alert('Error en devolución'); }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <Link to="/">⬅ Volver</Link>
      <h3>Registrar Devolución</h3>
      <form onSubmit={handleDevolver} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <select required value={seleccionado} onChange={e => setSeleccionado(e.target.value)}>
          <option value="">Seleccione equipo...</option>
          {prestados.map(eq => <option key={eq.id} value={eq.id}>{eq.n_ordenador} ({eq.representante})</option>)}
        </select>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        <textarea placeholder="Observaciones finales" onChange={e => setNotas(e.target.value)} />
        <button type="submit" style={{ backgroundColor: '#ea580c', color: 'white', padding: '10px' }}>Confirmar Devolución</button>
      </form>
    </div>
  );
};

export default DevolucionEquipo;
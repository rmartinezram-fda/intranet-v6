import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const PrestamoEquipo = () => {
  const navigate = useNavigate();
  const [equiposLibres, setEquiposLibres] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: '', representante: '', situacion: '', f_prestamo: new Date().toISOString().split('T')[0], observaciones: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/equipos')
      .then(res => setEquiposLibres(res.data.filter((e: any) => e.estado !== 'Prestado')));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3000/equipos/${formData.id}/prestar`, formData);
      alert('Prestado con éxito');
      navigate('/');
    } catch (error) { alert('Error al prestar'); }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <Link to="/">⬅ Volver</Link>
      <h3>Asignar Préstamo</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <select required onChange={e => setFormData({...formData, id: e.target.value})}>
          <option value="">Seleccione ordenador...</option>
          {equiposLibres.map(eq => <option key={eq.id} value={eq.id}>{eq.n_ordenador} - {eq.n_serie}</option>)}
        </select>
        <input placeholder="Representante" required onChange={e => setFormData({...formData, representante: e.target.value})} />
        <input placeholder="Situación" onChange={e => setFormData({...formData, situacion: e.target.value})} />
        <input type="date" value={formData.f_prestamo} onChange={e => setFormData({...formData, f_prestamo: e.target.value})} />
        <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', padding: '10px' }}>Confirmar Préstamo</button>
      </form>
    </div>
  );
};

export default PrestamoEquipo;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

// 1. Definimos la interfaz aquí para que este archivo sepa qué es un Equipo
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

interface ListaEquiposProps {
  equipos: Equipo[];
  fetchEquipos: () => void;
}

// 2. Añadimos 'export default' para solucionar el error de "no default export"
export default function ListaEquipos({ equipos, fetchEquipos }: ListaEquiposProps) {
  const [filtros, setFiltros] = useState({
    n_ordenador: '', situacion: '', n_serie: '', representante: '', estado: '', observaciones: ''
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [datosEditados, setDatosEditados] = useState<Partial<Equipo>>({});
  const [creandoNuevo, setCreandoNuevo] = useState(false);

  const equiposFiltrados = equipos.filter((e) => {
    const s = (val: any, f: string) => (val?.toString() || '').toLowerCase().includes(f.toLowerCase());
    return s(e.n_ordenador, filtros.n_ordenador) && s(e.situacion, filtros.situacion) && s(e.n_serie, filtros.n_serie) &&
           s(e.representante, filtros.representante) && s(e.estado, filtros.estado) && s(e.observaciones, filtros.observaciones);
  });

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(equiposFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    XLSX.writeFile(wb, "Inventario_SIGFA.xlsx");
  };

  const iniciarNuevo = () => {
    setCreandoNuevo(true);
    setEditandoId(null);
    setDatosEditados({ n_ordenador: undefined, situacion: '', n_serie: '', representante: '', estado: 'disponible', observaciones: '', f_prestamo: '' });
  };

  const guardarNuevo = async () => {
    try {
      await axios.post('http://localhost:3000/equipos', datosEditados);
      setCreandoNuevo(false);
      fetchEquipos();
    } catch (error) { alert("Error al crear"); }
  };

  const guardarCambios = async (id: number) => {
    try {
      await axios.patch(`http://localhost:3000/equipos/${id}`, datosEditados);
      setEditandoId(null);
      fetchEquipos();
    } catch (error) { alert("Error al guardar"); }
  };

  const eliminarEquipo = async (id: number) => {
    if (window.confirm("¿Eliminar?")) {
      try { await axios.delete(`http://localhost:3000/equipos/${id}`); fetchEquipos(); }
      catch (e) { alert("Error al eliminar"); }
    }
  };

  return (
    <div className="table-container">
      <div className="header-actions" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Link to="/" className="back-btn" style={{ textDecoration: 'none', backgroundColor: '#666', color: 'white', padding: '8px 15px', borderRadius: '5px' }}>⬅ Volver</Link>
        <button onClick={iniciarNuevo} className="add-btn">+ Nuevo Equipo</button>
        <button onClick={exportarExcel} className="export-btn">📊 Excel</button>
      </div>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Nº Ord.</th><th>Ubicación</th><th>Nº Serie</th><th>Responsable</th><th>Estado</th><th>Acciones</th>
          </tr>
          <tr className="filter-row">
            <td><input value={filtros.n_ordenador} onChange={(e) => setFiltros({ ...filtros, n_ordenador: e.target.value })} /></td>
            <td><input value={filtros.situacion} onChange={(e) => setFiltros({ ...filtros, situacion: e.target.value })} /></td>
            <td><input value={filtros.n_serie} onChange={(e) => setFiltros({ ...filtros, n_serie: e.target.value })} /></td>
            <td><input value={filtros.representante} onChange={(e) => setFiltros({ ...filtros, representante: e.target.value })} /></td>
            <td><input value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })} /></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {creandoNuevo && (
            <tr className="new-row-highlight">
              <td><input type="number" onChange={(e) => setDatosEditados({ ...datosEditados, n_ordenador: Number(e.target.value) })} /></td>
              <td><input onChange={(e) => setDatosEditados({ ...datosEditados, situacion: e.target.value })} /></td>
              <td><input onChange={(e) => setDatosEditados({ ...datosEditados, n_serie: e.target.value })} /></td>
              <td><input onChange={(e) => setDatosEditados({ ...datosEditados, representante: e.target.value })} /></td>
              <td>
                <select onChange={(e) => setDatosEditados({ ...datosEditados, estado: e.target.value })}>
                  <option value="disponible">disponible</option>
                  <option value="prestado">prestado</option>
                  <option value="estropeado">estropeado</option>
                </select>
              </td>
              <td><button onClick={guardarNuevo}>💾</button><button onClick={() => setCreandoNuevo(false)}>❌</button></td>
            </tr>
          )}
          {equiposFiltrados.map((equipo) => (
            <tr key={equipo.id}>
              {editandoId === equipo.id ? (
                <>
                  <td><input type="number" value={datosEditados.n_ordenador || ''} onChange={(e) => setDatosEditados({ ...datosEditados, n_ordenador: Number(e.target.value) })} /></td>
                  <td><input value={datosEditados.situacion} onChange={(e) => setDatosEditados({ ...datosEditados, situacion: e.target.value })} /></td>
                  <td><input value={datosEditados.n_serie} onChange={(e) => setDatosEditados({ ...datosEditados, n_serie: e.target.value })} /></td>
                  <td><input value={datosEditados.representante} onChange={(e) => setDatosEditados({ ...datosEditados, representante: e.target.value })} /></td>
                  <td>
                    <select value={datosEditados.estado} onChange={(e) => setDatosEditados({ ...datosEditados, estado: e.target.value })}>
                      <option value="disponible">disponible</option>
                      <option value="prestado">prestado</option>
                      <option value="estropeado">estropeado</option>
                    </select>
                  </td>
                  <td><button onClick={() => guardarCambios(equipo.id)}>✅</button></td>
                </>
              ) : (
                <>
                  <td>{equipo.n_ordenador}</td><td className="bold">{equipo.situacion}</td><td className="serial-text">{equipo.n_serie}</td>
                  <td>{equipo.representante}</td><td><span className={`badge ${equipo.estado}`}>{equipo.estado}</span></td>
                  <td>
                    <button onClick={() => { setEditandoId(equipo.id); setDatosEditados(equipo); }}>✏️</button>
                    <button onClick={() => eliminarEquipo(equipo.id)} className="delete-btn">🗑️</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
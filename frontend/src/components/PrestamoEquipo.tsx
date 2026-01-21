import { useState } from 'react';
import axios from 'axios';
import { generarAnexoII } from '../utils/pdfGenerator';

export default function PrestamoEquipo() {
  const [nOrdenador, setNOrdenador] = useState('');
  const [equipo, setEquipo] = useState<any>(null);
  
  // Estado para el formulario del PDF
  const [datos, setDatos] = useState({
    representante: '',
    dni: '',
    alumno: '',
    centro: 'IES SIGFA', 
    situacion: '', // Esto será la Dirección
    localidad: 'Zaragoza',
    n_serie: ''
  });

  // --- 1. FUNCIÓN PARA BUSCAR EQUIPO ---
  const buscarEquipo = async () => {
    if (!nOrdenador) return;
    
    try {
      const res = await axios.get(`http://localhost:3000/equipos?n_ordenador=${nOrdenador}`);
      
      if (res.data.length > 0) {
        const equipoEncontrado = res.data[0];

        // BLOQUEO: Si está estropeado
        if (equipoEncontrado.estado === 'estropeado') {
          alert("⛔ ERROR: Este equipo está marcado como ESTROPEADO y no se puede prestar.");
          setEquipo(null);
          return;
        }

        // AVISO: Si ya está prestado
        if (equipoEncontrado.estado === 'prestado') {
          alert("⚠️ ATENCIÓN: Este equipo figura como PRESTADO actualmente.");
        }

        setEquipo(equipoEncontrado);
        
        // Actualizamos el n_serie en los datos del formulario
        setDatos(prev => ({
          ...prev,
          n_serie: equipoEncontrado.n_serie
        }));

      } else {
        alert("Equipo no encontrado");
        setEquipo(null);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al buscar equipo");
    }
  };

  // --- 2. FUNCIÓN "MÁGICA" PARA DATOS ALEATORIOS ---
  const rellenarDatosAleatorios = () => {
    const simulados = [
      { alumno: "Lucía García Pérez", representante: "Antonio García López", situacion: "C/ Mayor 12, 3ºA", localidad: "Zaragoza" },
      { alumno: "Mateo Fernández Ruiz", representante: "Carmen Ruiz Blasco", situacion: "Avda. Madrid 45, 1ºB", localidad: "Huesca" },
      { alumno: "Sofía Martín Gil", representante: "Elena Gil Torres", situacion: "Paseo Independencia 8", localidad: "Zaragoza" },
      { alumno: "Alejandro López Sanz", representante: "Javier López Muro", situacion: "C/ San Vicente 22", localidad: "Teruel" },
      { alumno: "Valentina Royo Ibarra", representante: "Miguel Ángel Royo", situacion: "C/ Alfonso I, 15", localidad: "Zaragoza" }
    ];

    const random = simulados[Math.floor(Math.random() * simulados.length)];

    setDatos(prev => ({
      ...prev,
      alumno: random.alumno,
      representante: random.representante,
      situacion: random.situacion,
      localidad: random.localidad
    }));
  };

  // --- 3. GENERAR PDF ---
  const handleGenerarPDF = () => {
    if (!datos.representante || !datos.alumno) {
      alert("Por favor, rellena los datos del alumno y representante.");
      return;
    }
    generarAnexoII(datos);
  };

  // --- 4. REGISTRAR EL PRÉSTAMO EN LA BBDD ---
  const registrarPrestamo = async () => {
    if (!equipo) return;

    // AQUI ES DONDE SUELE FALLAR SI SE COPIA MAL LAS COMILLAS
    if (!window.confirm(`¿Confirmar préstamo del equipo ${equipo.n_ordenador} a ${datos.alumno}?`)) {
      return;
    }

    try {
      const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      await axios.patch(`http://localhost:3000/equipos/${equipo.id}`, {
        estado: 'prestado',
        representante: `${datos.representante} (Alumno: ${datos.alumno})`,
        f_prestamo: fechaHoy,
        situacion: datos.situacion 
      });

      alert("✅ Préstamo registrado correctamente");
      
      setEquipo(null);
      setNOrdenador('');
      setDatos({
        representante: '', dni: '', alumno: '', centro: 'IES SIGFA', 
        situacion: '', localidad: 'Zaragoza', n_serie: ''
      });

    } catch (error) {
      console.error(error);
      alert("Error al guardar el préstamo");
    }
  };

  return (
    <div className="form-container">
      <h2>Préstamo de Equipos</h2>
      
      {/* SECCIÓN DE BÚSQUEDA */}
      <div className="search-box">
        <input 
          type="number" 
          placeholder="Nº de Ordenador (pegatina)" 
          value={nOrdenador}
          onChange={(e) => setNOrdenador(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscarEquipo()}
        />
        <button onClick={buscarEquipo}>🔍 Buscar</button>
      </div>

      {/* RESULTADO Y FORMULARIO */}
      {equipo && (
        <div className="result-box animate-fade-in">
          <div className="equipo-info">
            <p><strong>Equipo:</strong> {equipo.n_ordenador}</p>
            <p><strong>Serie:</strong> {equipo.n_serie}</p>
            <p><strong>Estado:</strong> <span className={`badge ${equipo.estado}`}>{equipo.estado}</span></p>
          </div>

          <hr />

          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Datos del Solicitante</h3>
              
              <button 
                type="button" 
                onClick={rellenarDatosAleatorios}
                style={{ backgroundColor: '#f0ad4e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🎲 Rellenar Auto
              </button>
            </div>

            <div className="grid-2-col">
              <div>
                <label>Nombre Alumno/a:</label>
                <input 
                  type="text" 
                  value={datos.alumno} 
                  onChange={(e) => setDatos({...datos, alumno: e.target.value})}
                  placeholder="Ej: Lucía García"
                />
              </div>
              <div>
                <label>Centro Educativo:</label>
                <input 
                  type="text" 
                  value={datos.centro} 
                  onChange={(e) => setDatos({...datos, centro: e.target.value})} 
                />
              </div>
            </div>

            <div className="grid-2-col">
              <div>
                <label>Representante Legal:</label>
                <input 
                  type="text" 
                  value={datos.representante} 
                  onChange={(e) => setDatos({...datos, representante: e.target.value})}
                  placeholder="Padre/Madre/Tutor"
                />
              </div>
              <div>
                <label>DNI/NIE:</label>
                <input 
                  type="text" 
                  value={datos.dni} 
                  onChange={(e) => setDatos({...datos, dni: e.target.value})} 
                />
              </div>
            </div>

            <div className="grid-2-col">
              <div>
                <label>Dirección (Domicilio):</label>
                <input 
                  type="text" 
                  value={datos.situacion} 
                  onChange={(e) => setDatos({...datos, situacion: e.target.value})} 
                  placeholder="Calle, número, piso..."
                />
              </div>
              <div>
                <label>Localidad:</label>
                <input 
                  type="text" 
                  value={datos.localidad} 
                  onChange={(e) => setDatos({...datos, localidad: e.target.value})} 
                />
              </div>
            </div>

            <div className="actions">
              <button className="pdf-btn" onClick={handleGenerarPDF}>📄 1. Generar Anexo II</button>
              <button className="save-btn" onClick={registrarPrestamo}>💾 2. Confirmar Préstamo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
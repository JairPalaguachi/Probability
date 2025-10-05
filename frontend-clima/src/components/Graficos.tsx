import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';

export const Graficos = () => {
  const location = useLocation();
  const apiData = location.state?.apiData;
  const originalDate = location.state?.originalDate;
  const originalTime = location.state?.originalTime;

  if (!apiData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No hay datos para mostrar</h2>
        <p>Por favor, realiza una consulta desde la página principal.</p>
        <Link to="/">Volver al Inicio</Link>
      </div>
    );
  }

  const chartData = Object.keys(apiData)
    .filter(key => key !== 'Ubicación')
    .map(key => ({
      name: key.substring(0, key.indexOf(' ')),
      ...apiData[key]
    }));
    
  const handleDownloadCSV = () => {
    if (!apiData?.Ubicación || !originalDate || !originalTime) {
      alert("No se pueden descargar los datos porque falta información de la consulta original.");
      return;
    }
    
    const { Latitud, Longitud } = apiData.Ubicación;
    const url = `http://127.0.0.1:5000/api/clima-historico?lat=${Latitud}&lon=${Longitud}&fecha=${originalDate}&hora=${originalTime}&formato=csv`;
    
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1>Análisis Climático para {apiData.Ubicación.Ciudad}</h1>
          <p>Resumen de datos para la fecha {originalDate}.</p>
          <p><strong>Hora de corte:</strong> {originalTime}</p>
        </div>
        <button 
          onClick={handleDownloadCSV}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginLeft: '20px' }}
        >
          Descargar CSV (Datos Detallados)
        </button>
      </div>
      
      <div style={{ width: '100%', height: 400, marginTop: '40px' }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Mínimo" fill="#8884d8" />
            <Bar dataKey="Promedio" fill="#82ca9d" />
            <Bar dataKey="Máximo" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Link to="/" style={{ marginTop: '30px', display: 'inline-block' }}>
        Hacer otra consulta
      </Link>
    </div>
  );
};
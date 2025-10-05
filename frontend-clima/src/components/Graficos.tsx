import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const apiData = location.state?.apiData;
  const originalDate = location.state?.originalDate;
  const originalTime = location.state?.originalTime;

  if (!apiData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No hay datos para mostrar</h2>
        <p>Por favor, realiza una consulta desde la página principal.</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  
  const chartData = Object.keys(apiData) 
    .filter(key => key !== 'Ubicacion' && key !== 'Probabilidades')
    .map(key => ({
      name: key.substring(0, key.indexOf(' ')),
      ...apiData[key]
    }));
    
  const probabilityData = apiData.Probabilidades 
    ? Object.keys(apiData.Probabilidades).map(key => ({
        name: key,
        Probabilidad: apiData.Probabilidades[key]
      }))
    : [];

  const handleDownloadCSV = () => {
    if (!apiData?.Ubicacion || !originalDate || !originalTime) {
      alert("No se pueden descargar los datos porque falta información de la consulta original.");
      return;
    }
    
    const { Latitud, Longitud } = apiData.Ubicacion;
    const url = `http://127.0.0.1:5000/api/clima-historico?lat=${Latitud}&lon=${Longitud}&fecha=${originalDate}&hora=${originalTime}&formato=csv`;
    
    window.open(url, '_blank');
  };

  return (
    
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1>Análisis Climático para {apiData.Ubicacion.Ciudad}</h1>
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
            <Bar dataKey="Minimo" fill="#8884d8" />
            <Bar dataKey="Promedio" fill="#82ca9d" />
            <Bar dataKey="Maximo" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {probabilityData.length > 0 && (
        <div style={{ marginTop: '60px' }}>
          <h2>Probabilidades de Condiciones Extremas (%)</h2>
          <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
            <ResponsiveContainer>
              <BarChart
                data={probabilityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="Probabilidad" fill="#d946ef" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <button 
        onClick={() => navigate('/')} 
        style={{ marginTop: '30px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Hacer otra consulta
      </button>
    </div>
  );
};
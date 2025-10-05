

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
    .map(key => {

      const name = key.substring(0, key.indexOf(' ')); 
      return {
        name: name, 
        ...apiData[key] 
      };
    });

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Análisis Climático para {apiData.Ubicación.Ciudad}</h1>
      <p>Resumen de datos históricos para la fecha seleccionada en los últimos 10 años.</p>


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
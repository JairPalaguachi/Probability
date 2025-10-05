import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Graficos } from './components/Graficos';
import Banner from './components/Banner';
import InfoPanel from './components/InfoPanel';
import LocationPickerMap from './components/LocationPickerMap';
import { FechaPicker } from './components/FechaPicker';
import CheckBoxFuncional from './components/CheckBoxFuncional';


type Position = {
  lat: number;
  lng: number;
};

interface ClimaOptions {
  muyCaliente: boolean;
  muyFrio: boolean;
  muyVentoso: boolean;
  muyHumedo: boolean;
  muyIncomodo: boolean;
}

function MainPage() {
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [climaOptions, setClimaOptions] = useState<ClimaOptions>({
    muyCaliente: false,
    muyFrio: false,
    muyVentoso: false,
    muyHumedo: false,
    muyIncomodo: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClimaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClimaOptions({
      ...climaOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleConsultarClima = async () => {
    if (!position || !selectedDate) {
      setError("Por favor, selecciona una ubicación en el mapa y una fecha.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = String(selectedDate.getFullYear()).slice(-2);
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = selectedDate.toTimeString().split(' ')[0];
    const url = `http://127.0.0.1:5000/api/clima-historico?lat=${position.lat}&lon=${position.lng}&fecha=${formattedDate}&hora=${formattedTime}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error en la respuesta del servidor.");
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        navigate('/graficos', { 
          state: { 
            apiData: data, 
            originalDate: formattedDate,
            originalTime: formattedTime
          } 
        });
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. Revisa que el backend esté funcionando.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="banner-container"> 
        <Banner />
      </div>
      <div className="app-grid">
        <div className="app-grid-left">
          <InfoPanel lat={position?.lat} lng={position?.lng} />
        </div>
        <div className="app-grid-right">
          <LocationPickerMap position={position} onPositionChange={setPosition} />
          <div>
            <p>Fecha del Evento</p>
            <FechaPicker onDateChange={setSelectedDate} />
            <p style={{marginTop: '20px'}}>Condiciones a considerar:</p>
            <CheckBoxFuncional clima={climaOptions} onChange={handleClimaChange} />
            <button onClick={handleConsultarClima} disabled={isLoading} style={{ marginTop: '20px', width: '100%', padding: '15px' }}>
              {isLoading ? 'Consultando...' : 'Analizar Clima'}
            </button>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/graficos" element={<Graficos />} />
      </Routes>
    </BrowserRouter>
  );
}
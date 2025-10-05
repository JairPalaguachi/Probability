import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LocationPickerMap from './components/LocationPickerMap';
import InfoPanel from './components/InfoPanel';
import Banner from './components/Banner';
import ProbabilidadesPage from './ProbabilidadesPage';
import CheckBoxFuncional from './components/CheckBoxFuncional';
import { FechaPicker } from './components/FechaPicker';
import { Graficos } from './components/Graficos';
import { useState } from 'react';

type Position = {
  lat: number;
  lng: number;
};

function MainPage() {
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const url = `http://127.0.0.1:5000/api/clima-historico?lat=${position.lat}&lon=${position.lng}&fecha=${formattedDate}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error en la respuesta del servidor.");
      
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        navigate('/graficos', { state: { apiData: data } });
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
          <LocationPickerMap 
            position={position} 
            onPositionChange={setPosition} 
          />
          <div>
            <p>Fecha del Evento</p>
            <FechaPicker onDateChange={setSelectedDate} />
            <CheckBoxFuncional/>
            <button onClick={handleConsultarClima} disabled={isLoading} style={{ marginTop: '20px' }}>
              {isLoading ? 'Consultando...' : 'Analizar Clima'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <Route path="/probabilidades" element={<ProbabilidadesPage />} />
        <Route path="/graficos" element={<Graficos/>} />
      </Routes>
    </BrowserRouter>
  );
}
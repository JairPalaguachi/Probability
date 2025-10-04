import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LocationPickerMap from './components/LocationPickerMap';
import InfoPanel from './components/InfoPanel';
import Banner from './components/Banner';
import ProbabilidadesPage from './ProbabilidadesPage';
import CheckBoxFuncional from './components/CheckBoxFuncional';
import { FechaPicker } from './components/FechaPicker';


function MainPage() {
  return (
    <>
      <div className="banner-container"> 
        <Banner />
      </div>

      <div className="app-grid">
        <div className="app-grid-left">
          <InfoPanel />
        </div>
        <div className="app-grid-right">
          <LocationPickerMap />
          <div>
            <p>Fecha del Evento</p>
            <FechaPicker/>
            <CheckBoxFuncional/>
            <button>Analizar Probabilidades</button>
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
      </Routes>
    </BrowserRouter>
  );
}
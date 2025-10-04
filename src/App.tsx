import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LocationPickerMap from './components/LocationPickerMap';
import InfoPanel from './components/InfoPanel';
import Banner from './components/Banner';
import ProbabilidadesPage from './ProbabilidadesPage'; // Asegúrate de que la ruta sea correcta


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
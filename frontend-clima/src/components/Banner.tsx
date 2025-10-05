
import { Wind } from 'lucide-react';
import './estilos/Banner.css'; 

export default function NASABanner() {
  return (
    <div className="banner-root">
      <div className="banner-content">
        {/* Icon */}
        <div className="banner-icon">
          <Wind className="wind-icon" />
        </div>
        {/* Text Content */}
        <div className="banner-text">
          <h1 className="banner-title">
            Análisis Climático NASA
          </h1>
          <p className="banner-subtitle">
            Probabilidades Meteorológicas Históricas
          </p>
        </div>
      </div>
    </div>
  );
}
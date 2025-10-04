import { useLocation } from 'react-router-dom';
import Probabilidades from './components/Probabilidades';
import Banner from './components/Banner';

export default function ProbabilidadesPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');

    return (
        <>
            <div className="banner-container">
                <Banner />
            </div>
            
            <div className="probabilidades-title" style={{ padding: 40 }}>
                <h1 > Probabilidades Meteorológicas</h1>
                <Probabilidades />
                <p>Latitud: {lat}</p>
                <p>Longitud: {lng}</p>
            </div>
        </>
    );
}
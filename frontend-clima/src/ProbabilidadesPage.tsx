
import Probabilidades from './components/Probabilidades';
import Banner from './components/Banner';

export default function ProbabilidadesPage() {

    return (
        <>
            <div className="banner-container">
                <Banner />
            </div>
            
            <div className="probabilidades-title" style={{ padding: 40 }}>
                
                <Probabilidades />
                

            </div>
        </>
    );
}
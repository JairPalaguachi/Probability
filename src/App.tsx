import LocationPickerMap from './components/LocationPickerMap';
import InfoPanel from './components/InfoPanel';
import Banner from './components/Banner';


function App() {
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

export default App;
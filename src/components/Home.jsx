// Home.jsx
import { useState, useEffect } from 'react';
import { getWeatherByLocation } from '../functions/getWeather'; // Importa la función getWeatherByLocation
import { italyFlag, chinaFLag, colombiaFlag, eeuuFlag, germanyFlag, japanFlag, southafricaFlag, spainFlag, turkeyFlag } from '../assets/indexFlag'

const defaultCities = [
  { name: 'Rome', flag: italyFlag },
  { name: 'Madrid', flag: spainFlag },
  { name: 'Berlin', flag: germanyFlag },
  { name: 'Istanbul', flag: turkeyFlag },
  { name: 'Beijing', flag: chinaFLag },
  { name: 'Tokyo', flag: japanFlag },
  { name: 'New York', flag: eeuuFlag },
  { name: 'Medellin', flag: colombiaFlag, },
  { name: 'Johannesburg', flag: southafricaFlag }];


const Home = () => {

  const [Location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchWeather = async () => {
    try {
      const data = await getWeatherByLocation(Location); // Usa la función getWeatherByLocation
      setWeatherData(data);
    } catch (error) {
      setErrorMessage(`${error.message}`)
    }
  };

  const handleInputChange = (event) => {
    setLocation(event.target.value.toUpperCase());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeather();
  };

  const [weatherDataList, setWeatherDataList] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const dataPromises = defaultCities.map(async (Location) => {
          const data = await getWeatherByLocation(Location.name);
          return { ...data, flag: Location.flag };
        });
        const dataList = await Promise.all(dataPromises);
        setWeatherDataList(dataList);
      } catch (error) {
        console.error("No internet")
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className='pag-container'>
      <div className='tit-pag'>Search Weather</div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={Location} onChange={handleInputChange} placeholder="Enter Location" />
        <button type="submit">Get Weather</button>
      </form>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {weatherData && (
        <div className='weather-information'>
          <h3 className='weather-in'>Weather in {weatherData.name}</h3>
          <p className='info'>Temperature: {Math.round(weatherData.current.temperature_2m)}°C</p>
          <p className='info'>Humidity: {weatherData.current.relative_humidity_2m}%</p>
          <p className='info'>Precipitation: {weatherData.current.precipitation} mm</p>
          <p className='info'>Clouds: {weatherData.current.cloud_cover}%</p>
          <p className='info'>Wind Speed: {weatherData.current.wind_speed_10m} km/h</p>
          <p className='info'>
            {weatherData.current.is_day === 1 ? 'Is Day' : 'Is Night'}
          </p>
        </div>
      )}
      <div className="weather-cards-container">
        {weatherDataList.map((weatherData, index) => (
          <div key={index} className="weather-card">
            {weatherData && (
              <>
                <div className='location-info'>
                  <div className='location-name'>{weatherData.name}</div>
                  <img src={weatherData.flag} alt={weatherData.name} className='flag' />
                </div>
                <div className='info'>Temperature: <p>{Math.round(weatherData.current.temperature_2m)}°C</p></div>
                <div className='info'>Humidity: <p>{weatherData.current.relative_humidity_2m}%</p></div>
                <div className='info'>Precipitation: <p>{weatherData.current.precipitation} mm</p></div>
                <div className='info'>Clouds: <p>{weatherData.current.cloud_cover}%</p></div>
                <div className='info'>Wind Speed: <p>{weatherData.current.wind_speed_10m} km/h</p></div>
                <div className='info'>
                  {weatherData.current.is_day === 1 ? 'Is Day' : 'Is Night'}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

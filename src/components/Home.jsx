import { useState, useEffect } from 'react';

// Import functions
import { getWeatherByLocation } from '../functions/getWeather';

// Import assets
import { italyFlag, chinaFLag, colombiaFlag, eeuuFlag, germanyFlag, japanFlag, southafricaFlag, spainFlag, turkeyFlag } from '../assets/indexFlag'

// Define the main cities that will be shown on the main page
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
  const [Location, setLocation] = useState(''); // Location that the user wants to search
  const [weatherData, setWeatherData] = useState(null); // Data of the searched location
  const [weatherDataList, setWeatherDataList] = useState([]); // Data of the main cities
  const [errorMessage, setErrorMessage] = useState(''); // If there is any error, it will be shown

  // Set the text that the user places in the form as 'Location'
  const handleInputChange = (event) => {
    setLocation(event.target.value.toUpperCase());
  }

  // Search for the location that the user selected
  async function fetchWeather(event) {
    event.preventDefault(); // Prevent the browser from performing its default action when a submission event occurs
    try {
      const data = await getWeatherByLocation(Location); // Get the data of the location
      setWeatherData(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(`${error.message}`)
    }
  }

  // When the component is loaded, show the data of the main cities
  useEffect(() => {
    async function fetchWeatherData (){
      try {
        const dataPromises = defaultCities.map(async (Location) => { // Map the cities along with their data
          const data = await getWeatherByLocation(Location.name);
          return { ...data, flag: Location.flag };
        });
        const dataList = await Promise.all(dataPromises); // Wait for all promises to be resolved
        setWeatherDataList(dataList);
      } catch (error) {
        console.error("Error in fetchWeatherData in the Home component: ", error)
      }
    }
    fetchWeatherData();
  }, []);

  return (
    <div className='pag-container'>
      <div className='tit-pag'>Search Weather</div>{/* Title of the page */}
      <form onSubmit={fetchWeather}>{/* Form to search for weather information of a location */}
        <input type="text" value={Location} onChange={handleInputChange} placeholder="Enter Location" />
        <button type="submit">Get Weather</button>
      </form>
      {errorMessage && <div style={{ color: 'red', paddingTop: '10px' }}>{errorMessage}</div>}{/* If there is an error message, show it */}
      <div className='weather-cards-container'>{/* If there is data, it will be shown in a card */}
        {weatherData && (
          <div className='weather-card'>
            <h3 className='text-center location-name'>Weather in <p style={{textDecoration: 'underline'}}>{weatherData.name}</p></h3>
            <div className='info'>Temperature: <p>{Math.round(weatherData.current.temperature_2m)}°C</p></div>
            <div className='info'>Humidity: <p>{weatherData.current.relative_humidity_2m}%</p></div>
            <div className='info'>Precipitation: <p>{weatherData.current.precipitation} mm</p></div>
            <div className='info'>Clouds: <p>{weatherData.current.cloud_cover}%</p></div>
            <div className='info'>Wind Speed: <p>{Math.round(weatherData.current.wind_speed_10m)} km/h</p></div>
            <div className='info'><p>{weatherData.current.is_day === 1 ? 'Is Day' : 'Is Night'}</p></div>
          </div>
        )}
      </div>
      <div className='weather-cards-container'>{/* These are the information cards of all the main cities */}
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
                <div className='info'>Wind Speed: <p>{Math.round(weatherData.current.wind_speed_10m)} km/h</p></div>
                <div className='info'><p>{weatherData.current.is_day === 1 ? 'Is Day' : 'Is Night'}</p></div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

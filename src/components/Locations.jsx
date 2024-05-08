/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import { addUserLocation, getUserLocations, deleteLocation } from '../firebase/firebase'
import { getWeatherByLocation } from '../functions/getWeather';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userLocations = await getUserLocations(); // Espera a que se obtengan las ubicaciones
        const weatherInfoList = [];

        // Itera sobre cada ubicación y obtén su información del clima
        for (const location of userLocations) {
          // Llama a la función getWeatherBylocation para obtener la información del clima
          const weatherInfo = await getWeatherByLocation(location.name);
          // Si se obtiene información del clima, agrégala a la lista weatherInfoList
          if (weatherInfo) {
            weatherInfoList.push({ name: location.name, weatherData: weatherInfo });
          }
        }
        // Actualiza el estado con la lista de información del clima
        setLocations(weatherInfoList);
      } catch (error) {
        console.error('Error en useEffect de Locations: ', error)
      }
    };

    fetchData();
  }, []);

  const handleSaveLocation = async () => {
    if (newLocation.trim() !== '') {
      try {
        const weatherData = await getWeatherByLocation(newLocation);
        if (!await addUserLocation(newLocation)) {
          throw new Error(`${newLocation} already saved`);
        }
        setLocations(prevLocations => [{ name: newLocation, weatherData }, ...prevLocations ]);
        setNewLocation('');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(`${error.message}`);
      }
    }
  };

  const handleDeleteLocation = async (locationName) => {
    try {
      await deleteLocation(locationName);
      setLocations(prevLocations => prevLocations.filter(location => location.name !== locationName));
    } catch (error) {
      setErrorMessage('Error deleting location');
    }
  };

  return (
    <div className='pag-container'>
      <div className='tit-pag'>My Locations</div>
      <div>
        <input
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value.toUpperCase())}
          placeholder='Enter Location'
        />
        <button onClick={handleSaveLocation}>Save Location</button>
      </div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <div className="weather-cards-container">
        {locations.map((location, index) => (
          <div key={index} className="weather-card">
            <div className='location-info'>
              <div className='location-name'>{location.name}</div>
            </div>
            {location.weatherData && (
              <>
                <div className='info'>Temperature: <p>{Math.round(location.weatherData.current.temperature_2m)}°C</p></div>
                <div className='info'>Humidity: <p>{location.weatherData.current.relative_humidity_2m}%</p></div>
                <div className='info'>Precipitation: <p>{location.weatherData.current.precipitation} mm</p></div>
                <div className='info'>Clouds: <p>{location.weatherData.current.cloud_cover}%</p></div>
                <div className='info'>Wind Speed: <p>{location.weatherData.current.wind_speed_10m} km/h</p></div>
                <div className='info'>
                  <p>{location.weatherData.current.is_day === 1 ? 'Is Day' : 'Is Night'}</p>
                </div>
              </>
            )}
            <button className="btndelete" onClick={() => { console.log("Deleting location with name:", location.name); handleDeleteLocation(location.name); }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;

// Home.jsx
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getWeatherByCity } from '../functions/getWeather'; // Importa la función getWeatherByCity
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

  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchWeather = async () => {
    try {
      const data = await getWeatherByCity(city); // Usa la función getWeatherByCity
      setWeatherData(data);
    } catch (error) {
      setErrorMessage(`${error.message}`)
    }
  };

  const handleInputChange = (event) => {
    setCity(event.target.value.toUpperCase());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeather();
  };

  const [weatherDataList, setWeatherDataList] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const dataPromises = defaultCities.map(async (city) => {
          const data = await getWeatherByCity(city.name);
          return { ...data, flag: city.flag };
        });
        const dataList = await Promise.all(dataPromises);
        setWeatherDataList(dataList);
      } catch (error) {
        setErrorMessage(`${error.message}`)
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className='pag-container'>
      <div className='tit-pag'>Search Weather</div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={city} onChange={handleInputChange} placeholder="Enter Location" />
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
                <div className='city-info'>
                  <div className='city-name'>{weatherData.name}</div>
                  <img src={weatherData.flag} alt={weatherData.name} className='flag' />
                </div>
                <p className='info'>Temperature: {Math.round(weatherData.current.temperature_2m)}°C</p>
                <p className='info'>Humidity: {weatherData.current.relative_humidity_2m}%</p>
                <p className='info'>Precipitation: {weatherData.current.precipitation} mm</p>
                <p className='info'>Clouds: {weatherData.current.cloud_cover}%</p>
                <p className='info'>Wind Speed: {weatherData.current.wind_speed_10m} km/h</p>
                <p className='info'>
                  {weatherData.current.is_day === 1 ? 'Is Day' : 'Is Night'}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

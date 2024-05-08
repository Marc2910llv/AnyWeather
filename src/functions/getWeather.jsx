import axios from 'axios';

//import firebase utilities
import { checkLocation, addInfoLocation } from '../firebase/firebase'

const API_KEY = '1c67a5962b59e1796d04fca17bcf5f83';

const getWeatherByCoordinates = async (city, lat, lon) => {
  try {
    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/gfs?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,cloud_cover,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,wind_speed_10m,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_hours,precipitation_probability_max,wind_speed_10m_max&forecast_days=1`);
    const weatherData = weatherResponse.data;
    weatherData.name = city;
    return weatherData;
  } catch (error) {
    throw new Error('Error fetching weather data: ' + error.message);
  }
};

export const getWeatherByCity = async (city) => {
  try {
    // Check Firestore if the city is already stored
    const querySnapshot = await checkLocation(city);
    if (!querySnapshot.empty) {
      // If the city is in Firestore, get its coordinates and call the getWeatherByCoordinates function
      const cityData = querySnapshot.docs[0]?.data();
      if (!cityData) {
        throw new Error(`No data found for city: ${city}`);
      }
      return await getWeatherByCoordinates(city, cityData.lat, cityData.lon);
    } else {
      // If the city is not in Firestore, query the OpenWeatherMap API and then store it in Firestore
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const { data } = response;

      await addInfoLocation(city, data);

      return await getWeatherByCoordinates(city, data.coord.lat, data.coord.lon);
    }
  } catch (error) {
    throw new Error('Not data found')
  }
};
import axios from 'axios';

// Import firebase functions
import { checkLocation, addInfoLocation, checkLocationCache, addInfoLocationCache } from '../firebase/firebase'

// API key to get information from OpenWeatherMap
const API_KEY = '1c67a5962b59e1796d04fca17bcf5f83';

// Given the coordinates from a location it returns his meteorological information
const getWeatherByCoordinates = async (location, lat, lon) => {
  try {
    // Make a call to the API
    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/gfs?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,cloud_cover,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,wind_speed_10m,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_hours,precipitation_probability_max,wind_speed_10m_max&forecast_days=1`);
    const weatherData = weatherResponse.data;
    weatherData.name = location; // The data don't have the name of the location so it is included
    return weatherData;
  } catch (error) {
    throw new Error('Error fetching weather data: ' + error.message);
  }
};

// Given a name of a location it returns his meteorological information
export const getWeatherByLocation = async (location) => {
  try {
    // Check Firestore if the location is already stored
    const querySnapshot = await checkLocation(location);
    if (!querySnapshot.empty) {
      // If the location is in Firestore, get its coordinates and call the getWeatherByCoordinates function
      const cityData = querySnapshot.docs[0]?.data();
      if (!cityData) {
        throw new Error(`No data found for location: ${location}`);
      }
      return await getWeatherByCoordinates(location, cityData.latitude, cityData.longitude);
    } else {
      // If the location is not in Firestore, query the OpenWeatherMap API and then store it in Firestore
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
      const { data } = response;

      const weatherData = await getWeatherByCoordinates(location, data.coord.lat, data.coord.lon);

      // Add the information of the location in the database
      await addInfoLocation(weatherData);
      await addInfoLocationCache(weatherData);

      return weatherData;
    }
  } catch (error) {
    try {
      const querySnapshot = await checkLocationCache(location)
      if (querySnapshot !== null) {
        return querySnapshot;
      } else { throw new Error }
    } catch (error) { throw new Error('No data found') }
  }
};
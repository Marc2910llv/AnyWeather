import { useState, useEffect } from 'react';

// Import firebase functions
import { addUserLocation, getUserLocations, deleteLocation } from '../firebase/firebase';

// Import functions
import { getWeatherByLocation } from '../functions/getWeather';

const Locations = () => {
  const [locations, setLocations] = useState([]); // Array of saved locations by the user
  const [newLocation, setNewLocation] = useState(''); // The user can save new locations
  const [errorMessage, setErrorMessage] = useState(''); // If there is any error, it will be shown

  useEffect(() => {
    async function fetchData() {
      try {
        const userLocations = await getUserLocations(); // Get the locations that the user has already saved
        const weatherInfoList = [];
        // Iterate over each location and get its weather information
        for (const location of userLocations) {
          // Call the getWeatherByLocation function to get the weather information
          const weatherData = await getWeatherByLocation(location.name);
          // If weather information is obtained, add it to the weatherInfoList array
          if (weatherData) {
            weatherInfoList.push(weatherData);
          }
        }
        // Update the state with the list of weather information
        setLocations(weatherInfoList);
      } catch (error) {
        console.error('Error in useEffect of Locations: ', error);
      }
    }
    fetchData();
  }, []);

  // When the user enters a new location, it is saved in the Firebase Database
  async function handleSaveLocation() {
    if (newLocation.trim() !== '') { // Checks if the input is not empty
      try {
        const weatherData = await getWeatherByLocation(newLocation); // Get the data of the new location
        if (!await addUserLocation(newLocation)) { // Save the new location in the database
          throw new Error(`${newLocation} already saved`);
        }
        // Add the new location to the array of saved locations
        setLocations(prevLocations => [weatherData, ...prevLocations]);
        setNewLocation('');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(`${error.message}`);
      }
    }
  }

  // The user can delete his saved locations individually
  async function handleDeleteLocation(locationName) {
    try {
      await deleteLocation(locationName); // Delete the selected location
      // Delete the location from the locations array
      setLocations(prevLocations => prevLocations.filter(weatherData => weatherData.name !== locationName));
    } catch (error) {
      setErrorMessage('Error deleting the location');
    }
  }

  return (
    <div className='pag-container'>
      <div className='tit-pag'>My Locations</div>{/* Title of the page */}
      <div>
        <input
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value.toUpperCase())}
          placeholder='Enter Location' />
        <button onClick={handleSaveLocation}>Save Location</button>{/* Form to save new locations */}
      </div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}{/* Shows an error message if necessary */}
      <div className="weather-cards-container">{/* Shows the information of all the locations the user has saved */}
        {locations.map((weatherData, index) => (
          <div key={index} className="weather-card">
            <div className='location-info'>
              <div className='location-name'>{weatherData.name}</div>
            </div>
            {weatherData && (
              <>
                <div className='info'>Temperature: <p>{Math.round(weatherData.current.temperature_2m)}°C</p></div>
                <div className='info'>Humidity: <p>{weatherData.current.relative_humidity_2m}%</p></div>
                <div className='info'>Precipitation: <p>{weatherData.current.precipitation} mm</p></div>
                <div className='info'>Clouds: <p>{weatherData.current.cloud_cover}%</p></div>
                <div className='info'>Wind Speed: <p>{weatherData.current.wind_speed_10m} km/h</p></div>
                <div className='info'>
                  <p>{weatherData.current.is_day === 1 ? 'Is Day' : 'Is Night'}</p>
                </div>
              </>
            )}{/* Button to delete location */}
            <button className="btndelete" onClick={() => handleDeleteLocation(weatherData.name)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;
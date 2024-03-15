import React, { useState, useEffect } from 'react';
import './weather.css';

const Weather = () => {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const api = {
    key: '35bac4c9109a2f403e8f7c8bd6afd145',
    base: 'https://api.openweathermap.org/data/2.5/',
  };

  useEffect(() => {
    const fetchWeatherByLocation = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `${api.base}weather?lat=${latitude}&lon=${longitude}&appid=${api.key}`
        );
        const result = await response.json();
        if (result.cod === 200) {
          setWeather(result);
          setError(null);
        } else {
          setError(result.message);
          setWeather(null);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data. Please try again later.');
        setWeather(null);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
      },
      (error) => {
        console.error('Error getting user location:', error);
        setError('Error getting user location. Please allow location access.');
      }
    );
  }, []);

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = (evt) => {
    if (evt.key === 'Enter') {
      fetch(`${api.base}weather?q=${search}&appid=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.cod === 200) {
            setWeather(result);
            setSearch('');
            setError(null);
          } else {
            setError(result.message);
            setWeather(null);
          }
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          setError('Error fetching weather data. Please try again later.');
          setWeather(null);
        });
    }
  };

  const dateBuilder = (d) => {
    let month= ["January","February","March","April","May","June","July",
      "August","September","October","November","December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let  monthIndex = month[d.getMonth()];
    let year = d.getFullYear();
    return `${day} ${date} ${monthIndex} ${year}`;
  };

  const kelvinToCelsius = (temp) => {
    return (temp - 273.15).toFixed(2); 
  };

  const timeBuilder = (time) => {
    if (!time) return ""; 
  
    const milliseconds = time * 1000;
    const date = new Date(milliseconds);
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return formattedTime;
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search your city"
        value={search}
        onChange={handleInput}
        onKeyUp={handleSearch}
      />
      {error && <div className="error">{error}</div>}
      {weather && (
        <div className='weather-box'>
          <div className='date'>
            <p>{weather.name}, {weather.sys.country}</p>
            <p>{dateBuilder(new Date())}</p>
          </div>
          <div>
            <div className='temp-box'>
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
              <p>Temperature: {kelvinToCelsius(weather.main.temp)} °C</p>
              <p>{weather.weather[0].description}</p>
            </div>
            <div>
              <p>{kelvinToCelsius(weather.main.temp_max)} °C</p>
              <p>{weather.wind.speed}</p>
              <p>{timeBuilder(weather.sys.sunrise)}</p>
              <p>{kelvinToCelsius(weather.main.temp_min)} °C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>{timeBuilder(weather.sys.sunset)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Weather;

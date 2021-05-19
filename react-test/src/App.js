import React, { useState, useEffect } from 'react';
import './App.css';

const GetWeather = (city) => {
  const owmKey = process.env.REACT_APP_OWM_KEY;
  const query = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + owmKey;

  const [weatherDesc, setWeatherDesc] = useState('');

  useEffect(() => {
    //update once an hour
    const desc = setInterval(() => {
      getDesc();
    }, (3600000));
    return () => clearInterval(desc);
  });

  function getDesc() {
    fetch(query)
      .then((response) => {
        if(response.ok) {
          return response.json();
        }
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      })
      .then((data) => {
        console.log(data.weather[0].description);
        console.log(data);
        setWeatherDesc(data.weather[0].description);
      })
      .catch((err) => {
        console.log('There was a problem: ', err);
      })
  }

  getDesc();
  
  return weatherDesc;
};



const CityForm = (props) => {
  const [city, setCity] = useState('');

  const handleClick = (e) => {
    e.preventDefault();
    props.changeCity(city);
  };
  
  return (
    <form>
      <label>
        <input
          type="text"
          value=''
          value={city}
          onChange={e => setCity(e.target.value)}
        />
      </label>
      <button type="submit" onClick={handleClick}>Get weather</button>
    </form>
  )
};

function App() {
  const [city, setCity] = useState('Seattle');
  const changeCity = (city) => {
    setCity(city);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{GetWeather(city)}</h1>
      </header>
      <CityForm changeCity={changeCity}/>
    </div>
  );
}

export default App;

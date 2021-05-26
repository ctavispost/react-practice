import React, { useState } from 'react';
import { createClient } from 'pexels';
import './App.css';

//track calls to Pexels API to make sure we don't make too many
let index = 0;

const getPicsArr = (desc, changePicsArr) => {
  const client = createClient(process.env.REACT_APP_PEXELS_KEY);
  const query = desc;

  index++;
  console.log('index: ' + index);
  //make sure not to make too many API calls while testing; check that a query is given
  if (index < 12 && query) {
    return client.photos.search({ query, per_page: 10 })
      .then(data => {
        console.log(data.photos);
        changePicsArr(data.photos);
      })
      .catch(err => {
        console.log('There was a problem: ', err);
      });
  }
};

const ShowPics = (props) => {
  return(
    props.picsArr.map((photo) => {
      console.log('sanity check');
      //get photo alt through regex of photo.url
      const alt = '';

      return (
        <li key={photo.id}>
          <a href={photo.url}>
            <figure>
              <img src={photo.src.original} alt={alt} height={photo.height} width={photo.width} />
              <figcaption>by <a href={photo.photographer_url}>{photo.photographer}</a></figcaption>
            </figure>
          </a>
        </li>
      );  
    })
  );
};

const MemoShowPics = React.memo(ShowPics);

const GetWeather = (city) => {
  const owmKey = process.env.REACT_APP_OWM_KEY;
  const query = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + owmKey;

  const [weatherDesc, setWeatherDesc] = useState('');

  console.count();
  /*
  // re-import useEffect if you use this
  useEffect(() => {
    //update once an hour
    const desc = setInterval(() => {
      getDesc();
    }, (3600000));
    return () => clearInterval(desc);
  });
  */
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
          value={city}
          onChange={e => setCity(e.target.value)}
        />
      </label>
      <button type="submit" onClick={handleClick}>Get weather</button>
    </form>
  )
};

const WeatherInCity = (props) => {
  return(
    <div>
      <h1 className="marg-bot-zero">
        {props.weather ? props.weather : 'getting weather'}
      </h1>
      <p className="marg-top-sm">in {props.city}</p>
    </div>
  )
}

const MemoWeatherInCity = React.memo(WeatherInCity);

function App() {
  const [city, setCity] = useState('Seattle');
  const changeCity = (locale) => {
    setCity(locale);
  };

  const weather = GetWeather(city);

  const [picsArr, setPicsArr] = useState([]);
  const changePicsArr = (arr) => {
    setPicsArr(arr);
  };

  getPicsArr(weather, changePicsArr);

  return (
    <div className="App">
      <header className="App-header">
        <MemoWeatherInCity city={city} weather={weather} />
      </header>
      <CityForm changeCity={changeCity}/>
      
      {weather ? 
        <ul>
          <MemoShowPics picsArr={picsArr} />
        </ul> 
        : 
        <p>Loading photos...</p>
      }
      
    </div>
  );
}

export default App;

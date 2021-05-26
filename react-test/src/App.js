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

const getAlt = (data) => {
  const url = data.url;
  let alt = url.replace('https://www.pexels.com/photo/', '');
  
  alt = alt.replace(/\-/g, ' ');
  alt = alt.replace(/\d/g, '');
  alt = alt.replace(/\//g, '');
  
  return alt.trim();
}

const ShowPics = (props) => {
  return(
    props.picsArr.map((photo) => {
      const alt = getAlt(photo);

      return (
        <li key={photo.id}>
          <figure className="gridCenter">
            <img 
              src={photo.src.original}
              srcSet={
                `${photo.src.small} 1x, 
                ${photo.src.medium} 2x, 
                ${photo.src.large} 3x,
                ${photo.src.original} 4x`
              }
              alt={alt} 
              height={photo.height} 
              width={photo.width} 
            />
            <figcaption><a href={photo.url}>photo</a> by <a href={photo.photographer_url}>{photo.photographer}</a></figcaption>
          </figure>  
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
    <div className="App gridCenter">
      <header className="App-header gridCenter">
        <MemoWeatherInCity city={city} weather={weather} />
      </header>
      <CityForm changeCity={changeCity}/>
      
      {weather ? 
        <ul className="gridCenter">
          <MemoShowPics picsArr={picsArr} />
        </ul> 
        : 
        <p>Loading photos...</p>
      }
      
    </div>
  );
}

export default App;

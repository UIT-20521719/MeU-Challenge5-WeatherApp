import { useEffect, useState } from 'react';
import './scss/index.scss';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import TempPicker from './components/TempPicker';
import Moment from 'moment';
import WeatherCard from './components/WeatherCard';
import { Navigation } from '@mui/icons-material';

function App() {
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });
  const [geoLocation, setGeoLocation] = useState({});
  const [units, setUnits] = useState('metric');
  const [tempDegree, setTempDegree] = useState('\u00b0C');
  const [windSpeedUnit, setWindSpeedUnit] = useState('m/s');
  const [windDirection, setWindDirection] = useState('');

  const [todayWeather, setTodayWeather] = useState({});
  const [nextWeather, setNextWeather] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successLocation,
        failureLocation
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);
  const successLocation = ({ coords: { latitude, longitude } }) => {
    const c = {
      lat: latitude,
      lon: longitude,
    };
    setGeoLocation(c);
    setCoords(geoLocation);
  };
  const failureLocation = () => {
    const defaultCoords = {
      lat: 0,
      lon: 0,
    };
    setGeoLocation(defaultCoords);
  };

  useEffect(() => {
    setCoords(geoLocation);
  }, [geoLocation]);

  useEffect(() => {
    const fetchTodayWeather = async () => {
      try {
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=${units}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
        const res = await fetch(api);
        const data = await res.json();

        if (res.ok) {
          setTodayWeather(data);
          switchWindDirection(data.wind.deg);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTodayWeather();

    const fetchNextWeather = async () => {
      try {
        const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=${units}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
        const res = await fetch(api);
        const data = await res.json();

        if (res.ok) {
          var endData = [];
          for (const [key, value] of Object.entries(data.list)) {
            const date = Moment(new Date(value.dt * 1000)).format(
              'ddd, DD MMM'
            );
            const temp_max = value.main.temp_max;
            const temp_min = value.main.temp_min;
            const icon = value.weather[0].icon;

            if (
              endData.length < 1 ||
              endData[endData.length - 1].time !== date
            ) {
              const data = {
                time: date,
                temp_max,
                temp_min,
                icon,
              };
              endData.push(data);
            } else {
              endData[endData.length - 1].temp_max = Math.max(
                temp_max,
                endData[endData.length - 1].temp_max
              );
              endData[endData.length - 1].temp_min = Math.min(
                temp_min,
                endData[endData.length - 1].temp_min
              );
            }
          }

          setNextWeather(endData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchNextWeather();
  }, [coords, units]);

  const handleSearch = (coordinates) => {
    setCoords(coordinates);
  };

  const toggleUnits = () => {
    if (units === 'metric') {
      setUnits('imperial');
      setTempDegree('\u00b0F');
      setWindSpeedUnit('mph');
    } else {
      setUnits('metric');
      setTempDegree('\u00b0C');
      setWindSpeedUnit('m/s');
    }
  };

  const switchWindDirection = (direction) => {
    var deg = Math.floor(direction);
    switch (true) {
      case deg >= 360 || deg <= 21:
        setWindDirection('N');
        break;
      case deg >= 22 && deg <= 44:
        setWindDirection('NNE');
        break;
      case deg >= 45 && deg <= 66:
        setWindDirection('NE');
        break;
      case deg >= 67 && deg <= 89:
        setWindDirection('ENE');
        break;
      case deg >= 90 && deg <= 111:
        setWindDirection('E');
        break;
      case deg >= 112 && deg <= 134:
        setWindDirection('ESE');
        break;
      case deg >= 135 && deg <= 156:
        setWindDirection('SE');
        break;
      case deg >= 157 && deg <= 179:
        setWindDirection('SSE');
        break;
      case deg >= 180 && deg <= 201:
        setWindDirection('S');
        break;
      case deg >= 202 && deg <= 224:
        setWindDirection('SSW');
        break;
      case deg >= 225 && deg <= 246:
        setWindDirection('SW');
        break;
      case deg >= 247 && deg <= 269:
        setWindDirection('WSW');
        break;
      case deg >= 270 && deg <= 291:
        setWindDirection('W');
        break;
      case deg >= 292 && deg <= 314:
        setWindDirection('WNW');
        break;
      case deg >= 315 && deg <= 336:
        setWindDirection('NW');
        break;
      case deg >= 337 && deg <= 359:
        setWindDirection('NNW');
        break;
      default:
        setWindDirection('');
    }
  };

  return (
    <div className="container">
      <div className="container__left">
        <Sidebar
          geoLocation={geoLocation}
          coords={coords}
          tempDegree={tempDegree}
          weather={todayWeather}
          handleSearch={handleSearch}
        />
      </div>
      <div className="container__right">
        <TempPicker units={units} toggleUnits={toggleUnits} />
        <div className="container__right__week">
          {nextWeather.length > 0 &&
            nextWeather.map((weather, index) => {
              if (index === 0) return;
              console.log(weather);
              return (
                <WeatherCard
                  key={weather.time}
                  index={index}
                  weather={weather}
                  tempDegree={tempDegree}
                />
              );
            })}
        </div>

        <div className="container__right__highlight">
          <div className="highlight">
            <h1 className="highlight__title">Today's Highlight</h1>
            <div className="highlight__content">
              {todayWeather.wind && (
                <div className="highlight__card">
                  <p className="highlight__card__title">Wind status</p>
                  <div className="highlight__card__content">
                    {todayWeather.wind.speed}
                    <span className="unit">{windSpeedUnit}</span>
                  </div>
                  <div className="highlight__card__more">
                    <div className="wind">
                      <Navigation
                        className="wind__deg"
                        style={{ rotate: `${todayWeather.wind.deg}deg` }}
                      />
                      <p className="wind__dir">{windDirection}</p>
                    </div>
                  </div>
                </div>
              )}
              {todayWeather.main && (
                <div className="highlight__card">
                  <p className="highlight__card__title">Humidity</p>
                  <div className="highlight__card__content">
                    {todayWeather.main.humidity}
                    <span className="unit">%</span>
                  </div>
                  <div className="highlight__card__more">
                    <div className="humidity">
                      <div className="humidity__indicator">
                        <p>0</p>
                        <p>50</p>
                        <p>100</p>
                      </div>
                      <div className="humidity__bar">
                        <div
                          className="humidity__bar__progress"
                          style={{ width: `${todayWeather.main.humidity}%` }}
                        ></div>
                      </div>
                      <div className="humidity__percent">%</div>
                    </div>
                  </div>
                </div>
              )}
              {todayWeather.visibility && (
                <div className="highlight__card">
                  <p className="highlight__card__title">Visibility</p>
                  <div className="highlight__card__content">
                    {Number(todayWeather.visibility * 0.000621371192).toFixed(
                      1
                    )}
                    <span className="unit"> miles</span>
                  </div>
                </div>
              )}
              {todayWeather.main && (
                <div className="highlight__card">
                  <p className="highlight__card__title">Air Pressure</p>
                  <div className="highlight__card__content">
                    {todayWeather.main.pressure}
                    <span className="unit"> mb</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;

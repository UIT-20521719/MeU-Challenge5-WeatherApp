import React, { useEffect, useState } from 'react';
import {
  GpsFixed,
  Close,
  Search,
  LocationOn,
  ArrowForwardIos,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import Moment from 'moment';

const Sidebar = ({
  geoLocation,
  coords,
  tempDegree,
  weather,
  handleSearch,
}) => {
  const [coordinates, setCoordinates] = useState(coords);

  const [searchActive, setSearchActive] = useState(false);
  const [searchContent, setSearchContent] = useState('');
  const [searchOptions, setSearchOptions] = useState([]);

  const toggleSearchForm = () => {
    setSearchActive(!searchActive);
  };

  const handleSearchOptions = () => {
    const fetchLocation = async () => {
      try {
        const api = `http://api.openweathermap.org/geo/1.0/direct?q=${searchContent}&limit=5&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
        const res = await fetch(api);
        const data = await res.json();
        if (res.ok) {
          setSearchOptions(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchLocation();
  };

  useEffect(() => {
    handleSearch(coordinates);
  }, [coordinates]);

  return (
    <div className="sidebar">
      {searchActive ? (
        <>
          <div className="sidebar__close">
            <Close className="sidebar__close__btn" onClick={toggleSearchForm} />
          </div>
          <div className="sidebar__search">
            <div className="sidebar__search__input">
              <Search />
              <input
                type="text"
                placeholder="search location"
                value={searchContent}
                onChange={(e) => {
                  setSearchContent(e.target.value);
                }}
              />
            </div>
            <div className="sidebar__search__btn" onClick={handleSearchOptions}>
              Search
            </div>
          </div>
          {/**map search options */}
          {searchOptions.length > 0 &&
            searchOptions.map((option) => {
              return (
                <div
                  key={uuidv4()}
                  className="sidebar__option"
                  onClick={() => {
                    toggleSearchForm();
                    setCoordinates({ lat: option.lat, lon: option.lon });
                  }}
                >
                  <div className="sidebar__option__location">
                    {option.name}
                    <div className="state">{option.state}</div>
                  </div>
                  <div className="sidebar__option__icon">
                    <ArrowForwardIos />
                  </div>
                </div>
              );
            })}
        </>
      ) : (
        <>
          <div className="sidebar__header">
            <div className="sidebar__header__btn" onClick={toggleSearchForm}>
              Search for places
            </div>
            <div
              className="sidebar__header__icon"
              onClick={() => {
                setCoordinates(geoLocation);
                handleSearch(coordinates);
              }}
            >
              <GpsFixed />
            </div>
          </div>
          <div className="sidebar__content">
            <div className="sidebar__content__bg"></div>
            {weather.weather && (
              <img
                src={require(`../assets/${weather.weather[0].icon}.png`)}
                className="sidebar__content__weather"
              />
            )}

            <p className="sidebar__content__main">
              <span className="temp">
                {weather.main && Number(weather.main.temp.toFixed(0))}
              </span>
              {tempDegree}
            </p>
            <p className="sidebar__content__main">
              {weather.weather && weather.weather[0].main}
            </p>
            <div className="sidebar__content__more">
              <div className="time">
                <p>Today</p> <p>•</p>{' '}
                <p>
                  {weather &&
                    Moment(new Date(weather.dt * 1000)).format('ddd, DD MMM')}
                </p>
              </div>
              <div className="location">
                <LocationOn />
                {weather && weather.name}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;

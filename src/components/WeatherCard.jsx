import React from 'react';

const WeatherCard = ({ index = 0, weather, tempDegree }) => {
  return (
    <div className="card">
      <p className="card__time">{index === 1 ? 'Tomorrow' : weather.time}</p>
      <img
        src={require(`../assets/${weather.icon}.png`)}
        alt=""
        className="card__weather"
      />
      <div className="card__temp">
        <div className="card__temp__max">
          {Number(weather.temp_max).toFixed(0)}
          {tempDegree}
        </div>
        <div className="card__temp__min">
          {Number(weather.temp_min).toFixed(0)}
          {tempDegree}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

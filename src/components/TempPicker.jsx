import React from 'react';

const TempPicker = ({ units, toggleUnits }) => {
  return (
    <div className="temp">
      <div
        className={`temp__btn ${units === 'metric' && 'active'}`}
        onClick={(e) => {
          if (units === 'imperial') {
            toggleUnits();
          }
        }}
      >
        {'\u00b0C'}
      </div>
      <div
        className={`temp__btn ${units === 'imperial' && 'active'}`}
        onClick={(e) => {
          if (units === 'metric') {
            toggleUnits();
          }
        }}
      >
        {'\u00b0F'}
      </div>{' '}
    </div>
  );
};

export default TempPicker;

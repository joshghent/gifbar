import React from 'react';
import ReactLoading from 'react-loading';

const Spinner = () => {
  return (
    <div className='spinner'>
      <ReactLoading type='bars' />
    </div>
  )
}

export default Spinner;

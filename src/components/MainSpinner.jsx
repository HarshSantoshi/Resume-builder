import React from 'react';
// import HashLoader from 'react-spinner/HashLoader';
import {HashLoader} from 'react-spinners'

const MainSpinner = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <HashLoader color="#a6a6a6" size={50} />
    </div>
  );
};

export default MainSpinner;

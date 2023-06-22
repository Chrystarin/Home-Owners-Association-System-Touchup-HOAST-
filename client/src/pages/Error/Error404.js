import React from 'react';
import NavBar from '../../layouts/NavBar';
import Image404 from '../../images/404.png';
import '../../styles/main.scss';
import './error.scss';
function Error404() {
  return <>
    <NavBar/>
    <div className='SectionHolder' id='Eror404__Container'>
      <img src={Image404} alt="" />
      <h2>Error 404</h2>
      <h3>Page Not Found</h3>
    </div>
  </>
}

export default Error404;

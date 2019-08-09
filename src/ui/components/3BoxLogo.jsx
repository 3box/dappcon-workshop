import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/3boxLogo.png';
import '../styles/index.scss';

const BoxLogo = () => (
  <Link to='/'>
    <img src={Logo} alt="logo" />
  </Link>
);

export default BoxLogo;

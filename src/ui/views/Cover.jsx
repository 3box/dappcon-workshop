import React from 'react';

import Face from '../../assets/3BoxFace.svg';
import '../styles/index.scss';

const Cover = ({ handleLogin }) => (
  <div className="coverPage">
    <section className="coverPage_hero">
      <img src={Face} alt="face" />
    </section>
    <section className="coverPage_ui">
      <div className="coverPage_ui_wrapper">
        <h2>3CHAN</h2>
        <p>Where topics come alive</p>
        <button onClick={handleLogin}>
          Get Started
        </button>
        <p>powered by 3Box</p>
      </div>
    </section>
  </div>
);

export default Cover;

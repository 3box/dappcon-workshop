import React from 'react';

import Topics from '../components/Topics';
import Dialogue from '../components/Dialogue';
import Members from '../components/Members';
import '../styles/index.scss';

const Chat = ({ handleAppModals }) => (
  <div className="chatPage">
    <Topics handleAppModals={handleAppModals} />
    <Dialogue />
    <Members handleAppModals={handleAppModals} />
  </div>
);

export default Chat;

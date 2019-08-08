import React from 'react';

import CrossOut from '../../assets/CrossOut.svg';
import '../styles/index.scss';

const Members = ({ handleAppModals }) => (
  <section className="chatPage_members">
    <p className="chatPage_members_header">
      MEMBERS
      </p>
    <UserTile />
    <button
      className="textButton"
      onClick={() => handleAppModals('AddNewModeratorModal')}
    >
      <span>
        <img src={CrossOut} alt="close" />
      </span>
      Add mods
    </button>
    <button
      className="textButton"
      onClick={() => handleAppModals('AddNewMemberModal')}
    >
      <span>
        <img src={CrossOut} alt="close" />
      </span>
      Add members
    </button>
  </section>
);

const UserTile = () => (
  <div className="userTile">
    <img src="" alt="profile" />
    <h4>Kenzo Nakamura</h4>
  </div>
)

export default Members;

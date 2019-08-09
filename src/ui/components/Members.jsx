import React from 'react';

import ProfilePicture from './ProfilePicture';
import CrossOut from '../../assets/CrossOut.svg';
import '../styles/index.scss';

const Members = (props) => {
  const { handleAppModals, threadMemberList } = props;

  return (
    <section className="chatPage_members">
      <p className="chatPage_members_header">
        MEMBERS
      </p>
      {threadMemberList && threadMemberList.map(author => <ProfilePicture author={author} />)}
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
  )
};

export default Members;

import React from 'react';

import ProfilePicture from './ProfilePicture';
import CrossOut from '../../assets/CrossOut.svg';
import '../styles/index.scss';

const Members = (props) => {
  const { handleAppModals, threadMemberList, threadModeratorList, topicTitle } = props;

  return (
    <section className="chatPage_members">
      <p className="chatPage_members_header">
        MEMBERS
      </p>

      <div className="chatPage_members_members">
        {threadModeratorList && threadModeratorList.map(author => <ProfilePicture author={author} isModerator />)}
        {threadMemberList && threadMemberList.map(author => <ProfilePicture author={author} />)}
      </div>

      {topicTitle && (
        <div className="chatPage_members_members">

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
        </div>
      )}
    </section>
  )
};

export default Members;

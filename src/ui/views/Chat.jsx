import React from 'react';

import Topics from '../components/Topics';
import Dialogue from '../components/Dialogue';
import Members from '../components/Members';
import '../styles/index.scss';

const Chat = (props) => {
  const {
    handleAppModals,
    topicList,
    myProfile,
    myAddress,
    handleViewTopic,
    topicTitle,
    threadData,
    threadMemberList,
    openTopics,
  } = props;

  return (
    <div className="chatPage">
      <Topics
        // funcs
        handleAppModals={handleAppModals}
        handleViewTopic={handleViewTopic}
        // objects
        myProfile={myProfile}
        topicList={topicList}
        // strings
        myAddress={myAddress}
      />
      <Dialogue
        topicTitle={topicTitle}
        threadData={threadData}
        openTopics={openTopics}
      />
      <Members
        handleAppModals={handleAppModals}
        threadMemberList={threadMemberList}
      />
    </div>
  )
};

export default Chat;

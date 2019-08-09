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
    handleFormChange,
    postThread,
    postMsg,
    threadModeratorList,
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
        myProfile={myProfile}
        postMsg={postMsg}
        handleFormChange={handleFormChange}
        postThread={postThread}
        myAddress={myAddress}
      />

      <Members
        handleAppModals={handleAppModals}
        threadMemberList={threadMemberList}
        threadModeratorList={threadModeratorList}
      />
    </div>
  )
};

export default Chat;

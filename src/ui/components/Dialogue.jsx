
import React from 'react';

import ChatPost from './ChatPost';
import '../styles/index.scss';

const Dialogue = (props) => {
  const { handleLogin, topicTitle, threadData, openTopics } = props;
  const isMembersOnly = openTopics[topicTitle] && openTopics[topicTitle]._members;

  return (
    <section className="chatPage_dialogue">
      {topicTitle && (
        <div className="chatPage_dialogue_header">
          <h3>{topicTitle}</h3>
          <p>{isMembersOnly ? 'Members only' : 'Open'}</p>
        </div>
      )}
      
      {!!threadData.length && threadData.map(post => <ChatPost post={post} />)}
    </section>
  )
};

export default Dialogue;
import React from 'react';

import ProfilePicture from './ProfilePicture';
import BoxLogo from './3BoxLogo';
import '../styles/index.scss';

const Topics = ({ topicList, handleAppModals, myProfile: { image }, myAddress, handleViewTopic }) => (
  <section className="topics">
    <div className="topics_nav">
      <BoxLogo />
      <ProfilePicture profilePicture={image} address={myAddress} />
    </div>
    <div className="topics_list">
      <p className="topics_list_header">
        TOPICS
      </p>
      <ul>
        {topicList && topicList.map(topic => <TopicOption topic={topic} handleViewTopic={handleViewTopic} />)}
      </ul>
    </div>
    <button onClick={() => handleAppModals('NewTopicModal')}>
      New Topic
    </button>
  </section>
);

export default Topics;

const TopicOption = ({ topic, handleViewTopic }) => (
  <li>
    <button
      className="textButton"
      onClick={() => handleViewTopic(topic)}
    >
      <h3>
        {topic}
      </h3>
    </button>
  </li>
)
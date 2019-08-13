import React from 'react';

import ProfilePicture from './ProfilePicture';
import BoxLogo from './3BoxLogo';
import '../styles/index.scss';

const Topics = (props) => {
  const {
    topicList,
    handleAppModals,
    myProfile: { image, name },
    myAddress,
    handleViewTopic,
    topicTitle
  } = props;

  return (
    <section className="topics">
      <div className="topics_nav">
        <BoxLogo />
        <a href={`https://3box.io/${myAddress}`} target="_blank" rel="noopener noreferrer">
          <ProfilePicture myProfilePicture={image} myAddress={myAddress} myName={name} />
        </a>
      </div>

      <div className="topics_list">
        <p className="topics_list_header">
          TOPICS
        </p>
        <ul>
          {topicList && topicList.map(topic => (
            <TopicOption
              topic={topic}
              handleViewTopic={handleViewTopic}
              isCurrentTopic={topicTitle === topic}
            />
          ))}
        </ul>
      </div>

      <button
        onClick={() => handleAppModals('NewTopicModal')}
        className="topics_newTopic"
      >
        Create Topic
      </button>
    </section>
  )
};

export default Topics;

const TopicOption = ({ topic, handleViewTopic, isCurrentTopic }) => (
  <li>
    <button
      className="textButton"
      onClick={() => handleViewTopic(topic)}
    >
      <h3 className={`${isCurrentTopic ? 'isCurrentTopic' : ''}`}>
        {topic}
      </h3>
    </button>
  </li>
);
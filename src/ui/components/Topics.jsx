import React from 'react';

import BoxLogo from './3BoxLogo';
import '../styles/index.scss';

const Topics = ({ topicList, handleAppModals }) => (
  <section className="topics">
    <div className="topics_nav">
      <BoxLogo />
      <img src="" alt="profile" className="topics_nav_profile" />
    </div>
    <div className="topics_list">
      <p>
        Topics
      </p>
      <ul>

      </ul>
    </div>
    <button onClick={() => handleAppModals('NewTopicModal')}>
      New Topic
    </button>
  </section>
);

export default Topics;

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
  NewTopicModal,
  ModalBackground,
} from '../components/Modals';

const AppModals = (props) => {
  const {
    showNewTopicModal,
    handleAppModals,
    handleCreateTopic,
    isTopicOpen,
    isTopicClosed
  } = props;

  return (
    <ReactCSSTransitionGroup
      transitionName="app_modals"
      transitionEnterTimeout={150}
      transitionLeaveTimeout={150}
    >
      {showNewTopicModal && (
        <NewTopicModal
          handleAppModals={handleAppModals}
          handleCreateTopic={handleCreateTopic}
          isTopicOpen={isTopicOpen}
          isTopicClosed={isTopicClosed}
          key="NewTopicModal"
        />
      )}

      {(showNewTopicModal)
        && <ModalBackground />}

    </ReactCSSTransitionGroup>
  )
};

export default AppModals;

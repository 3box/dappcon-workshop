import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
  ModalBackground,
  NewTopicModal,
  AddNewModeratorModal,
  AddNewMemberModal,
} from '../components/Modals';

const AppModals = (props) => {
  const {
    showNewTopicModal,
    handleAppModals,
    handleCreateTopic,
    isTopicOpen,
    isTopicClosed,
    showAddNewModeratorModal,
    showAddNewMemberModal
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

      {showAddNewModeratorModal && (
        <AddNewModeratorModal
          handleAppModals={handleAppModals}
          // handleCreateTopic={handleCreateTopic}
          key="AddNewModeratorModal"
        />
      )}

      {showAddNewMemberModal && (
        <AddNewMemberModal
          handleAppModals={handleAppModals}
          key="AddNewMemberModal"
        />
      )}

      {(showNewTopicModal
        || showAddNewModeratorModal
        || showAddNewMemberModal
      ) && <ModalBackground />}

    </ReactCSSTransitionGroup>
  )
};

export default AppModals;

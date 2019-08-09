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
    isMembersOnly,
    showAddNewModeratorModal,
    showAddNewMemberModal,
    topicName,
    handleFormChange,
    addThreadMod,
    threadMod,
    threadMember,
    addThreadMember
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
          handleFormChange={handleFormChange}
          isMembersOnly={isMembersOnly}
          topicName={topicName}
          key="NewTopicModal"
        />
      )}

      {showAddNewModeratorModal && (
        <AddNewModeratorModal
          handleFormChange={handleFormChange}
          handleAppModals={handleAppModals}
          addThreadMod={addThreadMod}
          threadMod={threadMod}
          key="AddNewModeratorModal"
        />
      )}

      {showAddNewMemberModal && (
        <AddNewMemberModal
          handleFormChange={handleFormChange}
          addThreadMember={addThreadMember}
          handleAppModals={handleAppModals}
          threadMember={threadMember}
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

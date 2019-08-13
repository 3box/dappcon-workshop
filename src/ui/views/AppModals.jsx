import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
  ModalBackground,
  NewTopicModal,
  AddNewModeratorModal,
  AddNewMemberModal,
} from '../components/Modals';

class AppModals extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleCreateTopic = () => {
    const {
      topicName,
      isMembersOnly,
      topicManager,
    } = this.props;

    if (!topicName) {
      this.setState({ newTopicError: 'No topic name set!' });
      return;
    }

    topicManager.claimTopic(topicName, isMembersOnly, (err, res) => {
      if (err) {
        this.setState({ newTopicError: err });
        return
      }
      this.addToTopicList(topicName);
    });
    this.handleAppModals('NewTopicModal');
  }

  render() {
    const {
      showNewTopicModal,
      handleAppModals,
      isMembersOnly,
      showAddNewModeratorModal,
      showAddNewMemberModal,
      topicName,
      handleFormChange,
      handleAddThreadMod,
      threadMod,
      threadMember,
      handleAddThreadMember
    } = this.props;

    return (
      <ReactCSSTransitionGroup
        transitionName="app_modals"
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}
      >
        {showNewTopicModal && (
          <NewTopicModal
            handleAppModals={handleAppModals}
            handleCreateTopic={this.handleCreateTopic}
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
            handleAddThreadMod={handleAddThreadMod}
            threadMod={threadMod}
            key="AddNewModeratorModal"
          />
        )}

        {showAddNewMemberModal && (
          <AddNewMemberModal
            handleFormChange={handleFormChange}
            handleAddThreadMember={handleAddThreadMember}
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
    );
  }
}

export default AppModals;

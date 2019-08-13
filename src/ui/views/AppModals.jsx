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
      handleAppModals,
      addToTopicList,
      handleFormChange
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
      addToTopicList(topicName);
    });
    handleFormChange(null, 'topicName');
    handleAppModals('NewTopicModal');
  }

  handleAddThreadMember = async () => { // interface value
    const {
      activeTopic,
      threadMember,
      updateThreadCapabilities,
      handleFormChange,
      updateThreadError,
      handleAppModals
    } = this.props;

    try {
      await activeTopic.addMember(threadMember);
      updateThreadCapabilities();
      handleFormChange(null, 'threadMember');
      handleAppModals('AddNewMemberModal');
    } catch (error) {
      console.log('error', error);
      updateThreadError(error);
    }
  }

  handleAddThreadMod = async () => { // interface value
    const {
      activeTopic,
      threadMod,
      handleFormChange,
      updateThreadCapabilities,
      updateThreadError,
      handleAppModals
    } = this.props;

    try {
      await activeTopic.addModerator(threadMod);
      console.log('after')
      updateThreadCapabilities();
      handleFormChange(null, 'threadMod');
      handleAppModals('AddNewModeratorModal');
    } catch (error) {
      console.log('error', error);
      updateThreadError(error);
    }
  };

  render() {
    const {
      showNewTopicModal,
      handleAppModals,
      isMembersOnly,
      showAddNewModeratorModal,
      showAddNewMemberModal,
      topicName,
      handleFormChange,
      threadMod,
      threadMember,
    } = this.props;

    return (
      <ReactCSSTransitionGroup
        transitionName="app_modals"
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}
      >
        {showNewTopicModal && (
          <NewTopicModal
            handleCreateTopic={this.handleCreateTopic}
            handleAppModals={handleAppModals}
            handleFormChange={handleFormChange}
            isMembersOnly={isMembersOnly}
            topicName={topicName}
            key="NewTopicModal"
          />
        )}

        {showAddNewModeratorModal && (
          <AddNewModeratorModal
            handleAddThreadMod={this.handleAddThreadMod}
            handleFormChange={handleFormChange}
            handleAppModals={handleAppModals}
            threadMod={threadMod}
            key="AddNewModeratorModal"
          />
        )}

        {showAddNewMemberModal && (
          <AddNewMemberModal
            handleAddThreadMember={this.handleAddThreadMember}
            handleFormChange={handleFormChange}
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

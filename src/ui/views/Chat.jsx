import React, { Component } from 'react';

import Topics from '../components/Topics';
import Dialogue from '../components/Dialogue';
import Members from '../components/Members';
import AppModals from './AppModals';
import '../styles/index.scss';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTopic: {},
      openTopics: {},
      threadMemberList: [],
      threadModeratorList: [],
      threadData: [],
      topicTitle: '',
      newTopicError: '',
      threadACError: '',
      topicError: '',
      postMsg: '',
      topicName: '',
      threadMember: '',
      threadMod: '',
      showNewTopicModal: false,
      showAddNewModeratorModal: false,
      showAddNewMemberModal: false,
      isMembersOnly: false,
    };
  }

  handleAppModals = (modalName) => {
    const modalStateName = `show${modalName}`;
    const modalState = this.state[modalStateName];
    this.setState({ [modalStateName]: !modalState });
  }

  handleViewTopic = (topic) => {
    const { openTopics } = this.state;
    const { chanSpace, topicManager } = this.props;

    this.setState({ topicTitle: topic });

    if (openTopics[topic]) {
      this.setState({ activeTopic: openTopics[topic] });
      this.updateThreadPosts()
      this.updateThreadCapabilities()
      return
    }

    topicManager.getOwner(topic, (err, owner) => {
      topicManager.getMembers(topic, async (err, members) => {
        if (!chanSpace) {
          this.setState({ topicError: 'Not fully logged in, try again in a moment' });
          return
        }

        const thread = await chanSpace.joinThread(topic, { firstModerator: owner, members });
        openTopics[topic] = thread;
        this.setState({ activeTopic: openTopics[topic] });

        thread.onUpdate(() => {
          this.updateThreadPosts();
        });

        thread.onNewCapabilities(() => {
          this.updateThreadCapabilities();
        });

        this.updateThreadPosts();
        this.updateThreadCapabilities();
      })
    })
  }

  updateThreadPosts = async () => {
    const { activeTopic } = this.state;
    this.updateThreadError();

    let threadData = [];
    const posts = await activeTopic.getPosts();
    posts.map(post => threadData.push(post))
    this.setState({ threadData });
  }

  updateThreadCapabilities = async () => {
    const { activeTopic } = this.state;
    let threadMemberList = [];
    if (activeTopic._members) {
      const members = await activeTopic.listMembers();
      members.map(member => threadMemberList.push(member));
    };
    this.setState({ threadMemberList });

    let threadModeratorList = [];
    const moderators = await activeTopic.listModerators();
    moderators.map(moderator => threadModeratorList.push(moderator));
    this.setState({ threadModeratorList });
  }

  updateThreadError = (e = '') => {
    this.setState({ threadACError: e });
  }

  postThread = async () => {
    const { activeTopic, postMsg } = this.state;
    try {
      await activeTopic.post(postMsg);
      this.setState({ postMsg: '' });
    } catch (error) {
      this.updateThreadError(error);
    }
  }

  handleFormChange = (e, property) => {
    const value = e ? e.target.value : '';
    this.setState({ [property]: value });
  }

  render() {
    const {
      showNewTopicModal,
      isMembersOnly,
      showAddNewModeratorModal,
      showAddNewMemberModal,
      topicTitle,
      threadData,
      threadMemberList,
      openTopics,
      postMsg,
      topicName,
      threadMod,
      threadMember,
      threadModeratorList,
      activeTopic
    } = this.state;

    const {
      myAddress,
      myProfile,
      myDid,
      topicList,
      topicManager,
      addToTopicList
    } = this.props;

    console.log('activeTopic', activeTopic);

    return (
      <React.Fragment>
        <AppModals
          showNewTopicModal={showNewTopicModal}
          showAddNewModeratorModal={showAddNewModeratorModal}
          showAddNewMemberModal={showAddNewMemberModal}

          isMembersOnly={isMembersOnly}
          topicName={topicName}
          threadMod={threadMod}
          threadMember={threadMember}
          topicManager={topicManager}
          addToTopicList={addToTopicList}
          activeTopic={activeTopic}

          handleAppModals={this.handleAppModals}
          handleFormChange={this.handleFormChange}
          updateThreadCapabilities={this.updateThreadCapabilities}
          updateThreadError={this.updateThreadError}
        />

        <div className="chatPage">
          <Topics
            handleAppModals={this.handleAppModals}
            handleViewTopic={this.handleViewTopic}
            myProfile={myProfile}
            topicList={topicList}
            myAddress={myAddress}
            topicTitle={topicTitle}
          />

          <Dialogue
            topicTitle={topicTitle}
            threadData={threadData}
            openTopics={openTopics}
            myProfile={myProfile}
            postMsg={postMsg}
            activeTopic={activeTopic}
            myAddress={myAddress}
            myDid={myDid}
            handleFormChange={this.handleFormChange}
            postThread={this.postThread}
            updateThreadPosts={this.updateThreadPosts}
          />

          <Members
            activeTopic={activeTopic}
            topicTitle={topicTitle}
            handleAppModals={this.handleAppModals}
            threadMemberList={threadMemberList}
            threadModeratorList={threadModeratorList}
          />
        </div>
      </React.Fragment>
    );
  }
}
export default Chat;
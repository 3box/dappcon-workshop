import React, { Component } from 'react';
import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import Box from '3box';

import { TopicManagerABI } from './utils/constants';

import Cover from './ui/views/Cover';
import Chat from './ui/views/Chat';
import AppModals from './ui/views/AppModals';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      box: {},
      chanSpace: {},
      activeTopic: {},
      topicManager: {},
      openTopics: {},
      myProfile: {},
      topicList: [],
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
      isAppReady: false,
    };
  }

  componentDidMount() {
    const { box } = this.state;
    const { history } = this.props
    if (!box.public) history.push('/');
    this.setState({ isAppReady: true });
  }

  handleLogin = async () => {
    const { history } = this.props
    const addresses = await window.ethereum.enable();
    const myAddress = addresses[0];
    this.updateTopics();
    const box = await Box.openBox(myAddress, window.ethereum, {});
    const myProfile = await Box.getProfile(myAddress);
    const chanSpace = await box.openSpace('3chan');
    this.setState({ chanSpace, box, myProfile, myAddress });
    history.push('/chat');
    await new Promise((resolve, reject) => box.onSyncDone(resolve));
  }

  updateTopics = () => {
    const { topicManager } = this.state;

    let newTopicManager;
    if (!topicManager.topics) {
      newTopicManager = web3.eth.contract(TopicManagerABI).at('0x7f2210557974dD74A660CcC8e2D4233528fb54A4'); // eslint-disable-line
    } else {
      newTopicManager = topicManager;
    }

    const getTopics = (i, err, topic) => {
      if (err) return
      if (topic) this.addToTopicList(topic)
      newTopicManager.topics(i, getTopics.bind(getTopics, ++i));
      this.setState({ topicManager: newTopicManager });
    }

    getTopics(0);
  }

  addToTopicList = (topic) => {
    const { topicList } = this.state;
    const updatedTopicList = topicList.slice();
    updatedTopicList.push(topic);
    this.setState({ topicList: updatedTopicList });
  }

  handleCreateTopic = () => {
    const {
      topicName,
      isMembersOnly,
      topicManager,
    } = this.state
    // const name = topicName.value;

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

  handleAppModals = (modalName) => {
    const modalStateName = `show${modalName}`;
    const modalState = this.state[modalStateName];
    this.setState({ [modalStateName]: !modalState });
  }

  handleViewTopic = (topic) => {
    const { openTopics, topicManager, chanSpace } = this.state;
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
    // threadModeratorList.innerHTML += moderator + ' (mod)<br />'
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
    this.setState({ [property]: e.target.value });
  }

  deletePost = (el) => {
    const { activeTopic } = this.state;
    activeTopic.deletePost(el.id).then(res => {
      this.updateThreadPosts()
    }).catch(this.updateThreadError);
  }

  addThreadMember = async () => { // interface value
    const { activeTopic, threadMember } = this.state;
    console.log('activeTopic', activeTopic);
    console.log('threadMember', threadMember);
    try {
      await activeTopic.addMember(threadMember);
      this.updateThreadCapabilities();
      this.setState({ threadMember: '' });
    } catch (error) {
      this.updateThreadError(error);
    }
  }

  addThreadMod = async () => { // interface value
    const { activeTopic, threadMod } = this.state;
    try {
      await activeTopic.addModerator(threadMod);
      this.updateThreadCapabilities();
      this.setState({ threadMod: '' });
    } catch (error) {
      this.updateThreadError(error);
    }
  };

  syncComplete = (res) => {
    console.log('Sync Complete')
    this.updateProfileData(window.box)
  }

  render() {
    const {
      topicList,
      showNewTopicModal,
      isMembersOnly,
      showAddNewModeratorModal,
      showAddNewMemberModal,
      myProfile,
      myAddress,
      isAppReady,
      topicTitle,
      threadData,
      threadMemberList,
      openTopics,
      postMsg,
      topicName,
      threadMod,
      threadMember,
      threadModeratorList
    } = this.state;

    console.log(this.state);

    return (
      <div className="App">
        {isAppReady && (<React.Fragment>
          <AppModals
            showNewTopicModal={showNewTopicModal}
            showAddNewModeratorModal={showAddNewModeratorModal}
            showAddNewMemberModal={showAddNewMemberModal}
            isMembersOnly={isMembersOnly}
            topicName={topicName}
            threadMod={threadMod}
            threadMember={threadMember}
            handleAppModals={this.handleAppModals}
            handleCreateTopic={this.handleCreateTopic}
            handleFormChange={this.handleFormChange}
            addThreadMod={this.addThreadMod}
            addThreadMember={this.addThreadMember}
          />

          <Switch>
            <Route
              exact
              path='/'
              render={() => <Cover handleLogin={this.handleLogin} />}
            />

            <Route
              exact
              path='/chat'
              render={() => (
                <Chat
                  topicList={topicList}
                  myProfile={myProfile}
                  myAddress={myAddress}
                  topicTitle={topicTitle}
                  threadData={threadData}
                  threadMemberList={threadMemberList}
                  threadModeratorList={threadModeratorList}
                  openTopics={openTopics}
                  postMsg={postMsg}
                  handleAppModals={this.handleAppModals}
                  handleViewTopic={this.handleViewTopic}
                  postThread={this.postThread}
                  handleFormChange={this.handleFormChange}
                />
              )}
            />
          </Switch>
        </React.Fragment>)}
      </div>
    );
  }
}

export default withRouter(App);

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
      threadMember: '',
      showNewTopicModal: false,
      showAddNewModeratorModal: false,
      showAddNewMemberModal: false,
      isTopicOpen: false,
      isTopicClosed: false,
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
      membersTopic,
      topicManager,
    } = this.state
    // const name = topicName.value;

    if (!topicName) {
      this.setState({ newTopicError: 'No topic name set!' });
      return;
    }

    topicManager.claimTopic(topicName, membersTopic, (err, res) => {
      if (err) {
        this.setState({ newTopicError: err });
        return
      }
      this.addToTopicList(topicName);
    })
  }

  handleAppModals = (modalName) => {
    const modalStateName = `show${modalName}`;
    const modalState = this.state[modalStateName];
    console.log('modalStateName', modalStateName);
    console.log('modalState', modalState);
    this.setState({ [modalStateName]: !modalState });
  }

  handleViewTopic = (topic) => {
    const { openTopics, topicManager, chanSpace } = this.state;
    console.log('active', topic);
    this.setState({ topicTitle: topic });
    if (openTopics[topic]) {
      console.log('is open')
      this.setState({ activeTopic: openTopics[topic] });
      this.updateThreadData()
      this.updateThreadCapabilities()
      return
    }

    topicManager.getOwner(topic, (err, owner) => {
      topicManager.getMembers(topic, async (err, members) => {
        if (!chanSpace) {
          this.setState({ topicError: 'Not fully logged in, try again in a moment' });
          return
        }
        console.log('joining thread')
        const thread = await chanSpace.joinThread(topic, { firstModerator: owner, members });
        openTopics[topic] = thread;
        console.log('threadfetched', thread);
        this.setState({ activeTopic: openTopics[topic] });
        thread.onUpdate(() => {
          this.updateThreadData();
        });

        thread.onNewCapabilities(() => {
          this.updateThreadCapabilities();
        });

        this.updateThreadData();
        this.updateThreadCapabilities();
      })
    })
  }

  updateThreadData = async () => {
    const { activeTopic } = this.state;
    // threadData.innerHTML = ''
    this.updateThreadError();
    let threadData = [];
    const posts = await activeTopic.getPosts();
    posts.map(post => threadData.push(post))
    // threadData.innerHTML += post.author + ': <br />' + post.message + '<br /><br />'
    // threadData.innerHTML += `<button id="` + post.postId + `"onClick="window.deletePost(` + post.postId + `)" type="button" class="btn btn btn-primary" >Delete</button>` + '<br /><br />'
    this.setState({ threadData });
  }

  updateThreadCapabilities = async () => {
    const { activeTopic } = this.state;
    let threadMemberList = [];
    if (activeTopic._members) {
      const members = await activeTopic.listMembers();
      members.map(member => threadMemberList.push(member));
      // threadMemberList.innerHTML += member + '<br />'
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

  updateProfile = async (id) => {
    const profile = await Box.getProfile(id);
    console.log(profile);
  }

  postThread = () => {
    const { activeTopic, postMsg } = this.state;
    activeTopic.post(postMsg).catch(this.updateThreadError)
  }

  deletePost = (el) => {
    const { activeTopic } = this.state;
    activeTopic.deletePost(el.id).then(res => {
      this.updateThreadData()
    }).catch(this.updateThreadError);
  }

  addThreadMember = () => { // interface value
    const { activeTopic, threadMember } = this.state;
    const id = threadMember;
    activeTopic.addMember(id).then(res => {
      this.updateThreadCapabilities()
    }).catch(this.updateThreadError)
  }

  addThreadMod = () => { // interface value
    const { activeTopic, threadMod } = this.state;
    const id = threadMod;
    activeTopic.addModerator(id).then(res => {
      this.updateThreadCapabilities()
    }).catch(this.updateThreadError)
  };

  syncComplete = (res) => {
    console.log('Sync Complete')
    this.updateProfileData(window.box)
  }

  render() {
    const {
      topicList,
      showNewTopicModal,
      isTopicOpen,
      isTopicClosed,
      showAddNewModeratorModal,
      showAddNewMemberModal,
      myProfile,
      myAddress,
      isAppReady,
      topicTitle,
      threadData,
      threadMemberList,
      openTopics,
    } = this.state;

    console.log(this.state);

    return (
      <div className="App">
        {isAppReady && (<React.Fragment>
          <AppModals
            showNewTopicModal={showNewTopicModal}
            showAddNewModeratorModal={showAddNewModeratorModal}
            showAddNewMemberModal={showAddNewMemberModal}
            isTopicOpen={isTopicOpen}
            isTopicClosed={isTopicClosed}
            handleAppModals={this.handleAppModals}
            handleCreateTopic={this.handleCreateTopic}
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
                  openTopics={openTopics}
                  handleAppModals={this.handleAppModals}
                  handleViewTopic={this.handleViewTopic}
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

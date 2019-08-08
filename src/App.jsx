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
      topicManager: {},
      openTopics: {},
      topicList: [],
      threadMemberList: [],
      threadModeratorList: [],
      threadData: [],
      topicTitle: '',
      activeTopic: '',
      newTopicError: '',
      threadACError: '',
      topicError: '',
      postMsg: '',
      showNewTopicModal: false,
      showAddNewModeratorModal: false,
      showAddNewMemberModal: false,
      isTopicOpen: false,
      isTopicClosed: false,
    };
  }

  handleLogin = async () => {
    const { history } = this.props
    const addresses = await window.ethereum.enable();
    this.updateTopics();
    const box = await Box.openBox(addresses[0], window.ethereum, {});
    this.setState({ box });
    await new Promise((resolve, reject) => box.onSyncDone(resolve));
    const chanSpace = await box.openSpace('3chan');
    this.setState({ chanSpace });
    history.push('/chat');
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
    // topicList.innerHTML += topic
    // topicList.innerHTML += `   <button id="topic-` + topic + `" onClick="window.viewTopic('${topic}')" type="button" class="btn btn btn-primary" >View</button>` + '<br />'
    // create button for each topiclist
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

  viewTopic = (topic) => {
    const { openTopics, activeTopic, topicManager, chanSpace } = this.state;
    console.log('active', topic)
    this.setState({ topicTitle: topic });
    if (openTopics[topic]) {
      console.log('is open')
      this.setState({ activeTopic: openTopics[topic] });
      this.updateThreadData()
      this.updateThreadCapabilities()
      return
    }

    topicManager.getOwner(topic, (err, owner) => {
      topicManager.getMembers(topic, (err, members) => {
        if (!chanSpace) {
          this.setState({ topicError: 'Not fully logged in, try again in a moment' });
          return
        }
        console.log('joining thread')
        chanSpace.joinThread(topic, { firstModerator: owner, members }).then(thread => {
          openTopics[topic] = thread
          console.log(thread);
          this.setState({ activeTopic: openTopics[topic] });
          thread.onUpdate(() => {
            this.updateThreadData();
          })
          thread.onNewCapabilities(() => {
            this.updateThreadCapabilities();
          })
          this.updateThreadData();
          this.updateThreadCapabilities();
        })
      })
    })
  }

  updateThreadData = async () => {
    const { activeTopic } = this.state;
    // threadData.innerHTML = ''
    this.updateThreadError();
    let threadData;
    const posts = activeTopic.getPosts();
    posts.map(post => threadData.push(post))
    // threadData.innerHTML += post.author + ': <br />' + post.message + '<br /><br />'
    // threadData.innerHTML += `<button id="` + post.postId + `"onClick="window.deletePost(` + post.postId + `)" type="button" class="btn btn btn-primary" >Delete</button>` + '<br /><br />'
    this.setState({ threadData });
  }

  updateThreadCapabilities = async () => {
    const { activeTopic } = this.state;
    let threadMemberList;
    if (activeTopic._members) {
      const members = activeTopic.listMembers();
      members.map(member => threadMemberList.push(member));
      // threadMemberList.innerHTML += member + '<br />'
    };
    this.setState({ threadMemberList });

    let threadModeratorList;
    const moderators = activeTopic.listModerators();
    moderators.map(moderator => threadModeratorList.push(moderator));
    // threadModeratorList.innerHTML += moderator + ' (mod)<br />'
    this.setState({ threadModeratorList });
  }

  updateThreadError = (e = '') => {
    this.setState({ threadACError: e });
  }

  getProfileHtml = async (elementId, id) => {
    const profile = await window.Box.getProfile(id)
    console.log(profile);
  }

  postThread = () => {
    const { activeTopic, postMsg } = this.state;
    activeTopic.post(postMsg).catch(this.updateThreadError)
  }

  render() {
    const {
      topicList,
      showNewTopicModal,
      isTopicOpen,
      isTopicClosed,
      showAddNewModeratorModal,
      showAddNewMemberModal,
    } = this.state;

    return (
      <React.Fragment>
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
                handleAppModals={this.handleAppModals}
              />
            )}
          />
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(App);

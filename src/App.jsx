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
      topicList: [],
      newTopicError: '',
      showNewTopicModal: false,
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
    const { topicName, membersTopic } = this.state
    // const name = topicName.value;

    if (!topicName) {
      this.setState({ newTopicError: 'No topic name set!' });
      return
    }

    window.topicManager.claimTopic(topicName, membersTopic, (err, res) => {
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
    this.setState({ [modalStateName]: !modalState });
  }

  render() {
    const {
      topicList,
      showNewTopicModal,
      isTopicOpen,
      isTopicClosed,
    } = this.state;

    return (
      <React.Fragment>
        <AppModals
          showNewTopicModal={showNewTopicModal}
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

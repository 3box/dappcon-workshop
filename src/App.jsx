import React, { Component } from 'react';
import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
// Step 1 - import 3Box library here

import { TopicManagerABI } from './utils/constants';

import Cover from './ui/views/Cover';
import Chat from './ui/views/Chat';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      box: null,
      chatSpace: {},
      myAddress: '',
      myDid: '',
      myProfile: {},
      isAppReady: false,
      topicList: [],
      topicManager: {},
      disableLogin: false,
    };
  }

  componentDidMount() {
    const { box } = this.state;
    const { history } = this.props;

    // if you haven't openedBox, return to login
    if (!box) history.push('/');
    this.setState({ isAppReady: true });
  }

  handleLogin = async () => {
    const { history } = this.props;
    const addresses = await window.ethereum.enable();
    const myAddress = addresses[0];
    this.setState({ disableLogin: true });

    // fetch initial topics
    this.getChatContractAndTopics();

    // Step 1 - add getProfile call
    const myProfile = {}

    // Step 2 - authenticate user and space
    const box = 'authenticate 3box here'
    // await onSyncDone

    // open 3chat space
    const chatSpace = 'the chat space'
    const myDid = 'myDID'

    // set all to state and continue
    this.setState({ box, chatSpace, myDid, myProfile, myAddress });
    history.push('/chat');
  }

  // add topic to ui list
  addToTopicList = (topic) => {
    const { topicList } = this.state;
    const updatedTopicList = topicList.slice();
    updatedTopicList.push(topic);
    this.setState({ topicList: updatedTopicList });
  }


  getChatContractAndTopics = () => {
    const topicManager = web3.eth  // eslint-disable-line
      .contract(TopicManagerABI).at('0x3895697Ad108a9a9cFaB326808194A6b41479cbD');

    // get chat topics
    const getTopics = (i, err, topic) => {
      if (err) return
      if (topic) this.addToTopicList(topic)
      topicManager.topics(i, getTopics.bind(getTopics, ++i));
      this.setState({ topicManager });
    }

    getTopics(0);
  }

  render() {
    const {
      isAppReady,
      chatSpace,
      topicManager,
      topicList,
      myProfile,
      myAddress,
      myDid,
      disableLogin,
    } = this.state;

    return (
      <div className="App">
        {isAppReady && (<React.Fragment>

          <Switch>
            <Route
              exact
              path='/'
              render={() => <Cover handleLogin={this.handleLogin} disableLogin={disableLogin} />}
            />

            <Route
              exact
              path='/chat'
              render={() => (
                <Chat
                  chatSpace={chatSpace}
                  myProfile={myProfile}
                  myAddress={myAddress}
                  myDid={myDid}
                  topicList={topicList}
                  topicManager={topicManager}
                  addToTopicList={this.addToTopicList}
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

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
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      box: {},
      chanSpace: {},
      myAddress: '',
      myDid: '',
      myProfile: {},
      isAppReady: false,
      topicList: [],
      topicManager: {},
    };
  }

  componentDidMount() {
    const { box } = this.state;
    const { history } = this.props;

    // if you haven't openedBox, return to login
    if (!box.public) history.push('/');
    this.setState({ isAppReady: true });
  }

  handleLogin = async () => {
    const { history } = this.props
    const addresses = await window.ethereum.enable();
    const myAddress = addresses[0];

    // fetch initial topics
    this.getChatContractAndTopics();

    // get my box and profile
    const box = await Box.openBox(myAddress, window.ethereum, {});
    const myProfile = await Box.getProfile(myAddress);

    // open 3chat space
    const chanSpace = await box.openSpace('3chan');
    const myDid = chanSpace.DID;

    // set all to state and continue
    this.setState({ chanSpace, box, myProfile, myAddress, myDid });
    history.push('/chat');
    await new Promise((resolve, reject) => box.onSyncDone(resolve));
  }

  // add topic to ui list
  addToTopicList = (topic) => {
    const { topicList } = this.state;
    const updatedTopicList = topicList.slice();
    updatedTopicList.push(topic);
    this.setState({ topicList: updatedTopicList });
  }


  getChatContractAndTopics = () => { // this was changed, ask oed
    const topicManager = web3.eth  // eslint-disable-line
      .contract(TopicManagerABI).at('0x7f2210557974dD74A660CcC8e2D4233528fb54A4');

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
      chanSpace,
      topicManager,
      topicList,
      myProfile,
      myAddress,
      myDid
    } = this.state;

    return (
      <div className="App">
        {isAppReady && (<React.Fragment>

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
                  chanSpace={chanSpace}
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

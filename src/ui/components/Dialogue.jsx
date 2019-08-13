
import React, { Component } from 'react';

import ChatPost from './ChatPost';
import ProfilePicture from './ProfilePicture';
import SendIcon from '../../assets/Send.svg';
import '../styles/index.scss';

class Dialogue extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  deletePost = (postId) => {
    const { activeTopic, updateThreadPosts } = this.props;
    activeTopic.deletePost(postId).then(res => {
      updateThreadPosts()
    }).catch(this.updateThreadError);
  }

  render() {
    const {
      topicTitle,
      threadData,
      openTopics,
      handleFormChange,
      postThread,
      myAddress,
      myProfile,
      postMsg,
    } = this.props;
    const isMembersOnly = openTopics[topicTitle] && openTopics[topicTitle]._members;

    return (
      <section className="chatPage_dialogue">
        {topicTitle && (
          <div className="chatPage_dialogue_header">
            <h3>{topicTitle}</h3>
            <p>{isMembersOnly ? 'Members only' : 'Open'}</p>
          </div>
        )}

        <div className="chatPage_dialogue_posts">
          {!!threadData.length && threadData.map(post => (
            <ChatPost post={post} deletePost={this.deletePost} />
          ))}
        </div>

        {topicTitle && (
          <PostEntry
            handleFormChange={handleFormChange}
            postThread={postThread}
            myAddress={myAddress}
            myProfile={myProfile}
            postMsg={postMsg}
          />
        )}
      </section>
    );
  }
}

export default Dialogue;

const PostEntry = (props) => (
  <div className="postEntry">
    <div className="postEntry_image">
      <ProfilePicture
        profilePicture={props.myProfile.image}
        address={props.myAddress}
      />
    </div>

    <input
      name="website"
      type="text"
      className="edit__profile__value"
      value={props.postMsg}
      placeholder="Type your message here..."
      onChange={e => props.handleFormChange(e, 'postMsg')}
    />

    <div className="postEntry_image">
      <button onClick={props.postThread} className="textButton">
        <img src={SendIcon} alt="Send" />
      </button>
    </div>
  </div>
)
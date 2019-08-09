
import React from 'react';

import ChatPost from './ChatPost';
import '../styles/index.scss';
import ProfilePicture from './ProfilePicture';

const Dialogue = (props) => {
  const {
    handleLogin,
    topicTitle,
    threadData,
    openTopics,
    handleFormChange,
    postThread,
    myAddress,
    myProfile,
    postMsg,
  } = props;
  const isMembersOnly = openTopics[topicTitle] && openTopics[topicTitle]._members;

  return (
    <section className="chatPage_dialogue">
      {topicTitle && (
        <div className="chatPage_dialogue_header">
          <h3>{topicTitle}</h3>
          <p>{isMembersOnly ? 'Members only' : 'Open'}</p>
        </div>
      )}

      {!!threadData.length && threadData.map(post => <ChatPost post={post} />)}

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
  )
};

export default Dialogue;

const PostEntry = (props) => (
  <div className="postEntry">
    <ProfilePicture
      profilePicture={props.myProfile.image}
      address={props.myAddress}
    />
    <input
      name="website"
      type="text"
      className="edit__profile__value"
      value={props.postMsg}
      placeholder="Type your message here..."
      onChange={e => props.handleFormChange(e, 'postMsg')}
    />
    <button onClick={props.postThread}>
      Post
    </button>
  </div>
)
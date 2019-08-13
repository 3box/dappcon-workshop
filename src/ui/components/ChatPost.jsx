import React from 'react';

import { timeSince } from '../../utils/helpers';

import ProfilePicture from './ProfilePicture';
import Delete from '../../assets/Delete.png'
import '../styles/index.scss';


const ChatPost = (props) => {
  const {
    post: {
      author,
      message,
      postId,
      timestamp,
      deletePost
    }
  } = props;
  const isMyPost = author === author;

  return (
    <div key={postId} className="dialogue_post">
      <div className="dialogue_post_content">
        <ProfilePicture author={author} />
        <p>{message}</p>
      </div>
      <p>{timeSince(timestamp * 1000)}</p>

      {isMyPost && (
        <button
          className="textButton"
          onClick={() => deletePost(postId)}
        >
          <img
            src={Delete}
            alt="Delete"
            className="dialogue_post_delete"
          />
        </button>
      )}
    </div>
  )
}

export default ChatPost;
import React from 'react';

import { timeSince } from '../../utils/helpers';

import ProfilePicture from './ProfilePicture';
import Delete from '../../assets/Delete.png'
import '../styles/index.scss';

const ChatPost = (props) => {
  const {
    deletePost,
    post: {
      author,
      message,
      postId,
      timestamp,
    },
    myDid
  } = props;
  const isMyPost = author === myDid;

  return (
    <div key={postId} className="dialogue_post">
      <div className="dialogue_post_content">
        <div className="dialogue_post_content_profile">
          <ProfilePicture did={author} />
        </div>
        <p>{message}</p>
      </div>

      <div className="dialogue_post_context">
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
        <p>{timeSince(timestamp * 1000)}</p>
      </div>
    </div>
  )
}

export default ChatPost;
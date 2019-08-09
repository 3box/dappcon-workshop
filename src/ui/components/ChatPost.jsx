import React from 'react';
import ProfilePicture from './ProfilePicture';
import '../styles/index.scss';

import { timeSince } from '../../utils/helpers';

const ChatPost = (props) => {
  const { post: { author, message, postId, timestamp } } = props;

  return (
    <div key={postId} className="dialogue_post">
      <div className="dialogue_post_content">
        <ProfilePicture author={author} />
        <p>{message}</p>
      </div>
      <p>{timeSince(timestamp * 1000)}</p>
    </div>
  )
}

export default ChatPost;
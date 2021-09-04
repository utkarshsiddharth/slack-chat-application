import moment from 'moment';
import React from 'react';
import {
  Comment,
  CommentAuthor,
  CommentAvatar,
  CommentContent,
  CommentMetadata,
  CommentText,
  Image,
} from 'semantic-ui-react';

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message__self' : '';
};

const timeFromNow = (timestamp) => {
  return moment(timestamp).fromNow();
};

const isImage = (message) => {
  return !!message.image && !!!message.content;
};

const Message = ({ message, user }) => {
  return (
    <Comment>
      <CommentAvatar src={message.user.avatar} />
      <CommentContent className={isOwnMessage(message, user)}>
        <CommentAuthor as='a'>{message.user.name}</CommentAuthor>
        <CommentMetadata>{timeFromNow(message.timestamps)}</CommentMetadata>
        {isImage(message) ? (
          <Image src={message.image} className='message__image' />
        ) : (
          <CommentText>{message.content}</CommentText>
        )}
      </CommentContent>
    </Comment>
  );
};

export default Message;

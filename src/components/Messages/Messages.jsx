import React, { Component } from 'react';
import { Fragment } from 'react';
import { CommentGroup, Segment } from 'semantic-ui-react';
import MessageForm from './MessageForm';

import firebase from '../../utils/firebase';

// component //
import MessagesHeader from './MessagesHeader';
import Message from './Message';

export default class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    currentChannel: this.props.currentChannel,
    currentUser: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
  };
  componentDidMount = () => {
    const { currentChannel, currentUser } = this.state;
    if (currentChannel && currentUser) {
      this.addListners(currentChannel.id);
    }
  };

  addListners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addMessageListener = (id) => {
    let loadedMessages = [];
    this.state.messagesRef.child(id).on('child_added', (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} User${plural ? 's' : ''}`;
    this.setState({ numUniqueUsers });
  };

  displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Fragment>
        <Message
          key={message.timestamp}
          message={message}
          user={this.state.currentUser}
        />
      </Fragment>
    ));
  displayChannelName = (channel) => (channel ? `# ${channel.name}` : '');

  handleSearchChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }

      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  render() {
    const {
      messagesRef,
      currentChannel,
      currentUser,
      messages,
      messagesLoading,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          channelName={this.displayChannelName(currentChannel)}
          searchLoading={searchLoading}
        />
        <Segment>
          <CommentGroup className='messages'>
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </CommentGroup>
        </Segment>

        {/* form */}
        <MessageForm
          currentUser={currentUser}
          currentChannel={currentChannel}
          messagesRef={messagesRef}
        />
      </Fragment>
    );
  }
}

import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

// sidebar //
import Channels from './Channels';
import UserPanel from './UserPanel';
import DirectMessages from './DirectMessages';

export default class SidePanel extends Component {
  render() {
    const { currentUser } = this.props;
    return (
      <>
        <Menu
          size='large'
          inverted
          fixed='left'
          vertical
          style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
        >
          <UserPanel currentUser={currentUser} />
          <Channels currentUser={currentUser} />
          <DirectMessages />
        </Menu>
      </>
    );
  }
}

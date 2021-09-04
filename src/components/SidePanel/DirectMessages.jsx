import React from 'react';
import { Component } from 'react';

import { Menu, Icon, MenuMenu, MenuItem } from 'semantic-ui-react';

class DirectMessages extends Component {
  state = {
    user: [],
  };
  render() {
    const { user } = this.state;
    return (
      <MenuMenu>
        <MenuItem>
          <span>
            <Icon name='mail' /> Direct Messages
          </span>{' '}
          ({user.length})
        </MenuItem>
        {/* users to send direct messages */}
      </MenuMenu>
    );
  }
}

export default DirectMessages;

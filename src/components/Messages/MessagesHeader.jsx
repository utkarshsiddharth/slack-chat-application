import React, { Component } from 'react';
import {
  HeaderSubheader,
  Icon,
  Input,
  Segment,
  Header,
} from 'semantic-ui-react';

class MessagesHeader extends Component {
  render() {
    const { channelName, numUniqueUsers, handleSearchChange, searchLoading } =
      this.props;
    return (
      <Segment clearing>
        {/* channel search title */}
        <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            <Icon name={'star outline'} color='black' />
          </span>
          <HeaderSubheader>{numUniqueUsers}</HeaderSubheader>
        </Header>
        {/* channel search input */}
        <Header floated='right'>
          <Input
            loading={searchLoading}
            onChange={handleSearchChange}
            size='mini'
            icon='search'
            name='searchTer'
            placeholder='Search Messages'
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;

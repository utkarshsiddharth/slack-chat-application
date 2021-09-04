import React, { Component } from 'react';
import {
  Dropdown,
  Grid,
  GridColumn,
  GridRow,
  Header,
  HeaderContent,
  Icon,
  Image,
} from 'semantic-ui-react';
import firebase from '../../utils/firebase';

import { connect } from 'react-redux';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
  };
  // componentDidMount() {
  //   console.log(this.props.currentUser);
  //   this.setState({
  //     user: this.props.currentUser,
  //   });
  // }

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out!!'))
      .catch((err) => console.error(err));
  };
  dropDownOptions = () => [
    {
      text: (
        <span>
          Signed in as{' '}
          <strong>{this.state.user && this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
      key: 'user',
    },
    {
      text: <span>Change Avatar</span>,
      key: 'avatar',
    },
    {
      text: <span onClick={this.handleSignout}>Sign Out</span>,
      key: 'signout',
    },
  ];
  render() {
    const { user } = this.state;
    return (
      <Grid style={{ background: '#4c3c4c' }}>
        <GridColumn>
          <GridRow style={{ padding: '1.2em', margin: 0 }}>
            {/* App Header */}
            <Header inverted floated='left' as='h2'>
              <Icon name='code'></Icon>
              <HeaderContent>DevChat</HeaderContent>
            </Header>

            {/* User Dropdown */}
            <Header style={{ padding: '0.25em' }} as='h4' inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user && user.photoURL} avatar spaced='right' />
                    {user && user.displayName}
                  </span>
                }
                options={this.dropDownOptions()}
              />
            </Header>
          </GridRow>
        </GridColumn>
      </Grid>
    );
  }
}

export default UserPanel;

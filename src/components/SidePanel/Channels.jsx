import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Menu,
  MenuItem,
  MenuMenu,
  Icon,
  Modal,
  ModalHeader,
  ModalContent,
  Form,
  FormField,
  Input,
  ModalActions,
  Button,
} from 'semantic-ui-react';

import firebase from '../../utils/firebase';
import { setCurrentChannel } from '../../actions/index';

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDetail: '',
    modal: false,
    channelRef: firebase.database().ref('channles'),
    firstLoad: true,
    activeChannel: '',
  };

  componentDidMount = () => {
    this.addListners();
  };

  addListners = () => {
    let loadedChannels = [];
    this.state.channelRef.on('child_added', (snap) => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length) {
      this.props.setCurrentChannel(this.state.channels[0]);
      this.setState({ activeChannel: this.state.channels[0].id });
    }
    this.setState({ firstLoad: false });
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  isFormValid = ({ channelName, channelDetail }) => {
    return channelName && channelDetail ? true : false;
  };

  addChannle = () => {
    const { channelRef, channelDetail, channelName, user } = this.state;

    const key = channelRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetail,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };
    channelRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetail: '' });
        this.closeModal();
        console.log('channel added');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <MenuItem
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </MenuItem>
    ));

  openModal = () => {
    this.setState({ modal: true });
  };
  closeModal = () => {
    this.setState({ modal: false });
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  render() {
    const { channels, modal } = this.state;
    return (
      <>
        <MenuMenu className='menu'>
          <MenuItem style={{ marginBottom: 10 }}>
            <span>
              <Icon name='exchange' /> CHANNELS
            </span>{' '}
            ({channels.length}) <Icon name='add' onClick={this.openModal} />
          </MenuItem>
          {/* all channels */}
          {this.displayChannels(channels)}
        </MenuMenu>
        <Modal basic open={modal} onClose={this.closeModal}>
          <ModalHeader>Add a Channel</ModalHeader>
          <ModalContent>
            <Form onSubmit={this.handleSubmit}>
              <FormField>
                <Input
                  fluid
                  label='Name of Channel'
                  name='channelName'
                  onChange={this.handleChange}
                />
              </FormField>
              <FormField>
                <Input
                  fluid
                  label='About the Channel'
                  name='channelDetail'
                  onChange={this.handleChange}
                />
              </FormField>
            </Form>
          </ModalContent>
          {/* action */}
          <ModalActions>
            <Button color='green' inverted onClick={this.handleSubmit}>
              <Icon name='checkmark' /> Add
            </Button>

            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </ModalActions>
        </Modal>
      </>
    );
  }
}

export default connect(null, { setCurrentChannel })(Channels);

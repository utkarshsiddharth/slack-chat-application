import React, { Component } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, ButtonGroup, Input, Segment } from 'semantic-ui-react';

import firebase from '../../utils/firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

export default class MessageForm extends Component {
  state = {
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    modal: false,
    uploadState: '',
    uploadedTask: null,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0,
  };

  createMessage = (fileURL = null) => {
    const {
      user: { uid, displayName, photoURL },
    } = this.state;

    const messageBody = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: uid,
        name: displayName,
        avatar: photoURL,
      },
    };
    if (fileURL !== null) {
      messageBody['image'] = fileURL;
    } else {
      messageBody['content'] = this.state.message;
    }
    return messageBody;
  };

  sendFileMessage = (fileURL, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileURL))
      .then(() => {
        this.setState({ uploadState: 'done' });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ errors: this.state.errors.concat(err) });
      });
  };

  uploadFile = (file, metaData, fileType) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuid()}.${fileType}`;
    this.setState(
      {
        uploadState: 'uploading',
        uploadedTask: this.state.storageRef.child(filePath).put(file, metaData),
      },
      () => {
        this.state.uploadedTask.on(
          'state_change',
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: 'error',
              uploadedTask: null,
            });
          },
          () => {
            this.state.uploadedTask.snapshot.ref
              .getDownloadURL()
              .then((downloadURL) => {
                this.sendFileMessage(downloadURL, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: 'error',
                  uploadedTask: null,
                });
              });
          }
        );
      }
    );
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;
    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.contact(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' }),
      });
    }
  };
  render() {
    const { message, errors, loading, modal, uploadState, percentUploaded } =
      this.state;
    return (
      <Segment className='message__form'>
        <Input
          fluid
          style={{ marginBottom: '0.7em' }}
          label={<Button icon={'add'} />}
          placeholder='Write Your Message'
          name='message'
          value={message}
          onChange={this.handleChange}
          className={errors.length > 0 ? 'error' : ''}
        />
        <ButtonGroup icon width='2'>
          <Button
            color='orange'
            content='Add Reply'
            labelPosition='left'
            icon='edit'
            onClick={this.sendMessage}
            disable={`${loading}`}
          />
          <Button
            color='teal'
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
            onClick={this.openModal}
          />
        </ButtonGroup>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          disable={uploadState === 'uploading'}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

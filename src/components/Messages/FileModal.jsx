import React, { Component } from 'react';
import {
  Modal,
  ModalActions,
  ModalContent,
  ModalHeader,
  Button,
  Icon,
  Input,
} from 'semantic-ui-react';
import mime from 'mime-types';

export default class FileModal extends Component {
  state = {
    file: null,
    autorized: ['image/jpeg', 'image/png', 'image/jpg'],
  };

  isAuthorized = (name) => this.state.autorized.includes(mime.lookup(name));

  addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  clearFile = () => {
    this.setState({ file: null });
  };

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;
    const fileType = mime.lookup(file.name).split('/')[1];
    if (file != null) {
      if (this.isAuthorized(file.name)) {
        const metaData = { contentType: mime.lookup(file.name) };
        uploadFile(file, metaData, fileType);
        closeModal();
        this.clearFile();
      }
    }
  };

  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal basic open={modal} onClose={closeModal}>
        <ModalHeader>
          Select An Images
          <ModalContent>
            <Input
              fluid
              label='File type: jpg, png, jpeg'
              name='file'
              type='file'
              onChange={this.addFile}
            />
          </ModalContent>
          <ModalActions>
            <Button onClick={this.sendFile} color='green' inverted>
              <Icon name='checkmark' /> Send
            </Button>
            <Button color='red' inverted onClick={closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </ModalActions>
        </ModalHeader>
      </Modal>
    );
  }
}

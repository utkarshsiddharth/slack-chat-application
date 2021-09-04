import React, { Component } from 'react';
// import { Loader, Dimmer } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

export default class Spinner extends Component {
  render() {
    return (
      // <Dimmer>
      //   <Loader size='huge' content={'Preparing The Chat'} />
      //   <h1>Loading!!</h1>
      // </Dimmer>
      <div style={loaderStyles}>
        <Loader
          type='Puff'
          color='#00BFFF'
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      </div>
    );
  }
}

// styles //
const loaderStyles = {
  backgroundColor: '#212121',
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

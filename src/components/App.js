import React from 'react';
import { connect } from 'react-redux';
import { Grid, GridColumn } from 'semantic-ui-react';
import './App.css';

// css //
import ColorPanel from './ColorPanel/ColorPanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import SidePanel from './SidePanel/SidePanel';

const App = ({ currentUser, currentChannel }) => {
  return (
    <div>
      <Grid columns='equal' className='app' style={{ backgroundColor: '#eee' }}>
        <ColorPanel />
        <SidePanel
          key={currentUser && currentUser.uid}
          currentUser={currentUser}
        />
        <GridColumn style={{ marginLeft: 320 }}>
          <Messages
            key={currentChannel && currentChannel.id}
            currentUser={currentUser}
            currentChannel={currentChannel}
          />
        </GridColumn>
        <GridColumn width={4}>
          <MetaPanel />
        </GridColumn>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps, {})(App);

import React, { Component } from 'react';
import { Divider, Menu, Sidebar, Button, Icon } from 'semantic-ui-react';

export default class ColorPanel extends Component {
  render() {
    return (
      <Sidebar as={Menu} inverted vertical visible width='very thin'>
        <Divider />
        <Button icon='add' size='small' color='blue' />
      </Sidebar>
    );
  }
}

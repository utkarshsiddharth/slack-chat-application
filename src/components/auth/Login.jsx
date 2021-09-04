import React, { Component } from 'react';
import firebase from '../../utils/firebase';
import {
  Grid,
  Form,
  Header,
  Message,
  Icon,
  Segment,
  Button,
  GridColumn,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  };

  displayErrors = (errors) =>
    errors.map((err, index) => <p key={index}>{err.message}</p>);

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.isFormValid(this.state)) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {})
        .catch((err) => {
          console.error(err.message);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
        });
    }
  };

  isFormValid = ({ email, password }) => email && password;

  handleInputError = (errors, type) => {
    return errors.some((error) => error.message.toLowerCase().includes(type))
      ? 'error'
      : '';
  };

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <>
        <Grid textAlign='center' verticalAlign='middle' className='app'>
          <GridColumn style={{ maxWidth: 450 }}>
            <Header as='h1' icon color='violet' textAlign='center'>
              <Icon name='code branch' color='violet' />
              Login For DevChat
            </Header>
            <Form onSubmit={this.handleSubmit} size='large'>
              <Segment stacked>
                <Form.Input
                  fluid
                  name='email'
                  icon='mail'
                  value={email}
                  iconPosition='left'
                  placeholder='Email'
                  onChange={this.handleChange}
                  type='email'
                  className={this.handleInputError(errors, 'email')}
                />
                <Form.Input
                  fluid
                  name='password'
                  icon='lock'
                  value={password}
                  iconPosition='left'
                  placeholder='Password'
                  onChange={this.handleChange}
                  type='password'
                  className={this.handleInputError(errors, 'password')}
                />

                <Button
                  className={loading ? 'loading' : ''}
                  disabled={loading}
                  color='violet'
                  fluid
                  size='large'
                >
                  Submit
                </Button>
              </Segment>
            </Form>
            {errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
            )}
            <Message>
              Don't have an account? <Link to='/login'>Login</Link>{' '}
            </Message>
          </GridColumn>
        </Grid>
      </>
    );
  }
}

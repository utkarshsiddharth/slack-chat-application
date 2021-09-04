import React, { Component } from 'react';
import firebase from '../../utils/firebase';
import md5 from 'md5';
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

export default class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    usersRef: firebase.database().ref('users'),
    errors: [],
    loading: false,
  };

  displayErrors = (errors) =>
    errors.map((err, index) => <p key={index}>{err.message}</p>);

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      // throw error //
      error = { message: 'Fill in all fields' };
      this.setState({ errors: errors.concat(error) });
      // should not execute handleSubmit //
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      // throw error //
      error = { message: 'Password is not valid' };
      this.setState({ errors: errors.concat(error) });
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirm }) => {
    // check if any of the string value has a length of 0 means empty, if empty return true //
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirm.length
    );
  };

  isPasswordValid = ({ password, passwordConfirm }) => {
    if (password.length < 6 || passwordConfirm.length < 6) {
      return false;
    }
    if (password !== passwordConfirm) {
      return false;
    }
    return true;
  };

  saveUser = (userCreated) => {
    return this.state.usersRef.child(userCreated.user.uid).set({
      name: userCreated.user.displayName,
      avatar: userCreated.user.photoURL,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((userCreated) => {
          console.log(userCreated);
          // set displayname and profile photo
          userCreated.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                userCreated.user.email
              )}?d=identicon`,
            })
            .then(() => {
              this.saveUser(userCreated).then(() => {
                console.log('user saved :>');
              });
              this.setState({ loading: false });
            })
            .catch((err) => {
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false,
              });
            });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
        });
    }
  };

  handleInputError = (errors, type) => {
    return errors.some((error) => error.message.toLowerCase().includes(type))
      ? 'error'
      : '';
  };

  render() {
    const { username, email, password, passwordConfirm, errors, loading } =
      this.state;
    return (
      <>
        <Grid textAlign='center' verticalAlign='middle' className='app'>
          <GridColumn style={{ maxWidth: 450 }}>
            <Header as='h1' icon color='orange' textAlign='center'>
              <Icon name='puzzle piece' color='orange' />
              Register For DevChat
            </Header>
            <Form onSubmit={this.handleSubmit} size='large'>
              <Segment stacked>
                <Form.Input
                  fluid
                  name='username'
                  icon='user'
                  value={username}
                  iconPosition='left'
                  placeholder='Username'
                  onChange={this.handleChange}
                  type='text'
                  className={this.handleInputError(errors, 'username')}
                />
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
                <Form.Input
                  fluid
                  name='passwordConfirm'
                  icon='repeat'
                  value={passwordConfirm}
                  iconPosition='left'
                  placeholder='Password Confirm'
                  onChange={this.handleChange}
                  type='password'
                  className={this.handleInputError(errors, 'password')}
                />

                <Button
                  className={loading ? 'loading' : ''}
                  disabled={loading}
                  color='orange'
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
              Already A User? <Link to='/login'>Login</Link>{' '}
            </Message>
          </GridColumn>
        </Grid>
      </>
    );
  }
}

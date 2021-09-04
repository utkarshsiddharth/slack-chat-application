import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';
import firebase from './utils/firebase';

// redux //
import { compose, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { setUser, clearUser } from './actions/index';

// compoenents //
import App from './components/App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import rootReducer from './reducers';
import Spinner from './components/Spinner';

// semantic ui css //
import 'semantic-ui-css/semantic.min.css';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
  componentDidMount() {
    console.log(this.props.isLoading);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.props.setUser(user);
        this.props.history.push('/');
      } else {
        console.log('clear user push to login');
        this.props.clearUser();
        this.props.history.push('/login');
      }
    });
  }
  render() {
    return this.props.isLoading ? (
      <Spinner loading={this.props.isLoading} />
    ) : (
      <Switch>
        <Route exact path='/' component={App} />

        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
});

const RootWithAuth = withRouter(
  connect(mapStateToProps, { setUser, clearUser })(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
);

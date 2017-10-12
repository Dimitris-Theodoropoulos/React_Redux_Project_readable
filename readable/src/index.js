import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import reducer from './reducers'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore } from 'redux-persist'
import { Router, Route, Switch } from 'react-router-dom';
import PostDetails from './components/PostDetails'
import history from './history';
import thunk  from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)


persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact={true} path='/' render={() => (<App focus='' />)} />
        <Route exact={true} path='/react' render={() => (<App focus='react' />)} />
        <Route exact={true} path='/redux' render={() => (<App focus='redux' />)} />
        <Route exact={true} path='/udacity' render={() => (<App focus='udacity' />)} />
        <Route exact={true} path='/react/:id' component={PostDetails} />
        <Route exact={true} path='/redux/:id' component={PostDetails} />
        <Route exact={true} path='/udacity/:id' component={PostDetails} />
      </Switch>
    </Router>
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();

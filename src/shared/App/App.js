// shared/App.js
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../routes';
import Navbar from '../Navbar';
import NoMatch from '../NoMatch';

import styles from './app.scss';

class App extends Component {
  render() {
    return (
      <div className={styles.wrapperTest}>
        <Navbar />

        <Switch>
          {routes.map(({ path, exact, component: C, ...rest }) => (
            <Route
              key={path}
              path={path}
              exact={exact}
              render={props => <C {...props} {...rest} />}
            />
          ))}
          <Route render={props => <NoMatch {...props} />} />
        </Switch>
      </div>
    );
  }
}

export default App;

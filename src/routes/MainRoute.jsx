import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { MainNav, Overlay, HomePage, RoomPage } from '../components';

const MainRoute = () => (
  <Switch key="switch">
    <Route path="/">
      <MainNav />
      <Overlay />
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/layer">
        <HomePage />
      </Route>
      <Route path="/room/:roomId">
        <RoomPage />
      </Route>
    </Route>
  </Switch>
);

export default MainRoute;

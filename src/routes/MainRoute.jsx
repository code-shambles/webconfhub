import React from "react";
import { Switch, Route } from "react-router-dom";

import { MainNav, Overlay, HomePage, RoomPage } from "../components";

const MainRoute = () => (
  <Switch key="switch">
    <Route path="/">
      <MainNav />
      <Overlay />
      <HomePage />
    </Route>
  </Switch>
);

export default MainRoute;

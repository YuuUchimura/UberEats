import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Restaurants } from "./containers/Restaurants";
import { Foods } from "./containers/Foods";
import { Orders } from "./containers/Orders";

const App = () => {
  return (
    <Router>
      <Switch>
        {/* 店舗一覧ページ */}
        <Route exact path="/restaurants">
          <Restaurants />
        </Route>
        {/* フード一覧ページ */}
        <Route
          exact
          path="/restaurants/:restaurantsId/foods"
          render={({ match }) => <Foods match={match} />}
        ></Route>
        {/* 注文ページ */}
        <Route exact path="/orders">
          <Orders />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;

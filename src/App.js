import React, { useState, useEffect } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import View from "./components/View";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <div>
      {currentUser && (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink activeClassName="active" to={"/dashboard"} className="nav-link">
                Dashboard
              </NavLink>
            </li>
          </div>

          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink activeClassName="active" to={"/view"} className="nav-link">
                View
              </NavLink>
            </li>
          </div>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Logout
              </a>
            </li>
          </div>
        </nav>
      )
      }

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/login"]} component={Login} />
          <Route exact path="/register" component={Register} /> Register
          <Route exact path="/view" component={View} /> View
          <Route path="/dashboard" component={Dashboard} /> Dashboard
        </Switch>
      </div>
    </div>
  );
};

export default App;
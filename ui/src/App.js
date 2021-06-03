import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import "./App.css";
import { Login, Signup, Root, Profile } from "./Components";

function App() {
  const [user, setUser] = React.useState({});
  
  const updateUser = (newUser) => {
    setUser(newUser);
  }

  return (
    <div>
      <div className="body">
        <Router>
          <Switch>
            <Route path="/login">
              <Login userUpdated={updateUser} />
            </Route>
            <Route path="/signup">
              <Signup userUpdated={updateUser} />
            </Route>
            <Route path="/profile">
              <Profile user={user} userUpdated={updateUser} />
            </Route>
            <Route path="/">
              <Root user={user} userUpdated={updateUser} />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;

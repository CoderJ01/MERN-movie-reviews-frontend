import React from 'react';

// use to create different routes to different components
import { Switch, Route, Link } from "react-router-dom"; 

import "bootstrap/dist/css/bootstrap.min.css";
import AddReview from './components/add-review';
import MoviesList from './components/movies-list';
import Movie from './components/movie';
import Login from './components/login';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function App() {
  // React.useState is a hook that allows for the addition of local state to functional component
  // useState returns an array with two values an a function that can be updated
  const [user, setUser] = React.useState(null);

  // set user state
  async function login(user = null) { // default user to null
    setUser(user);
  }

  // set user to null
  async function logout() {
    setUser(null)
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand><button onClick={callApi}>Movie Reviews</button></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              {/* Link allows routing to different components */}
              <Link to={"/movies"}>Movies</Link>
            </Nav.Link>
            <Nav.Link>
              { user ? (
                  // display if user is logged in
                  <a onClick={logout}>Logout User</a>
                ) : (
                  // display if user is logged out
                  <Link to={"/login"}>Login</Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
    <Switch>
      {/* use Switch component to switch between different routes */}
      <Route exact path={["/","/movies"]} component={MoviesList}>
      </Route>
      {/* show MoviesList component */}
      <Route path="/movies/:id/review" render={(props) => // render allow props to be passed
        <AddReview {...props} user={user} />}>
      </Route>
      {/* render Movie */}
      <Route path="/movie/:id/" render={(props) => 
        <Movie {...props} user={user} />}>
      </Route>
      {/* render Login  */}
      <Route path="/login" render={(props) => 
        <Login {...props} user={login} />}>
      </Route>
    </Switch>
    </div>
  );
}

function callApi() {
  fetch('https://mern-movie-reviews.herokuapp.com/', { 
    method: 'GET'
  })
    .then(data => data.json())
    .then(json => alert(JSON.stringify(json)))
}

export default App;
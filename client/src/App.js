import React, { Component } from 'react';
// import { Provider } from './components/Context';
import './App.css';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';

// Import components
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
// import CreateCourse from './components/CreateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';

// set up Context
import withContext from './components/Context';

const UserSignUpWithContext = withContext(UserSignUp);

export default class App extends Component {

  // constructor() {
  //   super();
  //   this.state = {
  //     courses: []
  //   };
  // }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="header">
            <div className="bounds">
                <h1 className="header--logo">Courses</h1>
                <nav>
                    <NavLink to="/signup" className="signup">Sign Up</NavLink>
                    <NavLink to="/signin" className="signin">Sign In</NavLink>
                </nav>
            </div>
          </div>
          <Switch>
            <Route exact path="/" component={Courses} />
            <Route path="/courses/:id" component={CourseDetail} />
            {/* <Route path="/courses/create" component={CreateCourse} /> */}
            <Route path="/signin" component={UserSignIn} />
            <Route path="/signup" component={UserSignUpWithContext} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
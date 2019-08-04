import React, { Component } from 'react';
// import { Provider } from './components/Context';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Import components
import Header from './components/Header';
import Authenticated from './components/Authenticated';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import NotFound from './components/NotFound';

import withContext from './components/Context';
import PrivateRoute from './PrivateRoute';

const HeaderWithContext = withContext(Header);
const AuthWithContext = withContext(Authenticated);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const CreateCourseWithContext = withContext(CreateCourse);

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
          <HeaderWithContext />

          <Switch>
            <Route exact path="/" component={Courses} />
            <PrivateRoute path="/authenticated" component={AuthWithContext} />
            <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
            <Route exact path="/courses/:id" component={CourseDetail} />
            <Route path="/signin" component={UserSignInWithContext} />
            <Route path="/signup" component={UserSignUpWithContext} />
            <Route path="/signout" component={UserSignOutWithContext} />
            <Route path="/error" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
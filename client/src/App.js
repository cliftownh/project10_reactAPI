import React, { Component } from 'react';
// import { Provider } from './components/Context';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Import components
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
// import CreateCourse from './components/CreateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import NotFound from './components/NotFound';

// set up Context
import withContext from './components/Context';

const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);

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
            <Route path="/courses/:id" component={CourseDetail} />
            {/* <Route path="/courses/create" component={CreateCourse} /> */}
            <Route path="/signin" component={UserSignInWithContext} />
            <Route path="/signup" component={UserSignUpWithContext} />
            <Route path="/error" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
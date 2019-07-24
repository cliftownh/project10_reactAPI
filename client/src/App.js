import React, { Component } from 'react';
import { Provider } from './components/Context';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

// Import components
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      courses: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/courses')
    .then(res => {
      this.setState({
        courses: res.data
      });
    }).catch((err) => console.log(err));
  }

  render() {
    return (
      <Provider value={this.state.courses}>
        <BrowserRouter>
          <div className="App">
            <div className="header">
              <div className="bounds">
                  <h1 className="header--logo">Courses</h1>
                  <nav>
                      <Link to="/" className="signup">Sign Up</Link>
                      <Link to="/" className="signin">Sign In</Link>
                  </nav>
              </div>
            </div>
            <Switch>
              <Route exact path="/" component={Courses} />
              <Route exact path="/courses/:id" component={CourseDetail} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
      
    );
  }
}
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class CourseDetail extends Component {
  state = {
    authUser: this.props.context.authenticatedUser.user,
    course: {},
    creator: {},
    courseURL: this.props.match.url
  }

  componentDidMount() {
    this.getCourse()
  }

  getCourse() {
    axios.get(`http://localhost:5000/api${this.state.courseURL}`)
    .then(response => {
      this.setState({course: response.data});
      this.getCreator();
    }).catch((err) => console.log(err));
  }

  getCreator() {
    axios.get(`http://localhost:5000/api/users/${this.state.course.userId}`)
    .then( response => {
        this.setState({creator: response.data});
    }).catch((err) => console.log(err));
}

  render() {
    const { authUser, course, creator, courseURL } = this.state;
    
    let list;
    let materials;
    let isCreator = false;

    if (authUser.id === creator.id) {
      isCreator = true;
    }
    
    if (course.materialsNeeded) {
      if (course.materialsNeeded.includes(',')) {
        materials = course.materialsNeeded.split(',');
      }

      list = materials.map((li) =>
        <li key={materials.indexOf(li)}>{li}</li>
      );
    }

    return (
        <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">

              {isCreator ? 
                <span>
                  <Link to={`${courseURL}/update`} className="button">Update Course</Link>
                  <Link to="/" className="button">Delete Course</Link>
                </span>
                : null
              }
              <Link to="/" className="button button-secondary">Return to List</Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
              <p>by {creator.name}</p>
            </div>
            <div className="course--description">
              <p>{course.description}</p>
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                {
                  (course.estimatedTime)
                  ? <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <h3>{course.estimatedTime}</h3>
                    </li>
                  : null
                }
                {
                  (course.materialsNeeded)
                  ? <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ul>
                        { list }
                      </ul>
                    </li>
                  : null
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
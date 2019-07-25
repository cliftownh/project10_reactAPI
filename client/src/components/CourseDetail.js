import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class CourseDetail extends Component {
    // let { id } = match.params;
    // console.log(id);

    // let users;

    // axios.get('http://localhost:5000/api/users/all')
    // .then(res => {
    //   users = res.data;
    // }).catch((err) => console.log(err));

    // console.log(users);


  constructor(props) {
    super();
    this.state = {
        course: {},
        courseURL: props.match.url,
    };
  }

  componentDidMount() {
    this.getCourse()
  }

  getCourse() {
    axios.get(`http://localhost:5000/api${this.state.courseURL}`)
    .then(res => {
      this.setState({course: res.data});
    }).catch((err) => console.log(err));
  }

  render() {
    const course = this.state.course;
    
    let list;
    let materials;
    
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
              <span>
                <Link to={`/courses/${course.id}/update`} className="button">Update Course</Link>
                <Link to="/" className="button">Delete Course</Link>
              </span>
              <Link to="/" className="button button-secondary">Return to List</Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
              <p>by User ID: {course.userId}</p>
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
                  : ''
                }
                {
                  (course.materialsNeeded)
                  ? <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ul>
                        { list }
                      </ul>
                    </li>
                  : ''
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
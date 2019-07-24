import React from 'react';
import { Consumer } from './Context';
import { Link } from 'react-router-dom';
// import axios from 'axios';

const CourseDetail = ({match}) => {
    let id = (match.params.id - 1);

    // let users;

    // axios.get('http://localhost:5000/api/users/all')
    // .then(res => {
    //   users = res.data;
    // }).catch((err) => console.log(err));

    // console.log(users);

    return (
        <Consumer>
            { context => {
                const course = context[id];

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
                          <p>By Joe Smith</p>
                        </div>
                        <div className="course--description">
                          <p>{course.description}</p>
                        </div>
                      </div>
                      <div className="grid-25 grid-right">
                        <div className="course--stats">
                          <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                              <h4>Estimated Time</h4>
                              <h3>{course.estimatedTime}</h3>
                            </li>
                            <li className="course--stats--list--item">
                              <h4>Materials Needed</h4>
                              <ul>
                                <li>1/2 x 3/4 inch parting strip</li>
                                <li>1 x 2 common pine</li>
                                <li>1 x 4 common pine</li>
                                <li>1 x 10 common pine</li>
                                <li>1/4 inch thick lauan plywood</li>
                                <li>Finishing Nails</li>
                                <li>Sandpaper</li>
                                <li>Wood Glue</li>
                                <li>Wood Filler</li>
                                <li>Minwax Oil Based Polyurethane</li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
            }}
        </Consumer>
    );
}

export default CourseDetail;
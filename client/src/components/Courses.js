import React from 'react';
import { Consumer } from './Context';
import { Link } from 'react-router-dom';

const Courses = () => {
    return (
        <Consumer>
            { context => {
                const courseList = context.map((course) =>
                    <div key={course.id} className="grid-33">
                        <Link to={`/courses/${course.id}`}>
                            <li className="course--module course--link">
                                <h4 className="course--label">Course</h4>
                                <h3 className="course--title">{course.title}</h3>
                            </li>
                        </Link>
                    </div>
                );
                
                return (
                    <div>
                        <div className="bounds">
                            {courseList}
                        </div>
                    </div>
                );
            }}
        </Consumer>
    );
};
export default Courses;
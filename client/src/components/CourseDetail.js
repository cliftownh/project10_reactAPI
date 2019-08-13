import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import axios from 'axios';

export default class CourseDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authUser: {},
      course: {},
      creator: {},
      deleteClicked: false,
      courseURL: props.match.url,
      errors: [],
      loading: true
    }
    
    this.deleteButton = this.deleteButton.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    if (this.props.context.authenticatedUser) {
      this.setState({authUser: this.props.context.authenticatedUser.user});
    }
    this.getCourse();
    this.props.context.from = this.props.location.pathname;
  }

  getCourse() {
    axios.get(`http://localhost:5000/api${this.state.courseURL}`)
    .then(response => {
      if (response.status !== 200) {
        this.setState({ errors: response });
      } else {
        this.setState({ course: response.data, loading: false });
        this.getCreator();
      }
    }).catch((err) => {
      console.log(err);
      this.props.history.push('/notfound');
    });
  }

  getCreator() {
    axios.get(`http://localhost:5000/api/users/${this.state.course.userId}`)
    .then( response => {
        this.setState({creator: response.data});
    }).catch((err) => console.log(err));
  }

  deleteButton() {
    this.setState(prevState => ({ deleteClicked: !prevState.deleteClicked }));
  }

  render() {
    // let list;
    // let materials;
    // let isCreator = false;
    const { authUser, course, creator, courseURL } = this.state;
    const { deleteClicked } = this.state;

    // if (authUser.id === creator.id) {
    //   isCreator = true;
    // }
    
    // if (course.materialsNeeded) {
    //   if (course.materialsNeeded.includes(',')) {
    //     materials = course.materialsNeeded.split(',');
    //   }

    //   list = materials.map((li) =>
    //     <li key={materials.indexOf(li)}>{li}</li>
    //   );
    // }
    
    return (
        (this.state.loading)
        ? null
        :
        <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">

              {deleteClicked ? (
                <span>
                  <p>Are you sure you want to delete this course?</p>
                  <button className="button" onClick={this.delete}>Yes</button>
                  <button className="button" onClick={this.deleteButton}>No</button>
                </span>
              ) : (
                <span>
                  {authUser.id === course.userId ? (
                    <span>
                      <Link to={`${courseURL}/update`} className="button">Update Course</Link>
                      <button className="button" onClick={this.deleteButton}>Delete Course</button>
                    </span>
                  ) : null }
                </span>
              )}
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
              <Markdown source={course.description} />
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
                    <Markdown source={course.materialsNeeded} />
                  </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  delete = () => {

    const { course } = this.state;

    const credentials = {
        username: this.props.context.authenticatedUser.user.username,
        password: this.props.context.authenticatedUser.password
    }

    this.props.context.data.delete(course, credentials)
    .then( response => {
        if (response.status !== 204) {
          this.setState({ errors: response });
          console.log(this.state.errors);
        } else {
          this.props.history.push('/');
          return response;
        }
    }).catch( err => {
        console.log(err);
        this.props.history.push('/error');
    });
}
}
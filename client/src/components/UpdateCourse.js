import React, { Component } from 'react';
import Form from './Form';
import axios from 'axios';

export default class UpdateCourse extends Component {
    state = {
        authUser: this.props.context.authenticatedUser.user,
        id: this.props.match.params.id,
        courseURL: `/courses/${this.props.match.params.id}`,
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        userId: '',
        errors: [],
        loading: true,
    }

    componentDidMount() {
        this.getCourse();
    }

    getCourse() {
        axios.get(`http://localhost:5000/api${this.state.courseURL}`)
        .then(response => {
          if (response.status !== 200) {
              this.setState({ errors: response });
              console.log(this.state.errors);
          } else {
            const course = response.data;
            console.log(this.state.authUser.id, course.userId)
            if (this.state.authUser.id !== course.userId) {
                this.props.history.push('/forbidden');
                return null;
            }
            if (this.props.context.authenticatedUser.user.id !== this.state.courseCreatorId) {
                // Check CourseCreatorId against Authenticated User's id to verify permission to access page.
                this.props.history.push('/forbidden')
            }
            if (course.materialsNeeded === null) {
                course.materialsNeeded = '';
            }
            if (course.userId !== this.state.authUser) {
                // course userId property against Authenticated User's id to verify permission to access page.
                this.props.history.push('/forbidden')
            }
            this.setState({
                title: course.title,
                description: course.description,
                estimatedTime: course.estimatedTime,
                materialsNeeded: course.materialsNeeded,
                userId: course.userId,
                loading: false,
            });
          }
        }).catch((err) => {
            console.log(err);
            this.props.history.push('/notfound');
        });
    }



    render() {
        const {
            authUser,
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;
        
        return (
            (this.state.loading)
            ? null
            : 
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                <div>
                    <Form 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Update Course"
                    elements={ () => (
                        <React.Fragment>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    className="input-title course--title--input"
                                    value={title} 
                                    onChange={this.change}
                                    placeholder="Course title..." />
                                </div>
                            <p>By {authUser.name}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea
                                    id="description"
                                    name="description" 
                                    value={description} 
                                    onChange={this.change}
                                    placeholder="Course description..." />
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input
                                            id="estimatedTime"
                                            name="estimatedTime"
                                            type="text"
                                            className="course--time--input"
                                            value={estimatedTime} 
                                            onChange={this.change}
                                            placeholder="___ Hours" />
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea
                                            id="materialsNeeded" 
                                            name="materialsNeeded" 
                                            value={materialsNeeded} 
                                            onChange={this.change}
                                            placeholder="List materials (Seperated by commas)" />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        </React.Fragment>
                    )} />
            </div>
        </div>
        );
    }

    change = (event) => {
        const { name } = event.target;
        const { value }= event.target;
    
        this.setState(() => {
          return {
            [name]: value
          };
        });
      }
    
      submit = () => {
          const { context } = this.props;
    
          const {
            id,
            title,
            description,
            estimatedTime,
            materialsNeeded
          } = this.state;
    
          // Updated course payload
          const course = {
            id,
            title,
            description,
            estimatedTime,
            materialsNeeded
          }

          const credentials = {
              username: this.props.context.authenticatedUser.user.username,
              password: this.props.context.authenticatedUser.password
          }
    
          context.data.update(course, credentials)
          .then( response => {
              if (response.status !== 204) {
                this.setState({ errors: response });
              } else {
                this.props.history.push(`/courses/${id}`);
                return response;
              }
          }).catch( err => {
              console.log(err);
              this.props.history.push('/error');
          });
      }
    
      cancel = () => {
          this.props.history.push(`/courses/${this.state.id}`);
      }
}
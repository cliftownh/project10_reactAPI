import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class UserSignIn extends Component {
    constructor() {
        super();
        this.state = {
            user: {}
        };
    }

    handleSubmit() {
        axios.get('http://localhost:5000/api/users')
        .then(res => {
          this.setState({user: res.data});
        }).catch((err) => console.log(err));
    }

    render() {
        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                        <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value=""/></div>
                        <div><input id="password" name="password" type="password" className="" placeholder="Password" value=""/></div>
                        <div className="grid-100 pad-bottom"><Link to="/" className="button" type="submit">Sign In</Link><Link to="/" className="button button-secondary">Cancel</Link></div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
                </div>
            </div>
        );
    }
}
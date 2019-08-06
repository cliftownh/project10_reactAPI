import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="bounds">
    <h1>Access Denied</h1>
    <p>Sorry, you are not authorized to visit this page.</p>
    <Link to="/" className="button button-secondary">Return to Courses</Link>
  </div>
);
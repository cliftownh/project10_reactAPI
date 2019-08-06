import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="bounds">
    <h1>Something Went Wrong</h1>
    <p>Sorry, an unexpected error occurred.</p>
    <Link to="/" className="button button-secondary">Return to Courses</Link>
  </div>
);
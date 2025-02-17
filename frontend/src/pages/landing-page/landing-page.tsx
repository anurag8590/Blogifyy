import React from 'react';
import './landing-page.css'

const LandingPage: React.FC = () => {
  const handleGetStarted = () => {
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div className="landing-page">
      <header className="header">
        <h1>Blogifyy</h1>
      </header>
      <main className="main-content">
        <p>
          Welcome to Blogifyy, your ultimate blogging platform. Share your thoughts,
          stories, and ideas with the world. Join our community of writers and
          start your blogging journey today!
        </p>
        <button onClick={handleGetStarted} className="get-started-button">
          Get Started
        </button>
      </main>
      <footer className="footer">
        <p>&copy; 2023 Blogifyy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

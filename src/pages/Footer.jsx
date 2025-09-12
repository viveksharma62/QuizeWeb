import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-4 pb-2 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <h5 className="fw-bold mb-2">QuizWeb</h5>
            <p className="mb-0 small">
              &copy; {new Date().getFullYear()} QuizWeb. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="/" className="text-light me-3 text-decoration-none small">
              Home
            </a>
            <a href="/abouts" className="text-light me-3 text-decoration-none small">
              About
            </a>
            <a href="/Conatct" className="text-light text-decoration-none small">
              Contact
            </a>
          </div>
        </div>
        <hr className="border-secondary my-3" />
        <div className="text-center small">
          <span>
            Made with <span style={{ color: "#e25555" }}>&hearts;</span> by VivekSharma
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
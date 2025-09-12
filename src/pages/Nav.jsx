import React from "react";
import { Link } from "react-router-dom";

const Nav = ({ isLoggedIn}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
          QuizWeb
        </Link>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav fw-medium">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">
                Home
              </Link>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/quizestart">
                    QuizeStart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/features">
                    Features
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/contact">
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/account">
                    Account
                  </Link>
                </li>
              </>
            )}

            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

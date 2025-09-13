import React from "react";
import { Link, useLocation } from "react-router-dom";

const Nav = ({ isLoggedIn }) => {
  const location = useLocation(); // current path check for active link

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <nav className="navbar navbar-expand-lg sticky-top custom-navbar shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-3 text-light" to="/">
          <span className="text-warning">⚡</span> QuizoPedia
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav fw-medium">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/")}`} to="/">
                Home
              </Link>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/quizestart")}`}
                    to="/quizestart"
                  >
                    Quizzes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/features")}`}
                    to="/features"
                  >
                    Study Material
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/contact")}`}
                    to="/contact"
                  >
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/account")}`}
                    to="/account"
                  >
                    Account
                  </Link>
                </li>
              </>
            )}

            {!isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="btn btn-light text-primary fw-bold px-4 ms-2 shadow-sm"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .custom-navbar {
          background: linear-gradient(90deg, #0d6efd, #6610f2);
        }

        .nav-link {
          color: white !important;
          transition: color 0.3s ease, transform 0.2s ease;
        }
        .nav-link:hover {
          color: #ffc107 !important;
          transform: translateY(-2px);
        }
        .active-link {
          color: #ffc107 !important;
          font-weight: 600;
          border-bottom: 2px solid #ffc107;
        }
      `}</style>
    </nav>
  );
};

export default Nav;

import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorMes = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: "100%" }}>
        <div className="card-body text-center">
          <div className="mb-3">
            <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: "2.5rem" }}></i>
          </div>
          <h4 className="card-title text-danger mb-2">Login Failed</h4>
          <p className="text-muted mb-4">
            Wrong username or password.<br />
            Please try again.
          </p>
          <button
            className="btn btn-primary w-100"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMes;
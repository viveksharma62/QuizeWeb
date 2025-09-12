import React from "react";

const Contact = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        {/* Card wrapper */}
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center text-primary mb-4 fw-bold">
                📩 Contact Us
              </h2>
              <p className="text-center text-muted mb-4">
                Have questions or feedback? Fill out the form below and we’ll get back to you soon.
              </p>

              {/* Form */}
              <form>
                <div className="mb-3">
                  <label className="form-label fw-medium">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your message..."
                    required
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg shadow">
                    🚀 Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

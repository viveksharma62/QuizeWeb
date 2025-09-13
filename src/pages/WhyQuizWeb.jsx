import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { BiCheckCircle } from "react-icons/bi";
import myImg from "../assets/myImg1.png";
import "./WhyQuizWeb.css"; // custom styles if needed

const features = [
  { title: "Wide range of quiz topics", icon: <BiCheckCircle /> },
  { title: "User-friendly and responsive design", icon: <BiCheckCircle /> },
  { title: "Compete with friends and track progress", icon: <BiCheckCircle /> },
];

const WhyQuizWeb = () => {
  return (
    <section className="why-quizweb py-5" style={{ background: "#f0f8ff" }}>
      <Container>
        <Row className="align-items-center">
          {/* Text + Features */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <h3 className="fw-bold mb-3 text-primary animate__animated animate__fadeInLeft">
              Interactive & Fun Learning
            </h3>
            <p className="lead text-dark mb-4 animate__animated animate__fadeInLeft animate__delay-1s">
              Quizopedia is designed to make learning exciting and engaging. Test your knowledge, challenge friends, and explore quizzes across multiple topics.
            </p>

            <div className="feature-cards">
              {features.map((f, idx) => (
                <Card
                  key={idx}
                  className="mb-3 feature-card p-3 shadow-sm"
                  style={{
                    borderRadius: "15px",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span
                      className="feature-icon text-success fs-4 me-3"
                      style={{ minWidth: "40px", textAlign: "center" }}
                    >
                      {f.icon}
                    </span>
                    <span className="feature-text fw-bold">{f.title}</span>
                  </div>
                </Card>
              ))}
            </div>

            <p className="text-muted mt-3">
              Our mission is to make learning accessible and fun for everyone. Join Quizopedia today and start your quiz journey!
            </p>
          </Col>

          {/* Image */}
          <Col lg={6} className="text-center animate__animated animate__fadeInRight">
            <img
              src="https://media.istockphoto.com/id/2205489078/vector/man-laptop-resume-cv-job-search-online-cartoon.jpg?s=612x612&w=0&k=20&c=qHo6ij_XCPSeQBb_OF0X1pc_o1K4477aqRw_UdjLlcA="
              alt="QuizWeb Illustration"
              className="img-fluid rounded shadow-lg"
              style={{
                maxHeight: "400px",
                objectFit: "cover",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WhyQuizWeb;

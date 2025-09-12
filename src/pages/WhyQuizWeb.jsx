import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { BiCheckCircle } from "react-icons/bi";
import "./WhyQuizWeb.css"; // custom styles

const features = [
  { title: "Wide range of quiz topics", icon: <BiCheckCircle /> },
  { title: "User-friendly and responsive design", icon: <BiCheckCircle /> },
  { title: "Compete with friends and track progress", icon: <BiCheckCircle /> },
];

const WhyQuizWeb = () => {
  return (
    <section className="why-quizweb py-5 bg-light">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h3 className="fw-bold mb-3">Interactive & Fun Learning</h3>
            <p className="lead text-muted mb-4">
              QuizWeb is designed to make learning exciting and engaging. Test your knowledge, challenge friends, and explore quizzes across multiple topics.
            </p>
            
            <div className="feature-cards">
              {features.map((f, idx) => (
                <Card key={idx} className="mb-3 shadow-sm feature-card p-3">
                  <div className="d-flex align-items-center">
                    <span className="feature-icon text-success fs-4 me-3">{f.icon}</span>
                    <span className="feature-text">{f.title}</span>
                  </div>
                </Card>
              ))}
            </div>
            
            <p className="text-muted mt-3">
              Our mission is to make learning accessible and fun for everyone. Join QuizWeb today and start your quiz journey!
            </p>
          </Col>

          <Col lg={6} className="text-center">
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"
              alt="QuizWeb Illustration"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WhyQuizWeb;

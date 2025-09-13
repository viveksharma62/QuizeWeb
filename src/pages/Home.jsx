import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "animate.css";
import "./Home.css";
import Testimonial from "./Testimonial";
import WhyQuizWeb from "./WhyQuizWeb";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section (unchanged) */}
      <section className="hero-section d-flex align-items-center text-center text-white">
        <Container>
          <div className="animate__animated animate__fadeInDown">
            <h1 className="display-4 fw-bold mb-3">
              Welcome to <span className="text-warning">Quizopedia</span> 🎯
            </h1>
            <p className="lead text-light mb-4">
              Test your knowledge, challenge your friends, and make learning fun!
            </p>
            <div>
              <button
                className="btn btn-warning btn-lg px-4 me-3 shadow"
                onClick={() => navigate("/quizestart")}
              >
                Start Quiz 🚀
              </button>
              <button
                className="btn btn-outline-light btn-lg px-4 shadow"
                onClick={() => navigate("/features")}
              >
                Learn More
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* About Our Quizzes (Improved UI) */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%)" }}>
        <Container>
          <Row className="align-items-center">
            {/* Image */}
            <Col md={6} className="mb-4 mb-md-0 text-center">
              <Card className="shadow-lg border-0 rounded-4" style={{ overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src="https://images.quiz-maker.com/images/e0c99e73-8290-4331-e314-eb51c7d02100/public"
                  className="img-fluid"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              </Card>
            </Col>

            {/* Text */}
            <Col md={6}>
              <h2 className="fw-bold text-primary mb-3 animate__animated animate__fadeInDown">
                About Our Quizzes
              </h2>
              <p className="lead text-dark animate__animated animate__fadeInUp">
                Our quizzes are designed to <span className="fw-bold">boost your knowledge</span> 
                and make learning enjoyable. Explore multiple categories, challenge your friends, 
                and track your progress with ease.
              </p>

              <ul className="list-unstyled mt-3">
                <li className="mb-2 d-flex align-items-center">
                  <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                  <span>Fast & Engaging Quizzes</span>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <i className="bi bi-graph-up-arrow text-success me-2"></i>
                  <span>Track Your Learning Progress</span>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <i className="bi bi-people-fill text-info me-2"></i>
                  <span>Compete with Friends</span>
                </li>
              </ul>

              <Button
                variant="primary"
                size="lg"
                className="mt-3 shadow-sm rounded-pill px-4"
                onClick={() => navigate("/quizestart")}
              >
                Start Your Quiz Journey 🚀
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why QuizWeb Section (Improved Cards UI) */}
      <section className="py-5" style={{ background: "#ffffff" }}>
        <Container>
          <h2 className="text-center mb-5 fw-bold" style={{ color: "#0d6efd" }}>Why Quizopedia?</h2>
          <Row className="justify-content-center">
            <WhyQuizWeb />
          </Row>
        </Container>
      </section>

      {/* Testimonial Section (Improved UI) */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <Container>
          <h2 className="text-center mb-5 fw-bold" style={{ color: "#6610f2" }}>What Our Users Say</h2>
          <Row className="g-4">
            <Testimonial />
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;

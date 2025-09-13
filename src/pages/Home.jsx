import { Container, Row, Col } from "react-bootstrap";
import "animate.css";
import "./Home.css"; 
import Testimonial from "./Testimonial";
import WhyQuizWeb from "./WhyQuizWeb";
import { useNavigate } from "react-router-dom";

const Home = () => {
 
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
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


      {/* About Our Quizzes */}
        <section className="py-5 bg-gradient">
          <Container>
            <Row className="align-items-center">
              {/* Image Section */}
              <Col md={6} className="mb-4 mb-md-0 text-center">
                <img
                  src="https://cdn.pixabay.com/photo/2017/03/31/22/51/quiz-2192590_960_720.jpg"
                  alt="Quiz"
                  className="img-fluid rounded shadow-lg about-img"
                />
              </Col>

              {/* Text Section */}
              <Col md={6}>
                <h2 className="fw-bold text-primary mb-3 animate__animated animate__fadeInDown">
                  About Our Quizzes
                </h2>
                <p className="lead text-muted animate__animated animate__fadeInUp">
                  Our quizzes are designed to <span className="fw-bold text-dark">boost your knowledge</span> 
                  and make learning enjoyable. Explore multiple categories, challenge your friends, 
                  and track your progress with ease.
                </p>

                {/* Features List */}
                <ul className="list-unstyled mt-3">
                  <li className="mb-2">
                    <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                    Fast & Engaging Quizzes
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-graph-up-arrow text-success me-2"></i>
                    Track Your Learning Progress
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-people-fill text-info me-2"></i>
                    Compete with Friends
                  </li>
                </ul>

                {/* CTA Button */}
                <button className="btn btn-primary mt-3 px-4 shadow-sm" onClick={() => navigate("/quizestart")}>
                  Start Your Quiz Journey 🚀
                </button>
              </Col>
            </Row>
          </Container>
        </section>


      {/* Why QuizWeb Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-4">Why Quizopedia?</h2>
          <Row className="justify-content-center align-items-center">
            <WhyQuizWeb />
          </Row>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4">What Our Users Say</h2>
          <Row>
            <Testimonial />
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;

import React from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import "animate.css";
import "./Home.css"; // Custom CSS

const Home = () => {
  const testimonials = [
    {
      name: "John D.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      msg: "Amazing quizzes! Learned so much and had fun at the same time.",
      rating: 5,
    },
    {
      name: "Priya S.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      msg: "The UI is beautiful and the quizzes are challenging!",
      rating: 4,
    },
    {
      name: "Vivek R.",
      img: "https://randomuser.me/api/portraits/men/65.jpg",
      msg: "I love competing with my friends on this platform.",
      rating: 5,
    },
    {
      name: "Sara L.",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      msg: "Fun quizzes and great learning experience every time!",
      rating: 4,
    },
  ];

  // Function to render stars
  const renderStars = (rating) => {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? "⭐" : "☆";
    }
    return stars;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container className="text-center overflow-hidden">
          <div className="scrolling-text">
            <h1>Welcome to QuizMaster! Test Your Knowledge and Have Fun!</h1>
          </div>
        </Container>
      </section>

      {/* About Our Quizzes */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img
                src="https://cdn.pixabay.com/photo/2017/03/31/22/51/quiz-2192590_960_720.jpg"
                alt="Quiz 3D"
                className="img-fluid mb-3"
              />
            </Col>
            <Col md={6}>
              <h2>About Our Quizzes</h2>
              <p>
                Our quizzes are designed to improve your knowledge and make
                learning fun. You can take quizzes on multiple topics, track
                your progress, and compete with friends.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why QuizWeb Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-4">Why QuizWeb?</h2>
          <Row className="justify-content-center align-items-center">
            <Col lg={7} className="mb-4 mb-lg-0">
              <h3 className="fw-bold text-primary mb-3">Interactive & Fun</h3>
              <p className="lead text-muted mb-4">
                QuizWeb is an interactive platform designed to make learning fun
                and engaging. Whether you want to test your knowledge, challenge
                friends, or simply learn something new, QuizWeb offers a variety
                of quizzes across different topics.
              </p>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item bg-transparent">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Wide range of quiz topics
                </li>
                <li className="list-group-item bg-transparent">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  User-friendly and responsive design
                </li>
                <li className="list-group-item bg-transparent">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Compete with friends and track your progress
                </li>
              </ul>
              <p className="text-muted">
                Our mission is to create a fun and accessible way for everyone
                to learn and grow. Join us and start your quiz journey today!
              </p>
            </Col>
            <Col lg={5} className="text-center">
              <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=500&q=80"
                alt="About QuizWeb"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "320px", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4">What Our Users Say</h2>
          <Row className="g-3">
            {testimonials.map((t, i) => (
              <Col md={3} key={i}>
                <Card className="mb-3 shadow-sm text-center p-3">
                  <Image
                    src={t.img}
                    roundedCircle
                    width={80}
                    height={80}
                    className="mb-2"
                  />
                  <Card.Body>
                    <Card.Text className="testimonial-text">{t.msg}</Card.Text>
                    <Card.Subtitle className="text-muted">
                      - {t.name}
                    </Card.Subtitle>
                    <p className="mt-1">{renderStars(t.rating)}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;

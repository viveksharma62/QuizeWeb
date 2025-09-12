import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button } from "react-bootstrap";
import { db } from "../db/firebase"; // Firebase config
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import "./Testimonial.css"; // Custom CSS for professional look

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [rating, setRating] = useState(5);

  const testimonialCol = collection(db, "testimonials");

  const fetchTestimonials = async () => {
    const q = query(testimonialCol, orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !msg) return alert("Please fill all fields!");

    await addDoc(testimonialCol, {
      name,
      msg,
      rating: Number(rating),
      img: "https://cdn-icons-png.flaticon.com/256/4042/4042356.png", // default image
      timestamp: new Date()
    });

    setName("");
    setMsg("");
    setRating(5);

    fetchTestimonials();
  };

  const renderStars = (rating) => {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? "★" : "☆";
    }
    return stars;
  };

  return (
    <>
      {/* Input Form */}
      <Row className="mb-5 justify-content-center">
        <Col lg={6}>
          <Card className="testimonial-form shadow-lg p-4">
            <h4 className="text-center mb-4">Share Your Feedback</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write your feedback"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Rating</Form.Label>
                <Form.Select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Bad</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 btn-lg">
                Submit Feedback
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Testimonials Display */}
      <Row className="g-4">
        {testimonials.map((t, i) => (
          <Col md={6} key={i}>
            <Card className="testimonial-card shadow-sm border-0 p-4 text-center h-100">
              <div className="testimonial-img-wrapper mb-3">
                <img
                  src={t.img || "https://i.pravatar.cc/150?img=65"}
                  alt={t.name}
                  className="rounded-circle testimonial-img"
                />
              </div>
              <Card.Body>
                <Card.Text className="testimonial-text mb-2">"{t.msg}"</Card.Text>
                <Card.Subtitle className="text-muted mb-2">- {t.name}</Card.Subtitle>
                <p className="testimonial-stars">{renderStars(t.rating)}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Testimonial;

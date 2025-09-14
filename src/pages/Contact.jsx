import React, { useState, useEffect } from "react";
import { db } from "../db/firebase"; 
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FaEnvelope, FaPaperPlane, FaCommentDots } from "react-icons/fa";
import "./ContactAnimation.css"; // CSS for floating icons

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        reply: "",
        timestamp: serverTimestamp(),
      });

      setSuccess("✅ Message sent successfully!");
      setUserEmail(formData.email);
      localStorage.setItem("userEmail", formData.email);
      setFormData({ name: "", email: formData.email, message: "" });
    } catch (error) {
      console.error("Error saving contact:", error);
      setSuccess("❌ Failed to send message. Try again!");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!userEmail) return;
    const q = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserMessages(data.filter((msg) => msg.email === userEmail));
    });
    return () => unsubscribe();
  }, [userEmail]);

  return (
    <Container fluid className="min-vh-100 py-5 position-relative" style={{ background: "#f0f4f8" }}>
      
      {/* Floating Icons */}
      <FaEnvelope className="floating-icon icon1" />
      <FaPaperPlane className="floating-icon icon2" />
      <FaCommentDots className="floating-icon icon3" />

      <Row className="w-100 justify-content-center">
        <Col lg={6} md={8} sm={10}>
          <Card className="shadow-lg p-4 rounded-4 bg-white position-relative z-1">
            <h2 className="text-center mb-3" style={{ color: "#007bff" }}>📩 Contact Us</h2>
            <p className="text-center text-muted mb-4">Have questions or feedback? Fill out the form below and we’ll get back to you soon.</p>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="Write your message..." name="message" value={formData.message} onChange={handleChange} required />
              </Form.Group>
              <div className="d-grid mb-2">
                <Button variant="primary" size="lg" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "🚀 Send Message"}
                </Button>
              </div>
            </Form>

            {success && <Alert variant={success.includes("✅") ? "success" : "danger"} className="text-center mt-2">{success}</Alert>}
          </Card>
        </Col>
      </Row>

      {userMessages.length > 0 && (
        <Row className="w-100 justify-content-center mt-5">
          <Col lg={8} md={10}>
            <h4 className="mb-3" style={{ color: "#2c3e50" }}>📜 Your Messages & Replies</h4>
            <Row className="g-3">
              {userMessages.map((msg) => (
                <Col key={msg.id} md={12}>
                  <Card className="shadow-sm rounded-4 p-3 bg-white">
                    <p className="mb-1"><strong>📝 Message:</strong> {msg.message}</p>
                    <p className="text-muted small">{msg.timestamp?.toDate().toLocaleString()}</p>
                    {msg.reply ? (
                      <Alert variant="success" className="mt-2"><strong>✅ Admin Reply:</strong> {msg.reply}</Alert>
                    ) : (
                      <Alert variant="warning" className="mt-2">⏳ Waiting for admin reply...</Alert>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}

    </Container>
  );
};

export default Contact;

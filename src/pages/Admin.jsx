import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <Container className="my-5">
      <h1 className="text-center fw-bold mb-4 text-primary">Admin Dashboard</h1>
      <Row className="g-4">
        {/* Add Question Section */}
        <Col md={6}>
          <Card className="shadow-lg border-0 rounded-4 h-100 p-4 hover-card">
            <h3 className="fw-bold text-success">Add Question</h3>
            <p className="text-muted fs-6">
              Create and manage quiz or exam questions here. Keep your question bank updated easily.
            </p>
            <Button
              variant="success"
              className="px-4 py-2 rounded-pill shadow-sm"
              onClick={() => navigate("/addquest")}
            >
              Add Question
            </Button>
          </Card>
        </Col>

        {/* Add Content Section */}
        <Col md={6}>
          <Card className="shadow-lg border-0 rounded-4 h-100 p-4 hover-card">
            <h3 className="fw-bold text-info">Add Content</h3>
            <p className="text-muted fs-6">
              Upload learning materials, notes, and study content. Help your students with more resources.
            </p>
            <Button
              variant="info"
              className="px-4 py-2 rounded-pill shadow-sm"
              onClick={() => navigate("/addcontent")}
            >
              Add Content
            </Button>
          </Card>
        </Col>

        {/* Show Contact Messages Section */}
        <Col md={6}>
          <Card className="shadow-lg border-0 rounded-4 h-100 p-4 hover-card">
            <h3 className="fw-bold text-warning">Show Messages</h3>
            <p className="text-muted fs-6">
              View all contact messages submitted by users. Stay connected with your audience easily.
            </p>
            <Button
              variant="warning"
              className="px-4 py-2 rounded-pill shadow-sm"
              onClick={() => navigate("/contactshow")}
            >
              Show Messages
            </Button>
          </Card>
        </Col>

        {/* Student Details Section */}
        <Col md={6}>
          <Card className="shadow-lg border-0 rounded-4 h-100 p-4 hover-card">
            <h3 className="fw-bold text-primary">Student Details</h3>
            <p className="text-muted fs-6">
              View all registered students and their quiz history. Manage student information easily.
            </p>
            <Button
              variant="primary"
              className="px-4 py-2 rounded-pill shadow-sm"
              onClick={() => navigate("/studentdetails")}
            >
              View Students
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;

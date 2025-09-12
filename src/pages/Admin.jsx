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
            <p className="text-muted fs-5">
              Create and manage quiz or exam questions here.  
              Click below to add new questions and keep your database updated.
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
            <p className="text-muted fs-5">
              Upload learning materials, notes, and other study content.  
              Click below to add content for your students.
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
      </Row>
    </Container>
  );
};

export default Admin;

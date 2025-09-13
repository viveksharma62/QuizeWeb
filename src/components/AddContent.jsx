import React, { useState } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../db/firebase.js";

const AddFeature = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    image: "",
    exampleCode: "",
    outputUrl: "",
    category: "", // react / node / etc
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await addDoc(collection(db, "features"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setMsg("✅ Feature added successfully!");
      setFormData({
        title: "",
        shortDescription: "",
        fullDescription: "",
        image: "",
        exampleCode: "",
        outputUrl: "",
        category: "",
      });
    } catch (error) {
      console.error("Error uploading feature:", error);
      setMsg("❌ Upload failed, try again!");
    }

    setLoading(false);
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
        {/* Header */}
        <div
          className="p-4 text-white"
          style={{ background: "linear-gradient(90deg,#28a745,#20c997)" }}
        >
          <h2 className="fw-bold text-center mb-0">➕ Add Feature</h2>
        </div>

        {/* Form */}
        <div className="p-4 bg-light">
          <Form onSubmit={handleSubmit}>
            {/* Title */}
            <Form.Group className="mb-4" controlId="title">
              <Form.Label className="fw-bold">📝 Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title (e.g. Learn React)"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Short Description */}
            <Form.Group className="mb-4" controlId="shortDescription">
              <Form.Label className="fw-bold">📖 Short Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Small intro for feature card"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Full Description */}
            <Form.Group className="mb-4" controlId="fullDescription">
              <Form.Label className="fw-bold">📘 Full Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Detailed content for Learning page"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Banner Image */}
            <Row className="mb-4">
              <Col md={8}>
                <Form.Group controlId="image">
                  <Form.Label className="fw-bold">🖼 Banner Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter banner image URL"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="img-fluid rounded shadow-lg"
                    style={{ maxHeight: "120px", border: "3px solid #fff" }}
                  />
                ) : (
                  <div className="text-muted">Image Preview</div>
                )}
              </Col>
            </Row>

            {/* Example Code */}
            <Form.Group className="mb-4" controlId="exampleCode">
              <Form.Label className="fw-bold">💻 Example Code</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write example code here..."
                name="exampleCode"
                value={formData.exampleCode}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Output Image */}
            <Form.Group className="mb-4" controlId="outputUrl">
              <Form.Label className="fw-bold">🖼 Output Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter output image URL"
                name="outputUrl"
                value={formData.outputUrl}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-4" controlId="category">
              <Form.Label className="fw-bold">📂 Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                <option value="react">React</option>
                <option value="node">Node.js</option>
                <option value="mongodb">MongoDB</option>
                <option value="express">Express.js</option>
                <option value="html">HTML</option>
              </Form.Select>
            </Form.Group>

            {/* Submit */}
            <div className="text-center">
              <Button
                variant="success"
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-pill shadow-sm fw-bold"
                style={{
                  background: "linear-gradient(90deg,#28a745,#20c997)",
                  border: "none",
                }}
              >
                {loading ? "⏳ Uploading..." : "🚀 Add Feature"}
              </Button>
            </div>

            {/* Message */}
            {msg && <p className="text-center mt-3 fw-bold">{msg}</p>}
          </Form>
        </div>
      </Card>
    </Container>
  );
};

export default AddFeature;
